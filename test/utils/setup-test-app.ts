import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TestingModule } from '@nestjs/testing';

/**
 * Uygulamayı test moduna hazırlar (Pipe'lar, Interceptor'lar vb.)
 * Prepares the app for test mode (Pipes, Interceptors, etc.)
 */

export async function setupTestApp(moduleFixture: TestingModule): Promise<INestApplication> {
    const app = moduleFixture.createNestApplication();

    // 1. ValidationPipe Ayarları (main.ts ile aynı olmalı)
    // 1. ValidationPipe Settings (should be the same as main.ts)
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // DTO'da tanımlanmayan alanları otomatik olarak siler / Automatically removes fields that are not defined in the DTO
        forbidNonWhitelisted: true, // DTO'da tanımlanmayan alanlar varsa hata fırlatır / Throws an error if there are fields that are not defined in the DTO
        transform: true, // Gelen verileri DTO tiplerine dönüştürür / Transforms incoming data to DTO types
    }));

    // 2. @Exclude() gibi dekoratörlerin çalışması için Interceptor ekleyelim (main.ts ile aynı olmalı)
    // 2. Interceptor for @Exclude() and similar decorators (should be the same as main.ts)
    // User entity dosyasında parola gizlemek için @Exclude() kullanmıştık. / We used @Exclude() in the User entity file to hide the password.
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // Global prefix kullanıyorsan buraya da eklemelisin
    // If you're using a global prefix, you should add it here as well
    app.setGlobalPrefix('api');

    // Uygulamayı başlat / Start the application
    await app.init();
    return app;
}