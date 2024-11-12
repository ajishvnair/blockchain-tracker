import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { Price } from './price.entity';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [TypeOrmModule.forFeature([Price]), EmailModule],
    controllers: [PriceController],
    providers: [PriceService],
    exports: [PriceService],
})
export class PriceModule { }