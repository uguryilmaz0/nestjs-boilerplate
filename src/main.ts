import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { getLoggerConfig } from './common/configs/logger.config';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

/**
 * Uygulama Başlatma Fonksiyonu
 * Application Bootstrap Function
 */
async function bootstrap() {
  /**
   * 1. Logger'ı en erken aşamada başlatmak için ham NODE_ENV değerini alıyoruz.
   * To initialize Logger at the earliest stage, we get the raw NODE_ENV value.
   */
  const rawNodeEnv = process.env.NODE_ENV || 'development';

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Winston Logger entegrasyonu / Winston Logger integration
    logger: WinstonModule.createLogger(getLoggerConfig(rawNodeEnv)),
  });

  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // 🏁 GLOBAL API PREFIX
  // Tüm endpoint'lerin başına /api ekler / Prepends /api to all endpoints
  app.setGlobalPrefix('api');

  // 🛡️ SECURITY MIDDLEWARE — Helmet
  // HTTP başlıklarını güvenli hale getirir / Secures HTTP headers
  app.use(helmet());

  // 🌍 CORS — Cross-Origin Resource Sharing
  app.enableCors({
    origin: true, // Üretimde spesifik bir liste ile değiştirilmelidir / Should be replaced with a specific list in production
    credentials: true,
  });

  // Uygulama kapanırken açık bağlantıları temizler / Enables cleanup on app shutdown
  app.enableShutdownHooks();

  // 📝 VALIDATION PIPE
  // Gelen verileri DTO kurallarına göre denetler / Validates incoming data against DTO rules
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ⚙️ GLOBAL INTERCEPTORS & FILTERS
  // JSON çıktılarından @Exclude() alanlarını temizler / Removes @Exclude() fields from JSON outputs
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new LoggingInterceptor());
  // Hataları standart bir formatta döner / Returns errors in a standardized format
  app.useGlobalFilters(new HttpExceptionFilter());

  // 📖 SWAGGER — API Documentation
  // Sadece üretim dışı ortamlarda aktifleştirilir / Enabled only in non-production environments
  if (configService.get('NODE_ENV') !== 'production') {
    setupSwagger(app);
  }

  // 🚀 SUNUCU BAŞLATMA — SERVER STARTUP
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running in ${configService.get('NODE_ENV')} mode`);
  logger.log(`🔗 URL: http://localhost:${port}/api`);
  logger.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
}

/**
 * Swagger Dokümantasyon Yapılandırması
 * Swagger Documentation Configuration
 */
function setupSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Boilerplate')
    .setDescription('Production-ready API documentation')
    .setVersion('1.4.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}

// Uygulamayı başlat ve kritik hataları yakala / Start app and catch critical errors
bootstrap().catch((err) => {
  console.error('❌ Critical error during bootstrap:', err);
  process.exit(1);
});