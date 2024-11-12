import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // Swagger setup
    const config = new DocumentBuilder()
        .setTitle('Blockchain Price Tracker')
        .setDescription('API for tracking cryptocurrency prices and setting alerts')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();