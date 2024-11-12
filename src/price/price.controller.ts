import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PriceService } from './price.service';

@ApiTags('prices')
@Controller('prices')
export class PriceController {
    constructor(private readonly priceService: PriceService) { }

    @Get('hourly')
    @ApiOperation({ summary: 'Get hourly prices for the last 24 hours' })
    @ApiQuery({ name: 'chain', enum: ['ethereum', 'polygon'] })
    async getHourlyPrices(@Query('chain') chain: string) {
        return this.priceService.getHourlyPrices(chain);
    }

    @Get('swap-rate')
    @ApiOperation({ summary: 'Get ETH to BTC swap rate' })
    @ApiQuery({ name: 'ethAmount', type: 'number' })
    async getSwapRate(@Query('ethAmount') ethAmount: number) {
        return this.priceService.getSwapRate(ethAmount);
    }
}