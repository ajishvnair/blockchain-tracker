import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Alert } from './alert.entity';
import { PriceService } from '../price/price.service';
import { EmailService } from '../email/email.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertService {
    private readonly logger = new Logger(AlertService.name);

    constructor(
        @InjectRepository(Alert)
        private alertRepository: Repository<Alert>,
        private priceService: PriceService,
        private emailService: EmailService,
    ) { }

    async createAlert(createAlertDto: CreateAlertDto): Promise<Alert> {
        const alert = this.alertRepository.create({
            chain: createAlertDto.chain,
            targetPrice: createAlertDto.targetPrice,
            email: createAlertDto.email,
            triggered: false,
        });
        return this.alertRepository.save(alert);
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async checkAlerts() {
        try {
            const alerts = await this.alertRepository.find({
                where: { triggered: false },
            });

            for (const alert of alerts) {
                const currentPrice = await this.priceService.fetchPrice(alert.chain);
                if (this.shouldTriggerAlert(currentPrice, alert.targetPrice)) {
                    await this.triggerAlert(alert, currentPrice);
                }
            }
        } catch (error) {
            this.logger.error(`Error checking alerts: ${error.message}`);
        }
    }

    private shouldTriggerAlert(currentPrice: number, targetPrice: number): boolean {
        return currentPrice >= targetPrice;
    }

    private async triggerAlert(alert: Alert, currentPrice: number) {
        try {
            await this.emailService.sendEmail(
                alert.email,
                `Price Alert for ${alert.chain}`,
                `The price of ${alert.chain} has reached $${currentPrice}. ` +
                `Your alert was set for $${alert.targetPrice}.`
            );

            alert.triggered = true;
            await this.alertRepository.save(alert);
        } catch (error) {
            this.logger.error(`Error triggering alert: ${error.message}`);
        }
    }
}