import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AlertService } from './alert.service';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
    constructor(private readonly alertService: AlertService) { }

    @Post()
    @ApiOperation({ summary: 'Set price alert' })
    async setAlert(
        @Body() alertData: { chain: string; targetPrice: number; email: string },
    ) {
        return this.alertService.createAlert(alertData);
    }
}