import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { Alert } from './alert.entity';
import { PriceModule } from '../price/price.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [TypeOrmModule.forFeature([Alert]), PriceModule, EmailModule],
    controllers: [AlertController],
    providers: [AlertService],
})
export class AlertModule { }