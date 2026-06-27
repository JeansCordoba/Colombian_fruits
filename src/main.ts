import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from './infrastructure/config/app.config';
import { AppModule } from './interfaces/app.module';
import { DomainExceptionFilter } from './interfaces/http/filters/domain-exception.filter';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.useGlobalFilters(new DomainExceptionFilter());
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Colombian Fruits API')
        .setDescription('Native fruits catalog — Clean Architecture case study')
        .setVersion('0.0.1')
        .addTag('departments')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    const configService = app.get(ConfigService);
    const appConfig = configService.get<AppConfig>('app');
    const port = appConfig?.port ?? 3000;
    await app.listen(port);
}

bootstrap();
