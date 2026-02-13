<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<h1 align="center">NestJS Boilerplate</h1>

<p align="center">
  <strong>Production-ready NestJS REST API boilerplate with JWT authentication, RBAC, S3 file uploads, soft delete, full-text search, and Swagger documentation.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11.1-E0234E?style=for-the-badge&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-7.3-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

> **TR:** JWT kimlik doğrulama, rol tabanlı erişim, S3 dosya yükleme, soft delete, tam metin arama ve Swagger dokümantasyonu içeren üretime hazır NestJS REST API şablonu.

---

## 📋 Table of Contents / İçindekiler

- [Overview / Genel Bakış](#-overview--genel-bakış)
- [Architecture / Mimari](#-architecture--mimari)
- [Features / Özellikler](#-features--özellikler)
- [Tech Stack / Teknoloji](#-tech-stack--teknoloji)
- [Getting Started / Hızlı Başlangıç](#-getting-started--hızlı-başlangıç)
- [Project Structure / Proje Yapısı](#-project-structure--proje-yapısı)
- [API Endpoints / API Uç Noktaları](#-api-endpoints--api-uç-noktaları)
- [Database Schema / Veritabanı Şeması](#-database-schema--veritabanı-şeması)
- [S3 / MinIO Storage / S3 Depolama](#-s3--minio-storage--s3-depolama)
- [Docker Compose Services / Docker Servisleri](#-docker-compose-services--docker-servisleri)
- [Environment Variables / Ortam Değişkenleri](#-environment-variables--ortam-değişkenleri)
- [Scripts / Komutlar](#-scripts--komutlar)
- [Security / Güvenlik](#-security--güvenlik)
- [Contributing / Katkıda Bulunma](#-contributing--katkıda-bulunma)
- [License / Lisans](#-license--lisans)

---

## 🎯 Overview / Genel Bakış

**NestJS Boilerplate** is a production-ready backend boilerplate designed with clean architecture principles. It can be used as a foundation for any scalable REST API.

> **TR:** Temiz mimari prensipleriyle tasarlanmış, üretime hazır bir backend şablonudur. Herhangi bir ölçeklenebilir REST API için temel olarak kullanılabilir.

Key design decisions / Temel tasarım kararları:
- **Modular architecture / Modüler mimari** — each domain (Auth, Blog, Comment) is a self-contained module / her alan kendi içinde bağımsız bir modüldür
- **Database-first approach / Veritabanı öncelikli yaklaşım** — Prisma ORM with migration history for safe schema evolution / güvenli şema evrimi için migration geçmişi
- **Security by default / Varsayılan güvenlik** — JWT authentication, RBAC, input validation, and exception filtering out of the box / JWT, RBAC, girdi doğrulama ve hata filtreleme hazır olarak gelir

---

## 🏗 Architecture / Mimari

```
Client Request
     │
     ▼
┌─────────────────────────────────────────────────────────┐
│  Global Middleware Layer                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ CORS Policy  │  │ Validation   │  │ Serialization  │  │
│  │              │  │ Pipe         │  │ Interceptor    │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
     ┌───────────────────┼───────────────────┐
     ▼                   ▼                   ▼
┌──────────┐      ┌──────────┐       ┌──────────────┐
│  Auth    │      │  Blog    │       │  Comment     │
│  Module  │      │  Module  │       │  Module      │
│──────────│      │──────────│       │──────────────│
│ Guard    │◄────►│ Controller│      │ Controller   │
│ Strategy │      │ Service  │      │ Service      │
│ Decorator│      │ DTOs     │      │ DTOs         │
└────┬─────┘      └────┬─────┘       └──────┬───────┘
     │                 │                    │
     └─────────────────┼────────────────────┘
                       ▼
              ┌─────────────────┐
              │  Prisma Service  │
              │  (Database ORM)  │
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              └─────────────────┘
```

---

## ✨ Features / Özellikler

### 🔐 Authentication & RBAC / Kimlik Doğrulama & Rol Tabanlı Erişim

| Feature / Özellik | Description / Açıklama |
|---------|-------------|
| JWT Authentication / JWT Kimlik Doğrulama | Stateless token-based auth with configurable expiration (`passport-jwt`) / Yapılandırılabilir süreli durumsuz token tabanlı kimlik doğrulama |
| Role-Based Access Control / Rol Tabanlı Erişim | 4-tier role system / 4 seviyeli rol sistemi: `ADMIN`, `AUTHOR`, `PREMIUM`, `USER` |
| Password Hashing / Şifre Hashleme | bcrypt with salt rounds for secure storage / Güvenli depolama için bcrypt |
| Custom Decorators / Özel Dekoratörler | `@GetUser()` for request user extraction, `@Roles()` for route protection / Kullanıcı çıkarma ve rota koruma |
| Serialization / Serileştirme | Automatic password exclusion from API responses via `class-transformer` / API yanıtlarından otomatik şifre gizleme |

### 📝 Blog Engine / Blog Motoru

| Feature / Özellik | Description / Açıklama |
|---------|-------------|
| CRUD Operations / CRUD İşlemleri | Full create, read, update, soft delete with ownership validation / Sahiplik doğrulamalı tam CRUD |
| Pagination / Sayfalama | Configurable `page` & `limit` with total count metadata / Toplam sayı metadatalı yapılandırılabilir sayfalama |
| Full-Text Search / Tam Metin Arama | PostgreSQL `tsvector` with `@@index` on title & content / Başlık ve içerikte tam metin arama |
| Tag Filtering / Etiket Filtreleme | Many-to-many tag system with slug-based filtering / Slug tabanlı çoka-çok etiket sistemi |
| SEO Slugs / SEO Uyumlu URL | Auto-generated URL-friendly slugs via `slugify` / Otomatik oluşturulan SEO uyumlu URL'ler |
| Image Upload / Resim Yükleme | S3-compatible file upload with type/size validation (max 2MB) / Tip/boyut doğrulamalı S3 uyumlu yükleme |

### 💬 Comment System / Yorum Sistemi

| Feature / Özellik | Description / Açıklama |
|---------|-------------|
| Authenticated Comments / Kimlik Doğrulamalı Yorumlar | JWT-protected comment creation / JWT korumalı yorum oluşturma |
| Cascade Delete / Kademeli Silme | Comments auto-deleted when parent post is removed / Yazı silindiğinde yorumlar otomatik silinir |
| Author Association / Yazar İlişkilendirme | Each comment linked to authenticated user / Her yorum kimliği doğrulanmış kullanıcıya bağlı |

### 🛡 Security & Quality / Güvenlik & Kalite

| Feature / Özellik | Description / Açıklama |
|---------|-------------|
| Global Validation / Global Doğrulama | `ValidationPipe` with whitelist & forbidNonWhitelisted / Beyaz liste modunda doğrulama |
| Exception Filter / Hata Filtresi | Standardized error response format with logging / Yapılandırılmış hata yanıt formatı |
| CORS Configuration / CORS Yapılandırması | Pre-configured for common frontend ports / Yaygın frontend portları için önceden yapılandırılmış |
| Soft Delete / Yumuşak Silme | `deletedAt` field on User, Post, Comment — records are never physically deleted / Kayıtlar asla fiziksel olarak silinmez |
| Swagger Documentation / Swagger Dokümantasyonu | Interactive API docs at `/api/docs` / `/api/docs` adresinde interaktif API belgeleri |

---

## 🧰 Tech Stack / Teknoloji

| Layer / Katman | Technology / Teknoloji |
|-------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | NestJS 11.1 |
| **Language** | TypeScript 5.7 |
| **ORM** | Prisma 7.3 with PostgreSQL adapter (`@prisma/adapter-pg`) |
| **Database** | PostgreSQL 16 |
| **Auth** | Passport.js + JWT (`@nestjs/passport`, `@nestjs/jwt`) |
| **Validation** | class-validator + class-transformer |
| **Documentation** | Swagger / OpenAPI (`@nestjs/swagger`) |
| **File Upload** | Multer + AWS S3 SDK (S3 / MinIO / Supabase compatible) |
| **SEO** | slugify |
| **Infrastructure** | Docker Compose (PostgreSQL + MinIO) |

---

## 🚀 Getting Started / Hızlı Başlangıç

### Prerequisites / Gereksinimler

- **Node.js** >= 18.x
- **PostgreSQL** 16+ (or Docker / veya Docker)
- **npm** or yarn

### Installation / Kurulum

```bash
# 1. Clone the repository / Repoyu klonla
git clone https://github.com/uguryilmaz0/nestjs-boilerplate.git
cd nestjs-boilerplate

# 2. Install dependencies / Bağımlılıkları kur
npm install

# 3. Configure environment variables / Ortam değişkenlerini yapılandır
cp .env.example .env
# Edit .env with your database credentials and JWT secret
# .env dosyasını kendi veritabanı bilgilerinizle düzenleyin

# 4. Start services (Option A: Docker — Recommended / Önerilen)
docker-compose up -d

# 4. Or use local PostgreSQL (Option B) / Veya yerel PostgreSQL kullanın
# Update DATABASE_URL in .env with your local connection string

# 5. Run database migrations / Migration'ları çalıştır
npx prisma migrate dev

# 6. Start the development server / Geliştirme sunucusunu başlat
npm run start:dev
```

### Verify Installation / Kurulumu Doğrula

- **API Base URL:** [http://localhost:3000/api](http://localhost:3000/api)
- **Swagger Docs:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 📁 Project Structure / Proje Yapısı

```
src/
├── main.ts                          # Application bootstrap & global setup
├── app.module.ts                    # Root module
├── app.service.ts                   # Root service
│
├── auth/                            # 🔐 Authentication Module
│   ├── auth.module.ts               # Module definition with JWT config
│   ├── auth.controller.ts           # Signup, Signin, GetMe endpoints
│   ├── auth.service.ts              # Auth business logic & token generation
│   ├── decorator/
│   │   ├── get-user.decorator.ts    # @GetUser() param decorator
│   │   └── roles-decorator.ts       # @Roles() metadata decorator
│   ├── dto/
│   │   ├── auth.dto.ts              # Signup validation schema
│   │   └── login.dto.ts             # Signin validation schema
│   ├── entity/
│   │   └── user.entity.ts           # User serialization (password exclusion)
│   ├── guard/
│   │   ├── jwt.guard.ts             # JWT authentication guard
│   │   └── roles.guard.ts           # RBAC authorization guard
│   └── strategy/
│       └── jwt.strategy.ts          # Passport JWT strategy
│
├── blog/                            # 📝 Blog Module
│   ├── blog.module.ts               # Module definition
│   ├── blog.controller.ts           # CRUD + Search + Upload endpoints
│   ├── blog.service.ts              # Blog business logic
│   └── dto/
│       ├── create-posts.dto.ts      # Post creation schema
│       ├── update-post.dto.ts       # Partial update schema (PartialType)
│       └── get-posts-query.dto.ts   # Pagination & filter query schema
│
├── comment/                         # 💬 Comment Module
│   ├── comment.module.ts            # Module definition
│   ├── comment.controller.ts        # Comment creation endpoint
│   ├── comment.service.ts           # Comment business logic
│   └── dto/
│       └── create-comment.dto.ts    # Comment validation schema
│
├── common/                          # 🧩 Shared Utilities
│   ├── filters/
│   │   └── http-exception.filter.ts # Global exception filter
│   ├── services/
│   │   └── s3.service.ts            # S3-compatible upload service
│   └── validators/
│       └── image-type.validator.ts  # Custom file type validator
│
└── prisma/                          # 🗄 Database Layer
    ├── prisma.module.ts             # Global Prisma module
    └── prisma.service.ts            # Prisma client with pg adapter

prisma/
├── schema.prisma                    # Database schema definition
└── migrations/                      # Migration history

docker-compose.yml                   # PostgreSQL + MinIO
```

---

## 📡 API Endpoints / API Uç Noktaları

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/signup` | ❌ | Register / Kayıt ol |
| `POST` | `/auth/signin` | ❌ | Login / Giriş yap |
| `GET` | `/auth/me` | 🔒 JWT | Get profile / Profil getir |

### Blog (`/api/blog`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/blog` | ❌ | List posts (paginated) / Yazıları listele |
| `GET` | `/blog/search?q=term` | ❌ | Full-text search / Tam metin arama |
| `GET` | `/blog/:id` | ❌ | Get post with comments / Yazı detayı |
| `POST` | `/blog/create` | 🔒 JWT | Create post / Yazı oluştur |
| `PATCH` | `/blog/:id` | 🔒 JWT | Update post / Yazı güncelle |
| `DELETE` | `/blog/:id` | 🔒 JWT + Role | Soft delete post / Yazı sil |
| `POST` | `/blog/upload` | 🔒 JWT | Upload image to S3 / Resim yükle |

### Comment (`/api/comment`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/comment` | 🔒 JWT | Add comment / Yorum ekle |

### Query Parameters / Sorgu Parametreleri (Blog Listing / Blog Listesi)

| Parameter / Parametre | Type / Tip | Default / Varsayılan | Description / Açıklama |
|-----------|------|---------|-------------|
| `page` | `number` | `1` | Page number / Sayfa numarası |
| `limit` | `number` | `10` | Items per page / Sayfa başına öğe |
| `search` | `string` | — | Search in title & content / Başlık ve içerikte ara |
| `tag` | `string` | — | Filter by tag slug / Etiket slug'ına göre filtrele |

**Example:** `GET /api/blog?page=2&limit=5&tag=nestjs&search=prisma`

---

## 🗄 Database Schema / Veritabanı Şeması

```prisma
enum Role { USER, AUTHOR, ADMIN, PREMIUM }

model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  name      String?
  role      Role      @default(USER)
  posts     Post[]
  comments  Comment[]
  deletedAt DateTime?
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String?
  published Boolean   @default(false)
  slug      String    @unique
  image     String?
  createdAt DateTime  @default(now())
  tags      Tag[]
  author    User?     @relation(fields: [authorId], references: [id])
  authorId  Int?
  comments  Comment[]
  deletedAt DateTime?
  @@index([title, content])
}

model Tag {
  id    Int    @id @default(autoincrement())
  slug  String @unique
  name  String @unique
  posts Post[]
}

model Comment {
  id        Int       @id @default(autoincrement())
  content   String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
  author    User      @relation(fields: [authorId], references: [id])
  authorId  Int
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    Int
}
```

### Entity Relationships / Varlık İlişkileri

```
User  1──N  Post       (Author can have many posts / Yazarın birçok yazısı olabilir)
User  1──N  Comment    (User can have many comments / Kullanıcının birçok yorumu olabilir)
Post  1──N  Comment    (Post can have many comments, cascade delete / Yazının birçok yorumu olabilir, kademeli silme)
Post  N──M  Tag        (Many-to-many via implicit join table / Çoka-çok ilişki)
```

**Roles:** `USER` · `AUTHOR` · `ADMIN` · `PREMIUM`

---

## ☁ S3 / MinIO Storage / S3 Depolama

The project supports S3-compatible object storage for file uploads:

> **TR:** Proje, dosya yüklemeleri için S3 uyumlu nesne depolamayı destekler.

| Provider / Sağlayıcı | Configuration / Yapılandırma |
|----------|--------------|
| **AWS S3** | Set `AWS_S3_REGION`, `AWS_S3_BUCKET_NAME`, credentials / Kimlik bilgilerini ayarlayın |
| **MinIO** | Set `AWS_S3_ENDPOINT=http://localhost:9000` |
| **Supabase** | Set `AWS_S3_ENDPOINT` to your Supabase storage URL / Supabase depolama URL'nizi ayarlayın |

MinIO console is available at `http://localhost:9001` when using Docker Compose.

> **TR:** Docker Compose kullanırken MinIO konsolu `http://localhost:9001` adresinde erişilebilir.

---

## 🐳 Docker Compose Services / Docker Servisleri

| Service / Servis | Port | Description / Açıklama |
|---------|------|-------------|
| PostgreSQL 16 | `5432` | Database / Veritabanı |
| MinIO | `9000` / `9001` | S3-compatible storage / S3 uyumlu depolama |

```bash
docker-compose up -d    # Start / Başlat
docker-compose down     # Stop / Durdur
```

---

## ⚙ Environment Variables / Ortam Değişkenleri

Create a `.env` file in the project root: / Proje kök dizininde bir `.env` dosyası oluşturun:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server
PORT=3000

# S3 / MinIO (optional)
AWS_S3_REGION="us-east-1"
AWS_S3_BUCKET_NAME="uploads"
AWS_S3_ENDPOINT="http://localhost:9000"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
```

> ⚠️ **Never commit `.env` to version control.** Use `.env.example` as a template.
>
> **TR:** `.env` dosyasını asla versiyon kontrolüne eklemeyin. Şablon olarak `.env.example` kullanın.

---

## 📜 Scripts / Komutlar

| Script | Command / Komut | Description / Açıklama |
|--------|---------|-------------|
| **Dev** | `npm run start:dev` | Start with hot-reload / Canlı yeniden yükleme ile başlat |
| **Build** | `npm run build` | Compile TypeScript to `dist/` / TypeScript derle |
| **Production** | `npm run start:prod` | Run compiled application / Derlenmiş uygulamayı çalıştır |
| **Lint** | `npm run lint` | Run ESLint with auto-fix / ESLint kod analizi |
| **Format** | `npm run format` | Run Prettier on source files / Prettier biçimlendirme |
| **Release** | `npm run release` | Bump version (standard-version) / Sürüm yükselt |
| **Migrate** | `npx prisma migrate dev` | Apply pending migrations / Migration'ları uygula |
| **Studio** | `npx prisma studio` | Open Prisma database browser / Veritabanı arayüzünü aç |
| **Generate** | `npx prisma generate` | Regenerate Prisma Client / Prisma Client'ı yeniden oluştur |

---

## 🛡 Security / Güvenlik

### Checklist / Kontrol Listesi

- [x] Passwords hashed with bcrypt (10 salt rounds) / Şifreler bcrypt ile hashlenir
- [x] JWT tokens with 1-hour expiration / JWT token'ları 1 saat süreli
- [x] Input validation on all endpoints (whitelist mode) / Tüm uç noktalarda girdi doğrulama
- [x] File upload restricted to images only (jpg, png, gif) with 2MB limit / Dosya yükleme yalnızca resimlerle sınırlı (maks 2MB)
- [x] CORS configured for specific origins / CORS belirli kaynaklar için yapılandırılmış
- [x] Sensitive fields excluded from responses (`@Exclude()`) / Hassas alanlar yanıtlardan gizlenir
- [x] Role-based route protection / Rol tabanlı rota koruması
- [x] Global exception filter with structured error logging / Yapılandırılmış hata günlüğü ile global hata filtresi
- [x] Soft delete preserves data integrity / Yumuşak silme veri bütünlüğünü korur — kayıtlar asla fiziksel olarak silinmez
- [ ] Rate limiting (recommended for production / üretim için önerilir)
- [ ] Helmet.js headers (recommended for production / üretim için önerilir)
- [ ] HTTPS enforcement (required for production / üretim için gerekli)

### API Response Formats / API Yanıt Formatları

**Success Response / Başarılı Yanıt (Post Listing / Yazı Listesi)**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Getting Started with NestJS",
      "slug": "getting-started-with-nestjs-a1b2c",
      "published": true,
      "createdAt": "2026-02-11T18:00:00.000Z",
      "tags": [{ "id": 1, "name": "NestJS", "slug": "nestjs" }],
      "author": { "id": 1, "name": "John Doe" }
    }
  ],
  "meta": {
    "totalItems": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Error Response / Hata Yanıtı**
```json
{
  "statusCode": 403,
  "timestamp": "2026-02-11T18:30:00.000Z",
  "path": "/api/blog/5",
  "message": "Bu yazıyı güncelleme yetkiniz yok veya yazı bulunamadı.",
  "project": "NestJS Boilerplate"
}
```

---

## 🤝 Contributing / Katkıda Bulunma

1. Fork the repository / Repoyu fork'layın
2. Create your feature branch / Özellik dalınızı oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit your changes / Değişikliklerinizi commit'leyin (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch / Dalınıza push'layın (`git push origin feature/amazing-feature`)
5. Open a Pull Request / Pull Request açın

---

## 📄 License / Lisans

This project is licensed under the [MIT License](LICENSE). / Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

<p align="center">
  Built with ❤️ using <a href="https://nestjs.com">NestJS</a> · <a href="https://github.com/uguryilmaz0/nestjs-boilerplate/issues">Report Bug</a> · <a href="https://github.com/uguryilmaz0/nestjs-boilerplate/issues">Request Feature</a>
</p>
