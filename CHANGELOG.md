# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.5.1](https://github.com/uguryilmaz0/nestjs-boilerplate/compare/v1.5.0...v1.5.1) (2026-03-28)

## [1.5.1](https://github.com/uguryilmaz0/nestjs-boilerplate/compare/v1.5.0...v1.5.1) (2026-03-28)

## [1.5.1](https://github.com/uguryilmaz0/nestjs-boilerplate/compare/v1.5.0...v1.5.1) (2026-03-28)

### Changed / Değişenler
- **`@nestjs/common`** `11.1.12` → `11.1.17` — latest NestJS core patches
  NestJS core güncellendi
- **`@nestjs/core`** `11.1.12` → `11.1.17` — kept in sync with common
  Common ile senkron tutuldu
- **`@nestjs/config`** `4.0.2` → `4.0.3` — bugfix release
  Hata düzeltme güncellemesi
- **`@nestjs/platform-express`** `11.1.12` → `11.1.17` — kept in sync with core
  Core ile senkron tutuldu
- **`@nestjs/testing`** `^11.1.14` → `^11.1.17` — kept in sync with core
  Core ile senkron tutuldu
- **`@prisma/adapter-pg`** `^7.3.0` → `^7.6.0` — Prisma ORM upgrade
  Prisma ORM güncellemesi
- **`@prisma/client`** `^7.3.0` → `^7.6.0` — kept in sync with adapter-pg
  Adapter-pg ile senkron tutuldu
- **`prisma` (CLI)** `^7.3.0` → `^7.6.0` — kept in sync with client
  Client ile senkron tutuldu
- **`@aws-sdk/client-s3`** `^3.995.0` → `^3.1019.0` — latest S3 SDK patches
  En son S3 SDK yamaları
- **`@aws-sdk/lib-storage`** `^3.995.0` → `^3.1019.0` — kept in sync with client-s3
  Client-s3 ile senkron tutuldu
- **`typescript`** `5.7.3` → `5.9.3` — **TypeScript 5.9** with improved inference and performance
  TypeScript 5.9 — geliştirilmiş tip çıkarımı ve performans
- **`jest`** `^30.2.0` → `^30.3.0` — latest Jest patches
  En son Jest yamaları
- **`class-validator`** `0.14.3` → `0.15.1` — validation improvements
  Doğrulama iyileştirmeleri
- **`pg`** `8.18.0` → `8.20.0` — PostgreSQL driver security and performance patches
  PostgreSQL driver güvenlik ve performans yamaları
- **`rxjs`** `7.8.1` → `7.8.2` — bugfix release
  Hata düzeltme güncellemesi
- **`slugify`** `^1.6.6` → `^1.6.8` — bugfix release
  Hata düzeltme güncellemesi
- **`commit-and-tag-version`** `^12.6.1` → `^12.7.1` — bugfix release
  Hata düzeltme güncellemesi
- **`@types/multer`** `^2.0.0` → `^2.1.0` — type definition update
  Tip tanımı güncellemesi
- **`@types/pg`** `^8.16.0` → `^8.20.0` — kept in sync with pg driver
  pg driver ile senkron tutuldu
- **`@types/supertest`** `^6.0.3` → `^7.2.0` — major type definition update
  Major tip tanımı güncellemesi
- **Test scripts** updated to use `node --experimental-vm-modules` for ESM support
  Test script'leri ESM desteği için güncellendi

### Added / Eklenenler
- **`@types/babel__core`** `^7.20.5` — babel type definitions for TypeScript 5.9 compatibility
  TypeScript 5.9 uyumluluğu için babel tip tanımları eklendi
- **`tsconfig.json` → `types`** field — explicit type resolution for `node`, `jest`, `babel__core`
  Tip çözümleme optimizasyonu için `types` alanı eklendi

### Security / Güvenlik
- **8 new security overrides** added to resolve transitive dependency vulnerabilities
  8 yeni güvenlik override'ı eklendi — geçişken bağımlılık zafiyetleri giderildi
- **`fast-xml-parser`** override → `5.5.7` — CVE fix
  CVE düzeltmesi
- **`path-to-regexp`** override → `^8.3.1` — ReDoS vulnerability fix
  ReDoS zafiyeti düzeltmesi
- **`picomatch`** override → `^4.0.4` — security patch
  Güvenlik yaması
- **`handlebars`** override → `^4.7.9` — prototype pollution fix
  Prototype pollution düzeltmesi
- **`brace-expansion`** override → `^5.0.5` — ReDoS fix
  ReDoS düzeltmesi
- **`yaml`** override → `^2.8.3` — security patch
  Güvenlik yaması
- **`effect`** override → `^3.20.0` — security patch
  Güvenlik yaması
- **`@hono/node-server`** override → `1.19.10` — security patch
  Güvenlik yaması
- **`hono`** override `^4.11.7` → `^4.12.8` — security update
  Güvenlik güncellemesi
- **`class-validator`** override → `0.15.1` — version consistency across dependency tree
  Bağımlılık ağacında sürüm tutarlılığı

---

## [1.5.0](https://github.com/uguryilmaz0/nestjs-boilerplate/compare/v1.4.3...v1.5.0) (2026-03-12)

### Added / Eklenenler
- **34 Unit Tests** (7 suites) — AuthService, AuthController, BlogService, BlogController, CommentService, CommentController, PrismaService
  34 unit test eklendi — Auth, Blog, Comment, Prisma modülleri kapsandı
- **9 E2E Tests** (3 suites) — App health check, Auth flow, Blog CRUD with real DB + MinIO
  9 E2E test eklendi — gerçek veritabanı ve MinIO ile tam entegrasyon
- **Jest 30 + ts-jest + supertest** — modern test framework stack
  Modern test framework altyapısı kuruldu
- **`jest.config.ts`** — unit test configuration with path aliases and coverage settings
  Path alias desteği ve kapsam ayarlarıyla unit test konfigürasyonu
- **`test/jest-e2e.json`** — separate E2E test configuration
  Ayrı E2E test konfigürasyonu
- **Docker `postgres-test`** — isolated test database on port 5433 (no data persistence)
  Port 5433'te izole test veritabanı (veri kalıcılığı yok)
- **`dotenv-cli`** + `.env.test` — isolated test environment management
  İzole test ortamı yönetimi
- **Test utilities** — `setupTestApp`, `getAccessToken`, `ensureBucketExists` helpers
  Tekrar kullanılabilir test yardımcıları eklendi
- **`CommentService.removeComment()`** — dual authorization model: comment author OR post owner can delete
  Çift yetkilendirme modeli: yorum sahibi VEYA yazı sahibi silebilir
- **`BlogService.getPostAndValidateAccess()`** — DRY helper for update + delete authorization (owner or ADMIN)
  DRY yetki kontrolü helper'ı: güncelleme + silme için sahip veya ADMIN kontrolü

### Changed / Değişenler
- **TypeScript `strict: true`** — full strict type-checking enabled (`noImplicitAny`, `strictNullChecks`, `noImplicitReturns`, `noFallthroughCasesInSwitch`)
  Tam katı tip kontrolü etkinleştirildi (Sprint 4'ten öne çekildi)
- **`strictPropertyInitialization: false`** — kept disabled for NestJS DTO/Entity decorator compatibility
  NestJS DTO/Entity dekoratör uyumluluğu için devre dışı tutuldu
- **`JwtStrategy`** — explicit `JWT_SECRET` null check before `super()` call
  `super()` çağrısından önce açık JWT_SECRET null kontrolü eklendi
- **Test scripts** added to `package.json`: `test`, `test:watch`, `test:cov`, `test:e2e`
  Test script'leri eklendi
- **Swagger version** updated to `1.5.0`
  Swagger versiyonu `1.5.0` olarak güncellendi

---

## [1.4.3](https://github.com/uguryilmaz0/nestjs-boilerplate/compare/v1.4.2...v1.4.3) (2026-02-20)


### Bug Fixes

* **security:** resolve all vulnerabilities and migrate to commit-and-tag-version ([8977285](https://github.com/uguryilmaz0/nestjs-boilerplate/commit/8977285ad82ee55483afec8d6282d5674b4bf738))

## [1.4.3] — 2026-02-21

### Security / Güvenlik
- **npm audit 0 vulnerabilities** — all known dependency vulnerabilities resolved via overrides and upgrades
  Tüm bilinen bağımlılık güvenlik açıkları override'lar ve güncellemeler ile giderildi — `npm audit` artık 0 zafiyet gösteriyor
- **`ajv` override** → `^8.17.2` — fixes prototype pollution vulnerability (CVE)
  Prototype pollution güvenlik açığı düzeltildi
- **`minimatch` override** → `^10.2.1` — fixes ReDoS (Regular Expression Denial of Service) vulnerability
  ReDoS güvenlik açığı düzeltildi
- **`lodash`**, **`hono`**, **`tar`** overrides retained for continued protection
  Süregelen koruma için mevcut override'lar korundu

### Changed / Değişenler
- **`standard-version`** → **`commit-and-tag-version`** `^12.6.1` — `standard-version` is deprecated; migrated to its actively maintained fork
  `standard-version` kullanımdan kaldırıldı; aktif olarak sürdürülen fork'una geçildi
- **`@aws-sdk/client-s3`** `^3.989.0` → `^3.995.0` — latest security patches and improvements
  En son güvenlik yamaları ve iyileştirmeler
- **`@aws-sdk/lib-storage`** `^3.989.0` → `^3.995.0` — kept in sync with client-s3
  client-s3 ile senkron tutuldu
- **`@nestjs/schematics`** `11.0.0` → `^11.0.9` — bugfixes and compatibility improvements
  Hata düzeltmeleri ve uyumluluk iyileştirmeleri
- **Release script** updated in `package.json`: `"release": "commit-and-tag-version"`
  Release komutu güncellendi

### Added / Eklenenler
- **`@nestjs/testing`** `^11.1.14` — official NestJS testing utilities (Sprint 2 preparation)
  Resmi NestJS test araçları eklendi (Sprint 2 hazırlığı)

---

## [1.4.0] — 2026-02-20

### Added / Eklenenler
- **Winston structured logging** — replaced default NestJS logger with Winston (`nest-winston`) at bootstrap level for production-grade logging
  Varsayılan NestJS logger'ı Winston (`nest-winston`) ile değiştirildi — üretim düzeyinde yapılandırılmış loglama
- **Daily-rotating log files** — `logs/error-%DATE%.log` (14-day retention) and `logs/combined-%DATE%.log` (30-day retention) with gzip compression via `winston-daily-rotate-file`
  Günlük dönen log dosyaları — hata logları (14 gün) ve birleşik loglar (30 gün), gzip sıkıştırma ile
- **Global `LoggingInterceptor`** — logs `[METHOD] URL - STATUS - DURATIONms - IP: CLIENT_IP` for every HTTP request
  Global HTTP istek loglama interceptor'ı — her istek için metod, URL, durum kodu, süre ve IP loglar
- **Environment validation** (`env.validation.ts`) — startup-time validation of `NODE_ENV`, `PORT`, `DATABASE_URL` using `class-validator` / `class-transformer`
  Ortam değişkeni doğrulama — başlangıçta `NODE_ENV`, `PORT`, `DATABASE_URL` doğrulanır
- **`Environment` enum** (`environment.enum.ts`) — type-safe environment checks (`DEVELOPMENT`, `PRODUCTION`, `TEST`, `STAGING`)
  Tip güvenli ortam kontrolleri için `Environment` enum'u
- **`GET /blog/error-test`** endpoint — tests global exception filter with raw (non-HTTP) errors
  Global exception filter'ı ham hatalarla test eden endpoint
- **`NODE_ENV`** added to `.env.example` with bilingual comment
  `.env.example` dosyasına `NODE_ENV` eklendi

### Changed / Değişenler
- **`HttpExceptionFilter`** now catches **all** exceptions (`@Catch()`) — not just `HttpException`; falls back to `500 Internal Server Error` for raw `Error` objects
  `HttpExceptionFilter` artık tüm hataları yakalar — sadece `HttpException` değil, ham `Error` nesneleri de
- **Severity-based logging** in exception filter — `logger.error()` with stack trace for 5xx; `logger.warn()` for 4xx
  Hata filtresinde ciddiyete dayalı loglama — 5xx için stack trace ile `error()`, 4xx için `warn()`
- **Stack traces in dev** — error response includes `stack` field when `NODE_ENV !== 'production'` and status >= 500
  Geliştirme ortamında hata yanıtlarına `stack` alanı eklenir (üretimde gizlenir)
- **Error response format** — added `success: false` field; removed `project` field and `IExceptionResponse` interface
  Hata yanıt formatı güncellendi — `success: false` eklendi, `project` alanı ve `IExceptionResponse` arayüzü kaldırıldı
- **`main.ts` refactored** — `ConfigService` for `PORT` and conditional Swagger (no more `process.env.PORT`); Swagger extracted to `setupSwagger()` function
  `main.ts` refactor edildi — `PORT` ve koşullu Swagger için `ConfigService`; Swagger ayrı fonksiyona çıkarıldı
- **Swagger conditionally disabled** in production via `ConfigService`
  Swagger üretim ortamında `ConfigService` ile koşullu devre dışı bırakıldı
- **CORS simplified** — hardcoded origin list replaced with `origin: true`
  CORS basitleştirildi — sabit kaynak listesi yerine `origin: true`
- **Swagger version** updated to `1.4.0`
  Swagger versiyonu `1.4.0` olarak güncellendi

### Dependencies / Bağımlılıklar
- Added `nest-winston` `^1.10.2` — NestJS-Winston integration bridge
  NestJS-Winston entegrasyon köprüsü
- Added `winston` `^3.19.0` — structured logging framework
  Yapılandırılmış loglama çerçevesi
- Added `winston-daily-rotate-file` `^5.0.0` — daily log rotation with compression
  Sıkıştırma ile günlük log rotasyonu

---

## [1.3.0] — 2026-02-16

### Added / Eklenenler
- **Rate limiting** with `@nestjs/throttler` — 100 requests per IP per minute, applied globally via `ThrottlerGuard`
  `@nestjs/throttler` ile hız sınırlama — IP başına dakikada 100 istek, `ThrottlerGuard` ile global uygulandı
- **Helmet.js** security middleware — sets HTTP security headers (XSS, HSTS, etc.)
  Helmet.js güvenlik middleware'i — HTTP güvenlik başlıklarını ayarlar (XSS, HSTS vb.)
- **Graceful shutdown hooks** — `app.enableShutdownHooks()` for clean resource release on exit
  Zarif kapanma kancaları — çıkışta temiz kaynak serbest bırakma
- **PrismaService `onModuleDestroy`** — automatic database disconnection on shutdown
  Kapanışta otomatik veritabanı bağlantı kesme
- **Admin ownership override** — `ADMIN` role can now update/delete any post regardless of ownership
  Admin sahiplik geçersiz kılma — `ADMIN` rolü sahiplik fark etmeksizin tüm yazıları güncelleyip silebilir

### Changed / Değişenler
- **S3Service** fully refactored to use `ConfigService` instead of `process.env` — cloud-agnostic (AWS / MinIO / Supabase)
  S3Service tamamen `ConfigService` kullanacak şekilde refactor edildi — bulut bağımsız
- **JwtStrategy** refactored to use `ConfigService` — removed fallback `|| '-'` on `JWT_SECRET`
  JwtStrategy `ConfigService` kullanacak şekilde refactor edildi — `JWT_SECRET` için fallback kaldırıldı
- **RolesGuard** now checks for null user before role comparison (returns `403` if no user)
  RolesGuard artık rol karşılaştırmasından önce null kullanıcı kontrolü yapar
- **BlogController** — `RolesGuard` activated on all protected endpoints (create, update, delete, upload)
  BlogController — tüm korumalı endpoint'lerde `RolesGuard` aktifleştirildi
- **Slug generation** switched from `Math.random()` to `crypto.randomUUID()` for better collision resistance
  Slug üretimi daha iyi çakışma direnci için `crypto.randomUUID()` kullanacak şekilde değiştirildi
- **JwtStrategy** now throws `UnauthorizedException` for deleted or missing users
  JwtStrategy artık silinmiş veya bulunamayan kullanıcılar için `UnauthorizedException` fırlatır
- **Swagger version** updated to `1.3.0`
  Swagger versiyonu `1.3.0` olarak güncellendi

### Security / Güvenlik
- Helmet.js HTTP başlıkları aktif / Helmet.js HTTP headers active
- Rate limiting global olarak uygulandı / Rate limiting applied globally
- JWT strategy artık `process.env` yerine `ConfigService` kullanıyor / JWT strategy now uses `ConfigService` instead of `process.env`
- Silinmiş kullanıcı token'ları reddediliyor / Deleted user tokens are rejected

---

## [1.2.0] — 2026-02-14

### Added / Eklenenler
- **Bilingual comments (TR + EN)** across all source files for open-source accessibility
  Tüm kaynak dosyalara Türkçe + İngilizce çift dilli yorumlar eklendi
- **Bilingual Swagger descriptions** on all API endpoints and DTOs
  Tüm API endpoint ve DTO'larına çift dilli Swagger açıklamaları eklendi
- **Bilingual error messages** (`"TR mesaj / EN message"` format)
  Hata mesajları çift dilli formata çevrildi

### Changed / Değişenler
- **README.md** completely reshaped with S3, soft delete, Docker, search sections
  README.md yeniden şekillendirildi: S3, soft delete, Docker, arama bölümleri eklendi
- **CHANGELOG.md** rewritten in bilingual format (TR + EN)
  CHANGELOG.md çift dilli formatta yeniden yazıldı
- **.env.example** comments made bilingual
  .env.example yorumları çift dilli yapıldı
- **Swagger version** updated to `1.2.0`
  Swagger versiyonu `1.2.0` olarak güncellendi
- **Logger messages** converted to English for production compatibility
  Logger mesajları üretim uyumluluğu için İngilizceye çevrildi
- Removed emoji prefixes (`���`, `���`, `❌`) from code comments
  Kod yorumlarından emoji ön ekleri kaldırıldı

---

## [1.1.0] — 2026-02-13

### Added / Eklenenler
- **Soft delete** (`deletedAt: DateTime?`) on User, Post, and Comment models
  User, Post ve Comment modellerine soft delete eklendi
- **S3 file upload service** (`src/common/services/s3.service.ts`) — supports AWS S3, MinIO, Supabase
  S3 dosya yükleme servisi eklendi — AWS S3, MinIO, Supabase desteği
- **Docker Compose** configuration with PostgreSQL 16 + MinIO
  Docker Compose konfigürasyonu eklendi: PostgreSQL 16 + MinIO
- **Full-text search** using PostgreSQL `tsvector` with `@@index([title, content])`
  PostgreSQL `tsvector` ile tam metin arama eklendi
- **standard-version** for semantic versioning
  Semantik sürümleme için standard-version eklendi
- **`@aws-sdk/client-s3`** and **`@aws-sdk/lib-storage`** dependencies
  AWS S3 SDK bağımlılıkları eklendi
- S3 environment variables in `.env.example`
  `.env.example` dosyasına S3 ortam değişkenleri eklendi

### Changed / Değişenler
- **Blog delete endpoint** now uses soft delete instead of hard delete
  Blog silme endpoint'i artık soft delete kullanıyor
- **Blog upload endpoint** now uploads to S3 instead of local disk
  Blog resim yükleme artık yerel disk yerine S3'e yüklüyor
- **Blog search** refactored from `contains` to `tsvector` for better performance
  Blog araması performans için `tsvector` kullanacak şekilde refactor edildi
- Soft delete filter (`deletedAt: null`) applied to all read queries
  Tüm okuma sorgularına soft delete filtresi eklendi

---

## [1.0.0] — 2026-02-12

### Added / Eklenenler
- **Full Swagger/OpenAPI integration** — `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`, `@ApiParam`, `@ApiQuery`, `@ApiConsumes`, `@ApiBody` decorators on all controllers
  Swagger/OpenAPI entegrasyonu — tüm controller'lara dekoratörler eklendi
- **Swagger DTO schemas** — `@ApiProperty` / `@ApiPropertyOptional` on all DTOs
  Tüm DTO'lara Swagger şemaları eklendi
- **`UpdatePostsDto`** switched to `PartialType` from `@nestjs/swagger` for proper schema generation
  Swagger şema üretimi için `@nestjs/swagger`'dan `PartialType` kullanıldı
- **`.env.example`** file for environment variable documentation
  Ortam değişkenleri dokümantasyonu için `.env.example` dosyası oluşturuldu
- **`LICENSE`** (MIT) file added
  MIT lisans dosyası eklendi
- **Professional README.md** with badges, architecture, API docs, setup guide
  Profesyonel README.md oluşturuldu

### Changed / Değişenler
- **Code comments** cleaned — informal Turkish expressions replaced with professional language
  Kod yorumları temizlendi — gayri resmi ifadeler profesyonel dile çevrildi
- **`package.json`** — name changed to `nestjs-boilerplate`, version set to `1.0.0`
  Paket adı `nestjs-boilerplate` olarak değiştirildi
- **`.gitignore`** — fixed to only ignore `/prisma/generated` instead of entire `/prisma` directory
  `.gitignore` düzeltildi: tüm `/prisma` yerine sadece `/prisma/generated` yok sayılıyor

### Removed / Kaldırılanlar
- Dead code: `getHaberMesaji()`, `getYazilar()` functions
  Kullanılmayan fonksiyonlar kaldırıldı
- Unused local file upload middleware (replaced by S3 in v1.1.0)
  Kullanılmayan yerel dosya yükleme middleware'i kaldırıldı
