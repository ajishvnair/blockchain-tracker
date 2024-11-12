import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceModule } from './price/price.module';
import { AlertModule } from './alert/alert.module';
import { EmailModule } from './email/email.module';
import { Price } from './price/price.entity';
import { Alert } from './alert/alert.entity';
import configuration from './config/configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get('database.url'),
                entities: [Price, Alert],
                synchronize: false, // Set to false to prevent auto-schema updates
                logging: ['error', 'warn'],
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            }),
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        PriceModule,
        AlertModule,
        EmailModule,
    ],
})
export class AppModule { }