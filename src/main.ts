import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from './infrastructure/config/app.config';
import { AppModule } from './interfaces/app.module';
import { DomainExceptionFilter } from './interfaces/http/shared/filters/domain-exception.filter';
import { UnhandledExceptionFilter } from './interfaces/http/shared/filters/unhandled-exception.filter';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');
    if (!appConfig) {
        throw new Error('Application configuration is missing.');
    }
    app.enableCors({
        origin: appConfig.corsOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: false,
    });
    app.setGlobalPrefix('api/v1', { exclude: ['health'] });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.useGlobalFilters(new UnhandledExceptionFilter(), new DomainExceptionFilter());
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Colombian Fruits API')
        .setDescription(
            'Native fruits catalog — Clean Architecture case study. ' +
                'Base path: `/api/v1`. ' +
                'Success responses use `{ success: true, data, statusCode }` for single resources and `{ success: true, data, meta, statusCode }` for paginated lists. ' +
                'Errors follow `{ statusCode, message, error }` where `message` may be a string or string[]. ' +
                'DELETE operations perform a soft delete.',
        )
        .setVersion('0.0.1')
        .addTag('departments')
        .addTag('type-plants')
        .addTag('type-fruits')
        .addTag('climates')
        .addTag('natural-regions')
        .addTag('harvest-seasons')
        .addTag('families', 'Botanical families linked to a type plant')
        .addTag('fruits')
        .addTag('health')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    const port = appConfig.port;
    await app.listen(port);
}

bootstrap();
