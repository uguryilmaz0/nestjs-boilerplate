import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap'); // NestJS Logger'ı profesyonel log basmanı sağlar
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 🏁 GLOBAL API PREFIX
  // Tüm endpointlerin başına /api ekler (Örn: http://localhost:3000/api/blog)
  app.setGlobalPrefix('api');

  // 🌍 1. CORS MÜHÜRÜ
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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 🖼️ 3. STATİK DOSYA HİZMETİ
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // 📖 4. SWAGGER (API Dökümantasyonu)
  // Swagger, API'nizin otomatik olarak dökümante edilmesini sağlar. Geliştiriciler için büyük kolaylık sağlar!
  const config = new DocumentBuilder()
    .setTitle('NestJS Boilerplate API')
    .setDescription('NestJS + Prisma + PostgreSQL tabanlı production-ready backend altyapısı.')
    .setVersion('1.0')
    .addBearerAuth() // JWT Token girişi için Swagger'a kilit ikonu ekler
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Dokümantasyon adresi: /api/docs

  // ⚙️ 5. INTERCEPTORS & FILTERS
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Uygulama şu adreste yayında: http://localhost:${port}/api`);
  logger.log(`📖 API Dökümantasyonu: http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  console.error('Uygulama başlatılırken kritik bir hata oluştu:', err);
  process.exit(1);
});