<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<h1 align="center">NestJS Boilerplate</h1>

<p align="center">
  <strong>Production-ready backend infrastructure built with NestJS, Prisma & PostgreSQL</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11.x-E0234E?style=for-the-badge&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-7.x-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Authentication & Authorization](#-authentication--authorization)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [License](#-license)

---

## 🎯 Overview

**NestJS Boilerplate** is an enterprise-grade backend boilerplate designed with clean architecture principles. It serves as the core infrastructure for the **ExpiTrack** project and can be used as a foundation for any scalable REST API.

Key design decisions:
- **Modular architecture** — each domain (Auth, Blog, Comment) is a self-contained module
- **Database-first approach** — Prisma ORM with migration history for safe schema evolution
- **Security by default** — JWT authentication, RBAC, input validation, and exception filtering out of the box

---

## 🏗 Architecture

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

## ✨ Features

### 🔐 Authentication & RBAC
| Feature | Description |
|---------|-------------|
| JWT Authentication | Stateless token-based auth with configurable expiration |
| Role-Based Access Control | 4-tier role system: `ADMIN`, `AUTHOR`, `PREMIUM`, `USER` |
| Password Hashing | bcrypt with salt rounds for secure storage |
| Custom Decorators | `@GetUser()` for request user extraction, `@Roles()` for route protection |
| Serialization | Automatic password exclusion from API responses via `class-transformer` |

### 📝 Blog Engine
| Feature | Description |
|---------|-------------|
| CRUD Operations | Full create, read, update, delete with ownership validation |
| Pagination | Configurable `page` & `limit` with total count metadata |
| Search | Case-insensitive full-text search across title and content |
| Tag Filtering | Many-to-many tag system with slug-based filtering |
| SEO Slugs | Auto-generated URL-friendly slugs via `slugify` with collision avoidance |
| Image Upload | Multer-based file upload with type/size validation (max 2MB) |

### 💬 Comment System
| Feature | Description |
|---------|-------------|
| Authenticated Comments | JWT-protected comment creation |
| Cascade Delete | Comments auto-deleted when parent post is removed |
| Author Association | Each comment linked to authenticated user |

### 🛡 Security & Quality
| Feature | Description |
|---------|-------------|
| Global Validation | `ValidationPipe` with whitelist & forbidNonWhitelisted |
| Exception Filter | Standardized error response format with logging |
| CORS Configuration | Pre-configured for common frontend ports |
| Static File Serving | Secure serving of uploaded assets |
| Swagger Documentation | Interactive API docs at `/api/docs` |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Framework** | NestJS 11 |
| **Language** | TypeScript 5.7 |
| **ORM** | Prisma 7 with PostgreSQL adapter (`@prisma/adapter-pg`) |
| **Database** | PostgreSQL |
| **Auth** | Passport.js + JWT (`@nestjs/passport`, `@nestjs/jwt`) |
| **Validation** | class-validator + class-transformer |
| **Documentation** | Swagger / OpenAPI (`@nestjs/swagger`) |
| **File Upload** | Multer (`@nestjs/platform-express`) |
| **SEO** | slugify |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 15.x (running instance)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/nestjs-boilerplate.git
cd nestjs-boilerplate

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL connection string and JWT secret

# 4. Run database migrations
npx prisma migrate dev --name init

# 5. Start the development server
npm run start:dev
```

### Verify Installation

- **API Base URL:** [http://localhost:3000/api](http://localhost:3000/api)
- **Swagger Docs:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 📁 Project Structure

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
│   └── validators/
│       └── image-type.validator.ts  # Custom file type validator
│
└── prisma/                          # 🗄 Database Layer
    ├── prisma.module.ts             # Global Prisma module
    └── prisma.service.ts            # Prisma client with pg adapter

prisma/
├── schema.prisma                    # Database schema definition
└── migrations/                      # Migration history
```

---

## 📡 API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/signup` | ❌ | Register a new user |
| `POST` | `/auth/signin` | ❌ | Login and receive JWT token |
| `GET` | `/auth/me` | 🔒 JWT | Get current user profile |

### Blog (`/api/blog`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/blog` | ❌ | List posts (paginated, filterable) |
| `GET` | `/blog/search?q=` | ❌ | Search posts |
| `GET` | `/blog/:id` | ❌ | Get single post with comments |
| `POST` | `/blog/create` | 🔒 JWT | Create a new post |
| `PATCH` | `/blog/:id` | 🔒 JWT | Update own post |
| `DELETE` | `/blog/:id` | 🔒 JWT + Role | Delete post (Admin/Author only) |
| `POST` | `/blog/upload` | 🔒 JWT | Upload image (max 2MB) |

### Comment (`/api/comment`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/comment` | 🔒 JWT | Add comment to a post |

### Query Parameters (Blog Listing)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Items per page |
| `search` | `string` | — | Search in title & content |
| `tag` | `string` | — | Filter by tag slug |

**Example:** `GET /api/blog?page=2&limit=5&tag=nestjs&search=prisma`

---

## 🔐 Authentication & Authorization

### JWT Flow

```
1. POST /api/auth/signup  →  Register (returns UserEntity)
2. POST /api/auth/signin  →  Login (returns { access_token, user })
3. Use token in headers   →  Authorization: Bearer <token>
4. Protected routes        →  @UseGuards(JwtGuard) validates token
5. Role-based routes       →  @Roles(Role.ADMIN) + RolesGuard checks role
```

### Role Hierarchy

| Role | Capabilities |
|------|-------------|
| `USER` | Read posts, create comments |
| `AUTHOR` | All USER + create/edit/delete own posts |
| `PREMIUM` | Extended access (reserved for future features) |
| `ADMIN` | Full system access, delete any post |

---

## 🗄 Database Schema

```prisma
enum Role { USER, AUTHOR, ADMIN, PREMIUM }

model User {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  password String
  name     String?
  role     Role      @default(USER)
  posts    Post[]
  comments Comment[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  slug      String   @unique
  image     String?
  createdAt DateTime @default(now())
  tags      Tag[]
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
  comments  Comment[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  slug  String @unique
  name  String @unique
  posts Post[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    Int
}
```

### Entity Relationships

```
User  1──N  Post       (Author can have many posts)
User  1──N  Comment    (User can have many comments)
Post  1──N  Comment    (Post can have many comments, cascade delete)
Post  N──M  Tag        (Many-to-many via implicit join table)
```

---

## ⚙ Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server
PORT=3000
```

> ⚠️ **Never commit `.env` to version control.** Use `.env.example` as a template.

---

## 📜 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev** | `npm run start:dev` | Start with hot-reload (watch mode) |
| **Build** | `npm run build` | Compile TypeScript to `dist/` |
| **Production** | `npm run start:prod` | Run compiled application |
| **Debug** | `npm run start:debug` | Start with debugger attached |
| **Lint** | `npm run lint` | Run ESLint with auto-fix |
| **Format** | `npm run format` | Run Prettier on source files |
| **Migrate** | `npx prisma migrate dev` | Apply pending database migrations |
| **Studio** | `npx prisma studio` | Open Prisma visual database browser |
| **Generate** | `npx prisma generate` | Regenerate Prisma Client |

---

## 🧪 API Response Formats

### Success Response (Post Listing)
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

### Error Response
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

## 🛡 Security Checklist

- [x] Passwords hashed with bcrypt (10 salt rounds)
- [x] JWT tokens with 1-hour expiration
- [x] Input validation on all endpoints (whitelist mode)
- [x] File upload restricted to images only (jpg, png, gif) with 2MB limit
- [x] CORS configured for specific origins
- [x] Sensitive fields excluded from responses (`@Exclude()`)
- [x] Role-based route protection
- [x] Global exception filter with structured error logging
- [ ] Rate limiting (recommended for production)
- [ ] Helmet.js headers (recommended for production)
- [ ] HTTPS enforcement (required for production)

---

## 📄 License

This project is [MIT licensed](LICENSE).

---

<p align="center">
  Built with ❤️ using <a href="https://nestjs.com">NestJS</a>
</p>
