import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SwapRateDto {
    @ApiProperty({
        description: 'Amount of ETH to swap',
        example: 1.0,
        minimum: 0,
    })
    @IsNumber()
    @Min(0)
    ethAmount: number;
}