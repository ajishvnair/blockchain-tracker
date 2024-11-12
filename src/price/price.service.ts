import { Injectable, Logger, HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import { MoreThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { Price } from './price.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class PriceService implements OnModuleInit {
    private readonly logger = new Logger(PriceService.name);

    // Token addresses and chain configurations
    private readonly TOKENS = {
        ethereum: {
            chain: EvmChain.ETHEREUM,
            address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
        },
        polygon: {
            chain: EvmChain.POLYGON,
            address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
        },
        bitcoin: {
            chain: EvmChain.ETHEREUM,
            address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
        },
    };

    constructor(
        @InjectRepository(Price)
        private priceRepository: Repository<Price>,
        private emailService: EmailService,
    ) { }

    async onModuleInit() {
        try {
            // Start Moralis SDK
            await Moralis.start({
                apiKey: process.env.MORALIS_API_KEY,
            });
            this.logger.log('Moralis SDK initialized successfully');
        } catch (error) {
            this.logger.error(`Failed to initialize Moralis SDK: ${error.message}`);
            throw error;
        }
    }

    @Cron('*/5 * * * *') // Every 5 minutes
    async trackPrices() {
        try {
            const chains = ['ethereum', 'polygon'];
            for (const chain of chains) {
                const price = await this.fetchPrice(chain);
                if (price) {
                    await this.savePrice(chain, price);
                    await this.checkPriceChange(chain, price);
                }
            }
        } catch (error) {
            this.logger.error(`Error tracking prices: ${error.message}`);
        }
    }

    async fetchPrice(chain: string): Promise<number> {
        try {
            const tokenConfig = this.TOKENS[chain.toLowerCase()];
            if (!tokenConfig) {
                throw new Error(`Unsupported chain: ${chain}`);
            }

            // Get token price using Moralis SDK
            const response = await Moralis.EvmApi.token.getTokenPrice({
                address: tokenConfig.address,
                chain: tokenConfig.chain,
            });

            const price = response.toJSON().usdPrice;
            this.logger.debug(`Fetched ${chain} price: $${price}`);
            return price;

        } catch (error) {
            this.logger.error(`Error fetching price for ${chain}: ${error.message}`);
            throw new HttpException(
                `Unable to fetch price data for ${chain}`,
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    private async savePrice(chain: string, price: number) {
        try {
            const priceEntity = this.priceRepository.create({
                chain,
                price,
            });
            await this.priceRepository.save(priceEntity);
            this.logger.debug(`Saved price for ${chain}: $${price}`);
        } catch (error) {
            this.logger.error(`Error saving price: ${error.message}`);
        }
    }

    private formatTimestamp(date: Date): string {
        return date.toLocaleString('en-US', {
            month: 'short',  // e.g., "Nov"
            day: 'numeric', // e.g., "12"
            hour: '2-digit', // e.g., "02"
            minute: '2-digit', // e.g., "30"
            hour12: true // Use 12-hour format (AM/PM)
        });
    }

    private async checkPriceChange(chain: string, currentPrice: number) {
        try {
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);

            // Get the price from one hour ago
            const oldPrice = await this.priceRepository.findOne({
                where: {
                    chain,
                    timestamp: MoreThanOrEqual(oneHourAgo)
                },
                order: { timestamp: 'ASC' }, // Get the earliest price within the last hour
            });

            if (!oldPrice) {
                this.logger.debug(`No price found from one hour ago for ${chain}`);
                return;
            }

            // Calculate percentage increase
            const priceChange = ((currentPrice - oldPrice.price) / oldPrice.price) * 100;

            this.logger.debug(
                `Price change for ${chain}: ${priceChange.toFixed(2)}% ` +
                `(Old: $${oldPrice.price}, Current: $${currentPrice})`
            );

            // Only send email if price increased by more than 3%
            if (priceChange > 3) {
                await this.emailService.sendEmail(
                    'hyperhire_assignment@hyperhire.in',
                    `Price Alert: ${chain}`,
                    `The price of ${chain} has increased by ${priceChange.toFixed(2)}% in the last hour.\n\n` +
                    `Previous Price (${this.formatTimestamp(oldPrice.timestamp)}): $${oldPrice.price}\n` +
                    `Current Price (${this.formatTimestamp(new Date())}): $${currentPrice}`
                );
            }
        } catch (error) {
            this.logger.error(`Error checking price change: ${error.message}`);
        }
    }

    async getHourlyPrices(chain: string) {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        return this.priceRepository
            .createQueryBuilder('price')
            .where('price.chain = :chain', { chain })
            .andWhere('price.timestamp >= :timestamp', { timestamp: twentyFourHoursAgo })
            .orderBy('price.timestamp', 'DESC')
            .getMany();
    }

    async getSwapRate(ethAmount: number) {
        try {
            const ethPrice = await this.fetchPrice('ethereum');
            const btcPrice = await this.fetchPrice('bitcoin');

            const ethValue = ethAmount * ethPrice;
            const btcAmount = ethValue / btcPrice;

            const feePercentage = 0.03;
            const feeEth = ethAmount * feePercentage;
            const feeDollar = feeEth * ethPrice;

            return {
                btcAmount,
                fees: {
                    eth: feeEth,
                    dollar: feeDollar,
                },
            };
        } catch (error) {
            this.logger.error(`Error calculating swap rate: ${error.message}`);
            throw new HttpException(
                'Unable to calculate swap rate',
                HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }
}