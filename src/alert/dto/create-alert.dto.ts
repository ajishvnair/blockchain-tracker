import { IsString, IsNumber, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertDto {
    @ApiProperty({
        description: 'The blockchain to track (ethereum or polygon)',
        example: 'ethereum',
    })
    @IsString()
    chain: string;

    @ApiProperty({
        description: 'The target price to trigger the alert',
        example: 1000,
    })
    @IsNumber()
    targetPrice: number;

    @ApiProperty({
        description: 'Email address to receive the alert',
        example: 'user@example.com',
    })
    @IsEmail()
    email: string;
}