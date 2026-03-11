import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from './../../src/prisma/prisma.service';
import { setupTestApp } from '../utils/setup-test-app';
import { getAccessToken } from '../utils/auth-helper';
import request from 'supertest';
import { join } from 'path';
import { ensureBucketExists } from '../utils/storage-helper';

describe('Blog Module (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let accessToken: string;

    /**
     * Uygulama başlatma ve test veri tabanı hazırlığı
     * App initialization and test database preparation
     */
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        // Uygulamayı test ayarlarına göre yapılandır / Configure the app with test settings
        app = await setupTestApp(moduleFixture);
        prisma = app.get<PrismaService>(PrismaService);

        // MinIO/S3 kovasının varlığını kontrol et, yoksa oluştur / Check for the existence of the MinIO/S3 bucket, create it if it doesn't exist
        await ensureBucketExists(app);

        // Veritabanını temizle (Sıralama önemlidir) / Clear the database (Order is important)
        await prisma.comment.deleteMany();
        await prisma.post.deleteMany();
        await prisma.user.deleteMany();

        // Testler için yetki token'ı al / Obtain authorization token for tests
        const authData = await getAccessToken(app, 'blog-tester@example.com');
        accessToken = authData.accessToken;
    });

    /**
     * Testler bittiğinde uygulamayı güvenli kapat / Safely close the app after tests
     */
    afterAll(async () => {
        await app.close();
    });

    /**
     * Senaryo: Yeni yazı oluşturma işlemleri
     * Scenario: New post creation processes
     */
    describe('/api/blog/create (POST)', () => {
        const blogDto = {
            title: 'E2E Test Title',
            content: 'Content created by automated e2e test.',
            published: true,
        };

        it('yetkisiz erişimi engellemeli (401) / should block unauthorized access (401)', () => {
            return request(app.getHttpServer())
                .post('/api/blog/create')
                .send(blogDto)
                .expect(401);
        });

        it('geçerli verilerle yazı oluşturmalı (201) / should create post with valid data (201)', async () => {
            return request(app.getHttpServer())
                .post('/api/blog/create')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(blogDto)
                .expect(201)
                .expect((res) => {
                    expect(res.body.title).toEqual(blogDto.title);
                    expect(res.body.id).toBeDefined(); // ID kontrolü / ID check
                });
        });
    });

    /**
     * Senaryo: Medya (resim) yükleme işlemleri
     * Scenario: Media (image) upload processes
     * 
     */
    describe('/api/blog/upload (POST)', () => {
        it('dosyayı MinIO/S3 üzerine yüklemeli ve URL dönmeli (201) / should upload file to MinIO/S3 and return URL (201)', async () => {
            // Test resminin yolu / Path of the test image
            const imagePath = join(__dirname, '..', 'assets', 'test-image.jpg');

            return request(app.getHttpServer())
                .post('/api/blog/upload')
                .set('Authorization', `Bearer ${accessToken}`)
                .attach('image', imagePath) // Key: 'image' (Controller'daki isimle aynı olmalı)
                .expect(201)
                .expect((res) => {
                    expect(res.body.imageUrl).toBeDefined();
                    expect(res.body.imageUrl).toContain('localhost:9000'); // MinIO URL kontrolü / MinIO URL check
                })
        });
    });

    /**
     * Senaryo: Yazıları listeleme ve doğrulama
     * Scenario: Listing and validating posts
     */
    describe('/api/blog (GET)', () => {
        it('oluşturulan yazıları listelemeli (200) / should retrieve the list of created posts (200)', () => {
            return request(app.getHttpServer())
                .get('/api/blog')
                .expect(200)
                .expect((res) => {
                    // Veri yapısını kontrol et: Direkt dizi mi yoksa { data: [] } mi? / Check data structure: Is it a direct array or { data: [] }?
                    const posts = Array.isArray(res.body) ? res.body : res.body.data;

                    expect(posts).toBeDefined();
                    expect(posts.length).toBeGreaterThan(0);
                });
        });
    });
});