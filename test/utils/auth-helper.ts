import request from 'supertest';
import { INestApplication } from '@nestjs/common';

/**
 * Testler için hızlıca bir access_token oluşturur
 * Generates an access_token quickly for tests
 */
export async function getAccessToken(app: INestApplication, email: string = 'test@example.com') {
    const testUser = {
        email,
        password: 'Password123!',
        name: 'Test User',
    }

    // 1. Önce kayıt ol (Eğer kullanıcı zaten varsa 409 döner ama biz devam ederiz)
    // First register (If user exists, it returns 409 but we proceed)
    await request(app.getHttpServer()).post('/api/auth/signup').send(testUser);

    // 2. Giriş yap ve token al
    const loginResponse = await request(app.getHttpServer()).post('/api/auth/signin').send({
        email: testUser.email,
        password: testUser.password,
    });

    // 3. Token'ı ve kullanıcıyı döndür
    return {
        accessToken: loginResponse.body.access_token,
        user: loginResponse.body.user,
    };
}