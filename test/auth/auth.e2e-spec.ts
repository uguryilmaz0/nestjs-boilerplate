import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';
import request from 'supertest';
import { setupTestApp } from '../utils/setup-test-app';

describe('Auth (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    // Test suite başlamadan önce kurulum / Setup before starting the test suite
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = await setupTestApp(moduleFixture);

        prisma = app.get<PrismaService>(PrismaService);

        // Test DB'yi tertemiz yapıyoruz (Silme sırasına dikkat!)
        // Cleaning the Test DB (Respect the deletion order!)
        await prisma.comment.deleteMany();
        await prisma.post.deleteMany();
        await prisma.user.deleteMany();
    });

    // Bağlantıları kapat / Close connections
    afterAll(async () => {
        await app.close();
    });

    // Test kullanıcı verisi / Test user data
    const testUser = {
        email: 'e2e-tester@example.com',
        password: 'Password123!',
        name: 'E2E Tester',
    }

    describe('/api/auth/signup (POST)', () => {
        it('yeni bir kullanıcıyı veritabanına kaydetmeli / should successfully register a new user', async () => {
            return request(app.getHttpServer())
                .post('/api/auth/signup')
                .send(testUser)
                .expect(201)
                .expect((res) => {
                    expect(res.body.email).toEqual(testUser.email);
                    expect(res.body.password).toBeUndefined(); // Şifre geri dönmemeli / Password should not be returned
                })
        })

        it('aynı email ile kayda izin vermemeli (409) / should fail if email already exists', async () => {
            return request(app.getHttpServer())
                .post('/api/auth/signup')
                .send(testUser)
                .expect(409) // Conflict status code for duplicate email / Duplicate email için Conflict durum kodu
                .expect((res) => {
                    expect(res.body.message).toContain('kullanılmaktadır'); // Hata mesajında "kullanılmaktadır" ifadesi geçmeli
                    expect(res.body.message).toContain('already in use'); // Error message should contain "already in use" as well
                })
        })
    })

    // ---- Giriş Senaryosu / Signin Scenario ----
    describe('/api/auth/signin (POST)', () => {
        it('doğru bilgilerle access_token döndürmeli / should return access_token with valid credentials', async () => {
            return request(app.getHttpServer())
                .post('/api/auth/signin')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.access_token).toBeDefined();
                    // Token'ın bir string olduğunu ve boş olmadığını doğrula / Verify that the token is a non-empty string
                    expect(typeof res.body.access_token).toBe('string');
                })
        })

        it('yanlış şifre ile 401 Unauthorized dönmeli / should return 401 for invalid password', async () => {
            return request(app.getHttpServer())
                .post('/api/auth/signin')
                .send({
                    email: testUser.email,
                    password: 'WrongPassword!',
                })
                .expect(401)
        });
    })
});