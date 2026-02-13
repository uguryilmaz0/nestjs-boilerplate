# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.0.1](https://github.com/uguryilmaz0/nestjs-boilerplate/compare/v1.1.0...v1.0.1) (2026-02-13)

# 📋 Değişiklik Raporu (Changelog)

Bu dosya, projenin **GitHub'a açık kaynak olarak yayınlanmadan önce** yapılan tüm iyileştirme, düzeltme ve profesyonelleştirme çalışmalarını detaylıca açıklar.

---

## 📑 İçindekiler

1. [Swagger Entegrasyonu (Detaylı Açıklama)](#1--swagger-entegrasyonu)
2. [Kod Yorumları Profesyonelleştirildi](#2--kod-yorumları-profesyonelleştirildi)
3. [Dead Code Temizliği](#3--dead-code-temizliği)
4. [GitHub Açık Kaynak Hazırlığı](#4--github-açık-kaynak-hazırlığı)
5. [Branding Düzeltmesi](#5--branding-düzeltmesi)
6. [README.md Oluşturuldu](#6--readmemd-oluşturuldu)
7. [.gitignore Düzeltmesi](#7--gitignore-düzeltmesi)

---

## 1. 📖 Swagger Entegrasyonu

### Swagger Nedir?

**Swagger (OpenAPI)**, REST API'lerin otomatik olarak dökümante edilmesini sağlayan bir standarttır. NestJS'te `@nestjs/swagger` paketi kullanılarak entegre edilir. Sonuç olarak tarayıcıdan `/api/docs` adresine gidildiğinde, tüm endpoint'ler görsel bir arayüzde test edilebilir hale gelir.

### Neden Gerekli?

Swagger olmadan:
- Frontend geliştiricisi hangi endpoint'e ne gönderilmesi gerektiğini bilmez
- Her endpoint için ayrı dökümantasyon yazmak gerekir
- API'yi test etmek için Postman gibi harici araçlar şarttır
- Açık kaynak projelerde katkıda bulunanlar API'yi anlamakta zorlanır

Swagger ile:
- **Otomatik dökümantasyon** — Kod değişince döküman da güncellenir
- **Interaktif test** — Tarayıcıdan doğrudan API çağrısı yapılabilir
- **JWT desteği** — Kilit ikonuna tıklayıp token girilerek korumalı endpoint'ler test edilebilir
- **Request/Response şemaları** — DTO'lar otomatik olarak görsel şemaya dönüşür

### Ne Yapıldı?

Proje'de `main.ts` dosyasında Swagger setup zaten vardı, ama **hiçbir controller veya DTO'da Swagger dekoratörü yoktu**. Bu yüzden `/api/docs` açıldığında endpoint'ler listeleniyordu ama:
- Açıklamaları boştu
- Request body şemaları görünmüyordu
- Response tipleri belirsizdi
- JWT ile test edilemiyordu

### Eklenen Swagger Dekoratörleri

#### Controller Düzeyinde

| Dekoratör | Açıklama | Kullanıldığı Yer |
|-----------|----------|-----------------|
| `@ApiTags('Blog')` | Endpoint'leri Swagger UI'da gruplandırır | Her controller'ın en üstü |
| `@ApiOperation({ summary: '...' })` | Her endpoint'e açıklama ekler | Her metod üstü |
| `@ApiResponse({ status: 200, description: '...' })` | Olası HTTP yanıtlarını tanımlar | Her metod üstü |
| `@ApiBearerAuth()` | JWT gerektiren endpoint'lere kilit ikonu ekler | Korumalı endpoint'ler |
| `@ApiParam({ name: 'id' })` | URL parametrelerini açıklar | `:id` içeren rotalar |
| `@ApiQuery({ name: 'q' })` | Query string parametrelerini açıklar | Search endpoint |
| `@ApiConsumes('multipart/form-data')` | File upload content-type belirtir | Upload endpoint |
| `@ApiBody({ schema: ... })` | Dosya yükleme şemasını tanımlar | Upload endpoint |

#### DTO Düzeyinde

| Dekoratör | Açıklama | Örnek |
|-----------|----------|-------|
| `@ApiProperty({ example: '...' })` | Zorunlu alanları Swagger'da gösterir | `email`, `password`, `title` |
| `@ApiPropertyOptional({ example: '...' })` | Opsiyonel alanları gösterir | `name`, `tags`, `image` |

#### Önemli: UpdatePostsDto Değişikliği

```typescript
// ÖNCE — Swagger şeması üretilmiyordu
import { PartialType } from '@nestjs/mapped-types';

// SONRA — Swagger şeması otomatik üretilir
import { PartialType } from '@nestjs/swagger';
```

**Neden?** `@nestjs/mapped-types`'ın `PartialType`'ı sadece validasyonu kopyalar. `@nestjs/swagger`'ın `PartialType`'ı ise hem validasyonu hem de Swagger şemasını kopyalar. Bu sayede `UpdatePostsDto` Swagger'da doğru şekilde görünür.

### Swagger Nasıl Kullanılır?

1. Uygulamayı başlatın: `npm run start:dev`
2. Tarayıcıda açın: `http://localhost:3000/api/docs`
3. JWT gerektiren endpoint'leri test etmek için:
   - Önce `POST /api/auth/signin` ile giriş yapın
   - Dönen `access_token` değerini kopyalayın
   - Sağ üstteki **"Authorize"** butonuna tıklayın
   - `Bearer <token>` formatında yapıştırın
   - Artık korumalı endpoint'leri test edebilirsiniz

---

## 2. ✏️ Kod Yorumları Profesyonelleştirildi

### Neden?

Açık kaynak bir projede informal ifadeler (argo, şaka, şarkı sözleri) profesyonel görünmez ve uluslararası katkıda bulunanlar için kafa karıştırıcı olur.

### Değiştirilen İfadeler

| Dosya | Eski | Yeni |
|-------|------|------|
| `auth.dto.ts` | "kardeşim" | Resmi doğrulama mesajları |
| `login.dto.ts` | "kanka", "dostum" | Resmi doğrulama mesajları |
| `auth.service.ts` | "kardeşim", "dostum", "Güvenlik herşeydir!!!" | Kurumsal ton |
| `blog.controller.ts` | "kanka" | Resmi hata mesajı |
| `blog.service.ts` | Linkin Park şarkı sözleri, "zzz" | `"Yazı başarıyla silindi."` |
| `image-type.validator.ts` | "kanka" | Resmi mesaj |
| `main.ts` | "Tühhh" | `"Kritik bir hata oluştu"` |
| `http-exception.filter.ts` | `proje: 'NestJS Eğitim Projesi'` | `project: 'NestJS Boilerplate'` |

---

## 3. 🧹 Dead Code Temizliği

### Neden?

Kullanılmayan kod, projenin bakımını zorlaştırır ve açık kaynak incelemelerde kötü izlenim bırakır.

### Silinen Kodlar

| Dosya | Silinen | Sebep |
|-------|---------|-------|
| `blog.service.ts` | `getHaberMesaji()` | Demo/eğitim amaçlı metod, gerçek bir iş mantığı yok |
| `blog.service.ts` | `getYazilar()` | Hiçbir yerde çağrılmıyordu |
| `blog.service.ts` | `import { Post }` | Yukarıdakiler silinince gereksiz kaldı |

### Düzeltilen Bağımlılık

`blog.controller.ts`'teki `search` endpoint'i `getHaberMesaji()`'ı çağırıyordu. Bu metod silindiği için, `search` endpoint'i artık gerçek bir arama yapacak şekilde `getPosts({ search: q })` metoduna bağlandı.

---

## 4. 📦 GitHub Açık Kaynak Hazırlığı

### Oluşturulan Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `.env.example` | Geliştiricilerin hangi environment variable'lara ihtiyaç olduğunu görmesi için şablon dosya. `.env` dosyası `.gitignore`'da olduğundan repo'ya dahil edilmez — bu dosya onun yerine rehber görevi görür |
| `LICENSE` | MIT lisansı — açık kaynak projelerde olmazsa olmaz. Katkıda bulunanlar ve kullanıcılar yasal haklarını bilir |

### package.json Güncellemeleri

| Alan | Eski | Yeni | Sebep |
|------|------|------|-------|
| `name` | `first-my-backend` | `nestjs-boilerplate` | Profesyonel ve tanımlayıcı isim |
| `version` | `0.0.1` | `1.0.0` | İlk kararlı sürüm olarak semantic versioning |

---

## 5. 🏷 Branding Düzeltmesi

### Neden?

"Senior" ifadesi farkındalık sorunu yaratabilir — sanki "sadece seniorlar kullanabilir" veya "ben seniorim" mesajı verir. Sade ve profesyonel bir isimlendirme tercih edildi.

### Değiştirilen Yerler

- `main.ts` → Swagger başlığı
- `http-exception.filter.ts` → Error response `project` alanı
- `README.md` → 5 ayrı yerde (başlık, açıklama, git clone URL'i, JSON örneği)

---

## 6. 📄 README.md Oluşturuldu

### Neden?

README, bir GitHub reposunun **vitrinidir**. Açık kaynak projelerde README kalitesi, projenin ciddiyetini doğrudan yansıtır.

### İçerik

- Teknoloji badge'leri (NestJS, Prisma, PostgreSQL, TypeScript, Swagger)
- Mimari diyagram (ASCII art)
- Feature tabloları (Auth, Blog, Comment, Security)
- Tüm API endpoint'leri (method, path, auth durumu, açıklama)
- Database schema ve entity ilişkileri
- Adım adım kurulum rehberi
- Response format örnekleri (Success/Error JSON)
- Security checklist
- Script referans tablosu

---

## 7. 🔧 .gitignore Düzeltmesi

### Neden?

Orijinal `.gitignore` dosyasında `/prisma` klasörü tamamen ignore edilmişti. Bu **tehlikeli** bir durumdur çünkü:

- **Prisma schema** (`schema.prisma`) → Veritabanı yapısının tek kaynağı. Repo'da olmazsa kimse veritabanını yeniden oluşturamaz
- **Migration dosyaları** → Veritabanı evrim geçmişi. Bunlar olmadan `prisma migrate deploy` çalışmaz

### Yapılan Değişiklik

```diff
- /prisma
+ /prisma/generated    # Sadece generated client ignore edilir
+ /uploads/*           # Kullanıcı dosyaları repoya dahil edilmez
+ !/uploads/.gitkeep   # Klasör yapısı korunur
```

---

## 📊 Etkilenen Dosya Özeti

| # | Dosya | İşlem |
|---|-------|-------|
| 1 | `src/auth/auth.controller.ts` | Swagger dekoratörleri eklendi |
| 2 | `src/auth/auth.service.ts` | Yorum ve mesaj düzeltmeleri |
| 3 | `src/auth/dto/auth.dto.ts` | Swagger + mesaj düzeltmeleri |
| 4 | `src/auth/dto/login.dto.ts` | Swagger + mesaj düzeltmeleri |
| 5 | `src/blog/blog.controller.ts` | Swagger dekoratörleri + dead code bağlantısı |
| 6 | `src/blog/blog.service.ts` | Dead code temizliği + yorum düzeltmeleri |
| 7 | `src/blog/dto/create-posts.dto.ts` | Swagger dekoratörleri |
| 8 | `src/blog/dto/update-post.dto.ts` | `PartialType` import kaynağı değiştirildi |
| 9 | `src/blog/dto/get-posts-query.dto.ts` | Swagger dekoratörleri |
| 10 | `src/comment/comment.controller.ts` | Swagger dekoratörleri |
| 11 | `src/comment/dto/create-comment.dto.ts` | Swagger + `@IsInt()` eklendi |
| 12 | `src/common/filters/http-exception.filter.ts` | project adı güncellendi |
| 13 | `src/common/validators/image-type.validator.ts` | Hata mesajı düzeltildi |
| 14 | `src/main.ts` | Swagger açıklaması + hata mesajı |
| 15 | `package.json` | name + version güncellendi |
| 16 | `README.md` | Sıfırdan profesyonel dökümantasyon |
| 17 | `.env.example` | **Yeni dosya** |
| 18 | `LICENSE` | **Yeni dosya** |
| 19 | `.gitignore` | Prisma + uploads düzeltmesi |
| 20 | `CHANGELOG.md` | **Bu dosya** |
