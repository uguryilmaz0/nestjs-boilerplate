import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // NestJS Logger — Yapılandırılmış log çıktısı sağlar
  // NestJS Logger — Provides structured logging output
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 🏁 GLOBAL API PREFIX
  // Tüm endpoint'lerin başına /api ekler (Örn: /api/blog)
  // Prepends /api to all endpoints (e.g., /api/blog)
  app.setGlobalPrefix('api');

  // 🌍 1. CORS — Cross-Origin Resource Sharing
  // İzin verilen frontend origin'lerini tanımlar
  // Defines allowed frontend origins
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4200',
      'http://localhost:8080',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 📝 2. VALIDATION PIPE
  // Gelen isteklerdeki DTO doğrulamasını global olarak aktifleştirir
  // Enables global DTO validation for incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // DTO'da tanımlı olmayan alanları siler / Strips unknown properties
      forbidNonWhitelisted: true, // Bilinmeyen alanlar gelirse 400 döner / Returns 400 for unknown fields
      transform: true,            // Gelen veriyi DTO tipine dönüştürür / Auto-transforms payloads to DTO types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 📖 3. SWAGGER — OpenAPI Documentation
  // Interaktif API dokümantasyonu oluşturur (/api/docs)
  // Generates interactive API documentation at /api/docs
  const config = new DocumentBuilder()
    .setTitle('NestJS Boilerplate API')
    .setDescription('Production-ready backend infrastructure built with NestJS + Prisma + PostgreSQL.')
    .setVersion('1.2.0')
    .addBearerAuth() // JWT token girişi için Swagger'a kilit ikonu ekler / Adds lock icon for JWT auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ⚙️ 4. GLOBAL INTERCEPTORS & FILTERS
  // ClassSerializer: @Exclude() ile işaretli alanları JSON çıktısından gizler
  // ClassSerializer: Hides fields marked with @Exclude() from JSON responses
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // HttpExceptionFilter: Tüm hataları standart JSON formatında döner
  // HttpExceptionFilter: Returns all errors in a standardized JSON format
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running at: http://localhost:${port}/api`);
  logger.log(`📖 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('Critical error during application bootstrap:', err);
  process.exit(1);
});