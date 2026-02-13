# Changelog / Değişiklik Günlüğü

All notable changes to this project will be documented in this file.
Bu projedeki tüm önemli değişiklikler bu dosyada belgelenir.

See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
