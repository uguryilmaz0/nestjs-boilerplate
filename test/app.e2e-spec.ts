import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupTestApp } from './utils/setup-test-app';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // Test seti başlamadan önce çalışır / Runs before the test suite
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await setupTestApp(moduleFixture);

  })

  // Testler bitince uygulamayı kapat / Close app after all tests
  afterAll(async () => {
    await app.close();
  })

  // Prefix eklediğimiz için artık istekleri /api/ üzerinden atıyoruz 
  // Since we added a prefix, we now send requests through /api/
  it('/api (GET) - Root Health Check', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Hello World!');
  });
});