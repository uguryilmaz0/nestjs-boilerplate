# NestJS Boilerplate

![NestJS](https://img.shields.io/badge/NestJS-11.1-ea2845?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-7.3-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?logo=swagger&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

Production-ready NestJS REST API boilerplate with JWT authentication, RBAC, S3 file uploads, soft delete, full-text search, and Swagger documentation.

> **TR:** JWT kimlik doğrulama, rol tabanlı erişim, S3 dosya yükleme, soft delete, tam metin arama ve Swagger dokümantasyonu içeren üretime hazır NestJS REST API şablonu.

---

## Features / Özellikler

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Signup, signin, token-based access (`passport-jwt`) |
| **Role-Based Access (RBAC)** | 4 roles: `USER`, `AUTHOR`, `ADMIN`, `PREMIUM` |
| **Blog CRUD** | Create, read, update, soft delete posts with tag system |
| **Comments** | Authenticated comment creation with cascade delete |
| **S3 File Upload** | AWS S3 / MinIO / Supabase compatible image upload |
| **Soft Delete** | `deletedAt` field on User, Post, Comment models |
| **Full-Text Search** | PostgreSQL `tsvector` with `@@index` on title & content |
| **Swagger / OpenAPI** | Interactive API docs at `/api/docs` |
| **Docker Compose** | PostgreSQL 16 + MinIO for local development |
| **Pagination** | Offset-based pagination with metadata |
| **Validation** | `class-validator` + `class-transformer` with auto-whitelist |
| **Error Handling** | Global `HttpExceptionFilter` with structured JSON responses |
| **SEO Slugs** | Auto-generated URL-friendly slugs via `slugify` |

---

## Tech Stack

```
NestJS 11.1  ·  TypeScript 5.7  ·  Prisma 7.3  ·  PostgreSQL 16
Passport JWT  ·  AWS S3 SDK  ·  Swagger  ·  Docker Compose
```

---

## Project Structure / Proje Yapısı

```
src/
├── auth/                    # Authentication module / Kimlik doğrulama
│   ├── decorator/           # @GetUser(), @Roles() decorators
│   ├── dto/                 # AuthDto, LoginDto
│   ├── entity/              # UserEntity (serialization)
│   ├── guard/               # JwtGuard, RolesGuard
│   └── strategy/            # JWT strategy (passport)
├── blog/                    # Blog module / Blog modülü
│   └── dto/                 # CreatePostsDto, UpdatePostsDto, GetPostsQueryDto
├── comment/                 # Comment module / Yorum modülü
│   └── dto/                 # CreateCommentDto
├── common/
│   ├── filters/             # HttpExceptionFilter
│   ├── services/            # S3Service
│   └── validators/          # ImageValidator
├── prisma/                  # PrismaService (pg adapter)
├── app.module.ts            # Root module
└── main.ts                  # Bootstrap & global config
prisma/
└── schema.prisma            # Database schema & migrations
docker-compose.yml           # PostgreSQL + MinIO
```

---

## Quick Start / Hızlı Başlangıç

### Prerequisites / Gereksinimler

- Node.js 18+
- PostgreSQL 16+ (or Docker)
- npm or yarn

### 1. Clone & Install / Klonla ve Kur

```bash
git clone https://github.com/uguryilmaz0/nestjs-boilerplate.git
cd nestjs-boilerplate
npm install
```

### 2. Environment Variables / Ortam Değişkenleri

```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
# .env dosyasını kendi veritabanı bilgilerinizle düzenleyin
```

### 3. Database Setup / Veritabanı Kurulumu

**Option A: Docker (Recommended / Önerilen)**
```bash
docker-compose up -d
```

**Option B: Local PostgreSQL**
```bash
# Update DATABASE_URL in .env with your local connection string
```

Then run migrations / Ardından migration'ları çalıştırın:
```bash
npx prisma migrate dev
```

### 4. Run / Çalıştır

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

API will be available at `http://localhost:3000/api`

---

## API Documentation / API Dokümantasyonu

Interactive Swagger UI is available at:

```
http://localhost:3000/api/docs
```

### Endpoints Overview

#### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/signup` | - | Register / Kayıt ol |
| `POST` | `/auth/signin` | - | Login / Giriş yap |
| `GET` | `/auth/me` | JWT | Get profile / Profil getir |

#### Blog (`/api/blog`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/blog` | - | List posts (paginated) / Yazıları listele |
| `GET` | `/blog/search?q=term` | - | Full-text search / Tam metin arama |
| `GET` | `/blog/:id` | - | Get post with comments / Yazı detayı |
| `POST` | `/blog/create` | JWT | Create post / Yazı oluştur |
| `PATCH` | `/blog/:id` | JWT | Update post / Yazı güncelle |
| `DELETE` | `/blog/:id` | JWT + Role | Soft delete post / Yazı sil |
| `POST` | `/blog/upload` | JWT | Upload image to S3 / Resim yükle |

#### Comments (`/api/comment`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/comment` | JWT | Add comment / Yorum ekle |

---

## Database Schema / Veritabanı Şeması

```
┌──────────┐       ┌──────────┐       ┌──────────┐
│   User   │1────N│   Post   │N────M│   Tag    │
│──────────│       │──────────│       │──────────│
│ id       │       │ id       │       │ id       │
│ email    │       │ title    │       │ slug     │
│ password │       │ content  │       │ name     │
│ name     │       │ slug     │       └──────────┘
│ role     │       │ image    │
│ deletedAt│       │ published│
└──────────┘       │ deletedAt│
      │1           └──────────┘
      │                  │1
      │N                 │N
┌──────────┐       ┌──────────┐
│ Comment  │───────│          │
│──────────│       │          │
│ id       │       │          │
│ content  │       │          │
│ deletedAt│       │          │
└──────────┘       └──────────┘
```

**Roles:** `USER` · `AUTHOR` · `ADMIN` · `PREMIUM`

---

## S3 / MinIO Storage

The project supports S3-compatible object storage for file uploads:

| Provider | Configuration |
|----------|--------------|
| **AWS S3** | Set `AWS_S3_REGION`, `AWS_S3_BUCKET_NAME`, credentials |
| **MinIO** | Set `AWS_S3_ENDPOINT=http://localhost:9000` |
| **Supabase** | Set `AWS_S3_ENDPOINT` to your Supabase storage URL |

MinIO console is available at `http://localhost:9001` when using Docker Compose.

---

## Docker Compose Services

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL 16 | `5432` | Database / Veritabanı |
| MinIO | `9000` / `9001` | S3-compatible storage / S3 uyumlu depolama |

```bash
docker-compose up -d    # Start / Başlat
docker-compose down     # Stop / Durdur
```

---

## Scripts / Komutlar

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Development mode with watch / Geliştirme modu |
| `npm run build` | Compile TypeScript / Derleme |
| `npm run start:prod` | Production mode / Üretim modu |
| `npm run lint` | ESLint fix / Kod analizi |
| `npm run format` | Prettier format / Kod biçimlendirme |
| `npm run release` | Bump version (standard-version) / Sürüm yükselt |
| `npx prisma studio` | Database GUI / Veritabanı arayüzü |
| `npx prisma migrate dev` | Run migrations / Migration çalıştır |

---

## Security Notes / Güvenlik Notları

- Passwords are hashed with `bcrypt` (10 salt rounds)
- JWT tokens expire after 1 hour
- `@Exclude()` decorator hides password from all API responses
- CORS is configured for specific origins
- `ValidationPipe` with `whitelist: true` strips unknown properties
- Soft delete preserves data integrity — records are never physically deleted

---

## Contributing / Katkıda Bulunma

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License / Lisans

This project is licensed under the [MIT License](LICENSE).

---

**Made with NestJS** · [Report Bug](https://github.com/uguryilmaz0/nestjs-boilerplate/issues) · [Request Feature](https://github.com/uguryilmaz0/nestjs-boilerplate/issues)
