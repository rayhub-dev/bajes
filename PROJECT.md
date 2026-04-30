# PRD — Money Tracker MVP (PWA)

**App name:** Bajes
**Version:** 1.0.0  
**Status:** Ready for Development  
**Last Updated:** April 2026  
**Author:** Product Team  
**Audience:** Engineering, Design, QA

---

## Table of Contents

1. [Overview & Goals](#1-overview--goals)
2. [Technical Stack](#2-technical-stack)
3. [Architecture](#3-architecture)
4. [Security Requirements](#4-security-requirements)
5. [Database Schema](#5-database-schema)
6. [API Specification](#6-api-specification)
7. [Feature Specifications & User Stories](#7-feature-specifications--user-stories)
8. [PWA Requirements](#8-pwa-requirements)
9. [Frontend Standards](#9-frontend-standards)
10. [Backend Standards](#10-backend-standards)
11. [Testing Requirements](#11-testing-requirements)
12. [Performance Budgets](#12-performance-budgets)
13. [Deployment & CI/CD](#13-deployment--cicd)
14. [Definition of Done](#14-definition-of-done)
15. [Out of Scope (MVP)](#15-out-of-scope-mvp)

---

## 1. Overview & Goals

### 1.1 Product Vision

Aplikasi pencatatan keuangan personal berbasis web Progressive Web App (PWA) yang dapat diinstal di Android dan iOS. Target pengguna: usia 18–29 tahun di Indonesia yang ingin mulai mengelola keuangan tanpa kerumitan.

### 1.2 Problem Statement

- 76% anak muda Indonesia boros karena FOMO spending
- Hanya 5% yang menggunakan aplikasi perencanaan keuangan khusus
- Hambatan utama: friction input terlalu tinggi dan onboarding yang kompleks

### 1.3 MVP Success Metrics

| Metric                                | Target      |
| ------------------------------------- | ----------- |
| Monthly Active Users (MAU) bulan ke-6 | ≥ 5.000     |
| Retensi pengguna hari ke-30           | ≥ 20%       |
| Waktu input per transaksi             | ≤ 10 detik  |
| Lighthouse PWA Score                  | ≥ 90        |
| Core Web Vitals (LCP)                 | ≤ 2.5s      |
| Crash rate                            | < 0.1% sesi |

### 1.4 Business Constraints

- Bukan Penyedia Jasa Pembayaran (PJP) — tidak memfasilitasi transaksi
- Tidak menghimpun dana pengguna
- Wajib patuh UU PDP (Perlindungan Data Pribadi)
- Gratis 100% di fase MVP (0–12 bulan)

---

## 2. Technical Stack

### 2.1 Frontend

```
Framework     : Next.js 14 (App Router)
Language      : TypeScript 5.x (strict mode wajib)
Styling       : Tailwind CSS 3.x
PWA Engine    : next-pwa + Workbox 7
Local Storage : IndexedDB via Dexie.js 3.x
State Mgmt    : Zustand 4.x (client) + React Query 5.x (server state)
Form          : React Hook Form 7.x + Zod 3.x
Charts        : Recharts 2.x
Animation     : Framer Motion 11.x (ringan, pakai sparingly)
HTTP Client   : Axios (dengan interceptor otomatis)
Auth Client   : Firebase Auth JS SDK 10.x
```

### 2.2 Backend

```
Runtime       : Node.js 20 LTS
Framework     : Fastify 4.x
Language      : TypeScript 5.x (strict mode wajib)
ORM           : Prisma 5.x
Database      : PostgreSQL 15 (Supabase)
Cache         : Redis via Upstash (REST SDK)
Push Notif    : web-push (VAPID)
Auth          : Firebase Admin SDK + custom JWT middleware
Validation    : Zod (shared schema dengan frontend)
Logging       : Pino (structured JSON logging)
```

### 2.3 Infrastructure

```
Frontend Host : Vercel (Hobby → Pro saat scale)
API Host      : Railway
Database      : Supabase (PostgreSQL + Row Level Security)
CDN + WAF     : Cloudflare (free tier — SSL, DDoS, WAF rules)
Redis         : Upstash (free 10K req/day → pay-as-you-go)
Monitoring    : Sentry (error tracking, performance)
Analytics     : PostHog (self-hosted atau cloud free tier)
CI/CD         : GitHub Actions
Domain + SSL  : Cloudflare (auto-renew, HSTS)
```

### 2.4 Shared

```
Monorepo      : Turborepo
Shared types  : packages/types (dipakai FE dan BE)
Shared schema : packages/schemas (Zod — validasi konsisten)
Package mgr   : pnpm
Node version  : .nvmrc dengan Node 20 LTS
```

---

## 3. Architecture

### 3.1 Monorepo Structure

```
money-tracker/
├── apps/
│   ├── web/                    # Next.js PWA
│   │   ├── app/                # App Router pages
│   │   │   ├── (auth)/         # Login, register, onboarding
│   │   │   ├── (app)/          # Protected: dashboard, transactions, budget, report
│   │   │   └── api/            # Next.js API routes (minimal, proxy ke backend)
│   │   ├── components/
│   │   │   ├── ui/             # Primitive components (Button, Input, Modal, etc.)
│   │   │   ├── features/       # Feature components (TransactionForm, BudgetCard, etc.)
│   │   │   └── layouts/        # Layout components (AppShell, BottomNav, etc.)
│   │   ├── lib/
│   │   │   ├── db/             # Dexie.js IndexedDB schema & hooks
│   │   │   ├── sync/           # Offline queue & sync logic
│   │   │   ├── crypto/         # Web Crypto API wrapper
│   │   │   └── api/            # Axios instance + API functions
│   │   ├── store/              # Zustand stores
│   │   ├── hooks/              # Custom React hooks
│   │   ├── public/
│   │   │   ├── manifest.webmanifest
│   │   │   ├── sw.js           # Service Worker (generated by next-pwa)
│   │   │   └── icons/          # PWA icons (semua ukuran)
│   │   └── next.config.js
│   │
│   └── api/                    # Fastify API server
│       ├── src/
│       │   ├── routes/         # Route handlers (transactions, budgets, reports, auth, push)
│       │   ├── services/       # Business logic layer
│       │   ├── repositories/   # Database access layer (Prisma)
│       │   ├── middleware/      # Auth, rate limit, CSRF, logging
│       │   ├── plugins/        # Fastify plugins
│       │   └── server.ts       # Entry point
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
│
├── packages/
│   ├── types/                  # TypeScript types bersama
│   ├── schemas/                # Zod schemas bersama (validasi FE & BE konsisten)
│   └── config/                 # Shared ESLint, Prettier, TS configs
│
├── .github/workflows/          # CI/CD pipelines
├── turbo.json
└── pnpm-workspace.yaml
```

### 3.2 Offline-First Data Flow

```
User Input
    │
    ▼
[Zustand store] ──► [IndexedDB via Dexie] ──► UI update (optimistic)
                           │
                           ▼
                    [Sync Queue]
                     (background)
                           │
                    Online? ──► YES ──► [Fastify API] ──► [PostgreSQL]
                           │                                    │
                           NO                              Conflict?
                           │                                    │
                    Queue preserved               last-write-wins + timestamp
                    (Background Sync API)
```

### 3.3 Authentication Flow

```
1. User klik "Login dengan Google"
2. Firebase Auth mengembalikan ID Token (JWT Firebase)
3. FE kirim ID Token ke POST /api/auth/session
4. BE validasi token via Firebase Admin SDK
5. BE buat server-side session → set HttpOnly cookie (access_token, 15min)
6. BE juga set HttpOnly cookie (refresh_token, 7 hari, rotated)
7. Semua request API berikutnya menggunakan cookie (bukan Authorization header)
8. CSRF token dikirim via X-CSRF-Token header (double-submit cookie pattern)
```

---

## 4. Security Requirements

> **WAJIB:** Semua poin di bagian ini adalah hard requirement. PR tidak akan di-merge jika ada yang belum terpenuhi.

### 4.1 Transport Security

```
- HTTPS wajib di semua environment (including staging)
- TLS 1.2 minimum, TLS 1.3 preferred
- HSTS header: max-age=31536000; includeSubDomains; preload
- Cloudflare SSL mode: Full (Strict)
- Tidak ada mixed content (semua asset via HTTPS)
```

### 4.2 Authentication & Session

```
- Gunakan HttpOnly + Secure + SameSite=Strict cookie untuk token
- JANGAN simpan access token di localStorage atau sessionStorage
- CSRF protection: double-submit cookie pattern
  - Server set csrf_token cookie (tidak HttpOnly)
  - Client baca cookie, kirim via X-CSRF-Token header
  - Server verifikasi header === cookie value
- Access token TTL: 15 menit
- Refresh token TTL: 7 hari, rotasi setiap penggunaan
- Refresh token lama di-invalidasi setelah rotasi (one-time use)
- Firebase ID Token divalidasi server-side SETIAP sesi baru
- Logout wajib invalidasi refresh token di database (denylist)
```

### 4.3 Data Encryption

```
# Data sensitif (nominal transaksi, budget amount) di sisi klien:
- Enkripsi menggunakan Web Crypto API (AES-GCM, 256-bit)
- Key derivasi: PBKDF2 dari kombinasi user UID + device fingerprint
- IV (Initialization Vector) baru untuk setiap enkripsi
- Enkripsi terjadi SEBELUM data dikirim ke server

# Data di sisi server (PostgreSQL):
- Field sensitif dienkripsi dengan AES-256-GCM (library: @noble/ciphers)
- Encryption key dari environment variable (tidak hardcode)
- Key rotation support (versi key disimpan bersama ciphertext)
- Connection PostgreSQL menggunakan SSL

# IndexedDB lokal:
- Data sensitif dienkripsi sebelum disimpan ke Dexie
- Kunci enkripsi lokal disimpan di sessionStorage (clear saat browser tutup)
- Guest mode: data tidak dienkripsi (tidak ada akun, tidak ada data sensitif)
```

### 4.4 HTTP Security Headers

Implementasikan via `next.config.js` dan Fastify hooks:

```typescript
// next.config.js headers
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'nonce-{NONCE}'", // Nonce-based, bukan unsafe-inline
      "style-src 'self' 'unsafe-inline'", // Tailwind memerlukan ini, mitigasi via CSP nonce on critical inline styles
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.yourdomain.com https://*.firebaseapp.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];
```

### 4.5 Input Validation & Sanitization

```
- Semua input pengguna WAJIB divalidasi dengan Zod schema (shared packages/schemas)
- Validasi terjadi di DUA tempat: frontend (UX) DAN backend (keamanan)
- Backend TIDAK pernah mempercayai input dari frontend
- Gunakan DOMPurify untuk konten yang akan di-render sebagai HTML
- SQL injection: dicegah oleh Prisma (parameterized queries) — JANGAN pernah raw SQL
- Nomor transaksi: validasi range (0 < amount <= 999_999_999)
- String fields: trim + maxLength validation
- Date fields: validasi tidak boleh lebih dari 1 tahun ke depan atau 10 tahun ke belakang
```

### 4.6 Rate Limiting

```typescript
// Fastify rate limit config
const rateLimits = {
  // Auth endpoints — lebih ketat
  "/api/auth/*": { max: 10, timeWindow: "15 minutes" },

  // Transaction CRUD
  "/api/transactions": { max: 100, timeWindow: "1 minute" },

  // Budget endpoints
  "/api/budgets": { max: 50, timeWindow: "1 minute" },

  // Report generation (berat)
  "/api/reports": { max: 10, timeWindow: "1 minute" },

  // Push subscription
  "/api/push/*": { max: 5, timeWindow: "1 minute" },

  // Global fallback
  global: { max: 200, timeWindow: "1 minute" },
};
// Key by: IP + User ID (jika authenticated)
```

### 4.7 Dependency Security

```
- Jalankan `pnpm audit` di setiap CI pipeline run
- Blokir merge jika ada high/critical vulnerability
- Gunakan Dependabot untuk auto-update dependencies
- Lock file (pnpm-lock.yaml) wajib di-commit
- Tidak boleh ada package dengan known vulnerability di production
```

---

## 5. Database Schema

### 5.1 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Untuk Supabase connection pooling
}

// ─── Users ───────────────────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  firebaseUid   String    @unique @map("firebase_uid")
  email         String    @unique
  displayName   String?   @map("display_name")
  photoUrl      String?   @map("photo_url")
  currencyCode  String    @default("IDR") @map("currency_code")
  isGuest       Boolean   @default(false) @map("is_guest")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at") // Soft delete

  transactions  Transaction[]
  budgets       Budget[]
  categories    Category[]
  sessions      Session[]
  pushSubs      PushSubscription[]
  auditLogs     AuditLog[]

  @@map("users")
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

model Session {
  id            String    @id @default(cuid())
  userId        String    @map("user_id")
  refreshToken  String    @unique @map("refresh_token") // Hashed
  userAgent     String?   @map("user_agent")
  ipAddress     String?   @map("ip_address")
  expiresAt     DateTime  @map("expires_at")
  revokedAt     DateTime? @map("revoked_at")
  createdAt     DateTime  @default(now()) @map("created_at")

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([refreshToken])
  @@map("sessions")
}

// ─── Categories ───────────────────────────────────────────────────────────────

model Category {
  id          String    @id @default(cuid())
  userId      String?   @map("user_id") // null = system default category
  name        String
  icon        String    // Emoji atau icon identifier
  color       String    // Hex color
  type        CategoryType
  isDefault   Boolean   @default(false) @map("is_default")
  sortOrder   Int       @default(0) @map("sort_order")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  user        User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  budgets     Budget[]

  @@index([userId])
  @@map("categories")
}

enum CategoryType {
  INCOME
  EXPENSE
}

// ─── Transactions ─────────────────────────────────────────────────────────────

model Transaction {
  id              String    @id @default(cuid())
  userId          String    @map("user_id")
  categoryId      String    @map("category_id")

  // Nominal dienkripsi di aplikasi layer, disimpan sebagai encrypted string
  // Format: "enc:v1:<iv_hex>:<ciphertext_base64>"
  // Untuk query aggregation, simpan juga plaintext amount (integer, dalam sen/rupiah penuh)
  // Di production: pertimbangkan encrypted field ATAU homomorphic encryption untuk aggregation
  amountEncrypted String    @map("amount_encrypted")
  amountCents     Int       @map("amount_cents") // In IDR, no decimals. Untuk indexing & aggregation.

  type            TransactionType
  note            String?   // Opsional, dienkripsi juga jika ada
  transactionDate DateTime  @map("transaction_date") // Tanggal transaksi (bukan created_at)

  // Sync metadata
  clientId        String?   @unique @map("client_id") // UUID dari IndexedDB, untuk idempotency
  syncedAt        DateTime? @map("synced_at")

  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  deletedAt       DateTime? @map("deleted_at") // Soft delete untuk sync

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category        Category  @relation(fields: [categoryId], references: [id])

  @@index([userId, transactionDate(sort: Desc)])
  @@index([userId, deletedAt])
  @@index([clientId])
  @@map("transactions")
}

enum TransactionType {
  INCOME
  EXPENSE
}

// ─── Budgets ──────────────────────────────────────────────────────────────────

model Budget {
  id            String    @id @default(cuid())
  userId        String    @map("user_id")
  categoryId    String    @map("category_id")
  amountCents   Int       @map("amount_cents") // Limit budget dalam sen
  periodType    PeriodType @map("period_type")
  periodYear    Int       @map("period_year")
  periodMonth   Int?      @map("period_month") // null jika weekly
  periodWeek    Int?      @map("period_week")  // ISO week number, null jika monthly
  notifyAt      Int       @default(80) @map("notify_at") // Persentase trigger notifikasi (default 80%)
  notifiedAt    DateTime? @map("notified_at") // Kapan terakhir notifikasi dikirim
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category      Category  @relation(fields: [categoryId], references: [id])

  @@unique([userId, categoryId, periodType, periodYear, periodMonth, periodWeek])
  @@index([userId, periodYear, periodMonth])
  @@map("budgets")
}

enum PeriodType {
  MONTHLY
  WEEKLY
}

// ─── Push Subscriptions ───────────────────────────────────────────────────────

model PushSubscription {
  id          String    @id @default(cuid())
  userId      String    @map("user_id")
  endpoint    String    @unique
  p256dh      String    @map("p256dh") // Public key
  auth        String    // Auth secret
  userAgent   String?   @map("user_agent")
  createdAt   DateTime  @default(now()) @map("created_at")
  lastUsedAt  DateTime? @map("last_used_at")

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("push_subscriptions")
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

model AuditLog {
  id          String    @id @default(cuid())
  userId      String    @map("user_id")
  action      String    // e.g., "transaction.created", "budget.updated", "session.revoked"
  resourceId  String?   @map("resource_id")
  ipAddress   String?   @map("ip_address")
  userAgent   String?   @map("user_agent")
  metadata    Json?     // Additional context (non-sensitive)
  createdAt   DateTime  @default(now()) @map("created_at")

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt(sort: Desc)])
  @@map("audit_logs")
}
```

### 5.2 Row Level Security (Supabase RLS)

```sql
-- Aktifkan RLS untuk semua tabel user data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: user hanya bisa akses data miliknya sendiri
-- (Prisma menggunakan service role key yang bypass RLS,
--  tapi RLS tetap diaktifkan sebagai defense-in-depth)
CREATE POLICY "Users own data" ON transactions
  USING (user_id = auth.uid());

-- Catatan: Prisma dengan service role key bypass RLS.
-- Pastikan userId selalu diambil dari session server-side,
-- TIDAK PERNAH dari request body/params client.
```

### 5.3 Default Categories Seed

```typescript
// prisma/seed.ts — dijalankan saat init

const defaultCategories = [
  // Expense
  {
    name: "Makanan & Minuman",
    icon: "🍜",
    color: "#FF6B6B",
    type: "EXPENSE",
    isDefault: true,
    sortOrder: 1,
  },
  {
    name: "Transportasi",
    icon: "🚗",
    color: "#4ECDC4",
    type: "EXPENSE",
    isDefault: true,
    sortOrder: 2,
  },
  {
    name: "Belanja",
    icon: "🛍️",
    color: "#45B7D1",
    type: "EXPENSE",
    isDefault: true,
    sortOrder: 3,
  },
  {
    name: "Tagihan",
    icon: "📱",
    color: "#96CEB4",
    type: "EXPENSE",
    isDefault: true,
    sortOrder: 4,
  },
  {
    name: "Hiburan",
    icon: "🎮",
    color: "#FFEAA7",
    type: "EXPENSE",
    isDefault: true,
    sortOrder: 5,
  },
  // Income
  {
    name: "Gaji",
    icon: "💼",
    color: "#6BCB77",
    type: "INCOME",
    isDefault: true,
    sortOrder: 1,
  },
  {
    name: "Freelance",
    icon: "💻",
    color: "#4D96FF",
    type: "INCOME",
    isDefault: true,
    sortOrder: 2,
  },
];
```

---

## 6. API Specification

### 6.1 Base URL & Conventions

```
Base URL: https://api.yourdomain.com/v1

Semua response mengikuti format:
{
  "success": boolean,
  "data": T | null,
  "error": { "code": string, "message": string } | null,
  "meta": { "timestamp": string, "requestId": string } | null
}

Pagination:
{
  "data": T[],
  "pagination": {
    "page": number,
    "pageSize": number,
    "total": number,
    "totalPages": number
  }
}

Timestamps: ISO 8601 (e.g., "2026-04-18T10:30:00.000Z")
Currency: Integer dalam IDR (bukan desimal). 50000 = Rp50.000
```

### 6.2 Auth Endpoints

```typescript
// POST /v1/auth/session
// Tukar Firebase ID Token menjadi server session
Request:  { idToken: string }
Response: { user: UserDTO }
Cookie:   Set access_token (HttpOnly, 15min) + refresh_token (HttpOnly, 7d) + csrf_token

// POST /v1/auth/refresh
// Rotate refresh token
Request:  (cookie: refresh_token) + Header: X-CSRF-Token
Response: { user: UserDTO }
Cookie:   Refresh access_token + refresh_token (rotated)

// POST /v1/auth/logout
// Revoke semua session atau session tertentu
Request:  (cookie: refresh_token) + Header: X-CSRF-Token
Response: { success: true }
Cookie:   Clear semua auth cookies

// GET /v1/auth/me
// Ambil data user yang sedang login
Response: { user: UserDTO }

// DELETE /v1/auth/sessions/:sessionId
// Revoke satu session (untuk "logout device lain")
```

### 6.3 Transaction Endpoints

```typescript
// GET /v1/transactions
// Query params: startDate, endDate, categoryId, type, page, pageSize, sortBy
// Default: bulan ini, semua kategori, expense+income, page 1, pageSize 20
Response: { data: TransactionDTO[], pagination: PaginationMeta }

// POST /v1/transactions
// Body:
{
  categoryId: string,       // UUID
  amountEncrypted: string,  // "enc:v1:<iv>:<ciphertext>" — enkripsi sudah dari klien
  amountCents: number,      // Untuk aggregation di server
  type: "INCOME" | "EXPENSE",
  note?: string,            // Opsional, boleh terenkripsi
  transactionDate: string,  // ISO date string
  clientId: string,         // UUID dari IndexedDB — untuk idempotency
}
Response: { data: TransactionDTO }

// PUT /v1/transactions/:id
// Body: Partial dari POST body (kecuali clientId)
Response: { data: TransactionDTO }

// DELETE /v1/transactions/:id
// Soft delete — set deletedAt
Response: { success: true }

// POST /v1/transactions/batch
// Sync batch dari offline queue (maksimal 50 per request)
Request:  { operations: Array<{ type: "create"|"update"|"delete", data: TransactionDTO }> }
Response: { succeeded: string[], failed: Array<{ clientId: string, error: string }> }
```

### 6.4 Budget Endpoints

```typescript
// GET /v1/budgets
// Query params: year, month (default: bulan ini)
// Includes: spent amount per kategori untuk periode tersebut
Response: { data: BudgetWithSpentDTO[] }

// POST /v1/budgets
{
  categoryId: string,
  amountCents: number,
  periodType: "MONTHLY" | "WEEKLY",
  periodYear: number,
  periodMonth?: number,  // 1-12, required jika MONTHLY
  periodWeek?: number,   // ISO week, required jika WEEKLY
  notifyAt?: number,     // Default 80 (persen)
}
Response: { data: BudgetDTO }

// PUT /v1/budgets/:id
// Body: Partial dari POST body
Response: { data: BudgetDTO }

// DELETE /v1/budgets/:id
Response: { success: true }
```

### 6.5 Report Endpoints

```typescript
// GET /v1/reports/summary
// Query params: year, month
// Response: ringkasan income, expense, net, top categories
Response: {
  data: {
    totalIncome: number,    // Dalam cents
    totalExpense: number,
    netBalance: number,
    topExpenseCategories: Array<{
      category: CategoryDTO,
      totalCents: number,
      percentage: number,
      transactionCount: number,
    }>,
    dailyTotals: Array<{
      date: string,         // "2026-04-01"
      totalIncomeCents: number,
      totalExpenseCents: number,
    }>,
  }
}

// GET /v1/reports/export/csv
// Query params: year, month
// Download CSV — fitur ini hanya untuk premium (gate di backend)
// MVP: kembalikan 402 Payment Required dengan message "Coming soon"
Response: CSV file atau 402
```

### 6.6 Category Endpoints

```typescript
// GET /v1/categories
// Query params: type (INCOME|EXPENSE|ALL)
// Returns: default categories (userId: null) + user custom categories
Response: { data: CategoryDTO[] }

// POST /v1/categories
// Buat kategori kustom (MVP: opsional, bisa di-hold untuk v1.1)
{
  name: string,       // Max 30 chars
  icon: string,       // Emoji atau identifier
  color: string,      // Hex color
  type: CategoryType,
}
Response: { data: CategoryDTO }
```

### 6.7 Push Notification Endpoints

```typescript
// POST /v1/push/subscribe
{
  endpoint: string,
  keys: {
    p256dh: string,
    auth: string,
  }
}
Response: { success: true, subscriptionId: string }

// DELETE /v1/push/subscribe/:subscriptionId
Response: { success: true }
```

### 6.8 Error Codes

```
AUTH_001: Token tidak valid atau expired
AUTH_002: Session tidak ditemukan atau sudah dicabut
AUTH_003: CSRF token tidak valid
AUTH_004: Rate limit exceeded

VALIDATION_001: Input tidak valid (sertakan field yang error)
VALIDATION_002: Amount harus > 0
VALIDATION_003: Tanggal tidak valid

RESOURCE_001: Resource tidak ditemukan
RESOURCE_002: Akses ditolak (bukan milik user ini)
RESOURCE_003: Konflik (clientId sudah ada — idempotent, kembalikan existing record)

SERVER_001: Internal server error (jangan expose detail)
```

---

## 7. Feature Specifications & User Stories

### 7.1 Onboarding

**Epic: Pengguna baru bisa mulai mencatat dalam < 60 detik**

#### US-001: Guest mode

```
SEBAGAI pengunjung baru
SAYA INGIN langsung mencoba aplikasi tanpa daftar
AGAR saya bisa menilai apakah aplikasinya berguna sebelum komitmen

Acceptance Criteria:
- [ ] Tersedia tombol "Coba tanpa akun" di halaman landing
- [ ] Data tersimpan di IndexedDB lokal (tidak dikirim ke server)
- [ ] Maksimal 10 transaksi di guest mode — selebihnya muncul prompt untuk daftar
- [ ] Muncul banner "Buat akun untuk menyimpan data" setelah 3 transaksi
- [ ] Saat user daftar dari guest mode, data lokal di-migrate ke akun baru
- [ ] Clear data guest jika user tidak aktif 30 hari
```

#### US-002: Daftar / Login

```
SEBAGAI calon pengguna
SAYA INGIN mendaftar menggunakan akun Google
AGAR saya tidak perlu membuat password baru

Acceptance Criteria:
- [ ] Halaman auth menampilkan: Google SSO + Guest option
- [ ] Tidak ada form email/password di MVP
- [ ] Setelah login pertama, tampilkan tutorial 3 langkah (dismissible)
- [ ] Tutorial langkah 1: cara tambah transaksi
- [ ] Tutorial langkah 2: cara set budget
- [ ] Tutorial langkah 3: cara lihat dashboard
- [ ] Tutorial bisa di-skip
- [ ] Setelah selesai/skip tutorial, langsung ke dashboard
- [ ] Total waktu onboarding ≤ 60 detik (diukur di user testing)
```

### 7.2 Pencatatan Transaksi

**Epic: Input transaksi dalam < 10 detik**

#### US-003: Tambah transaksi

```
SEBAGAI pengguna aktif
SAYA INGIN mencatat pengeluaran dengan cepat
AGAR saya tidak kehilangan momen untuk mencatat

Acceptance Criteria:
- [ ] Tombol "+" (FAB) selalu visible di bottom navigation
- [ ] Modal/sheet transaksi muncul dalam < 200ms setelah tap
- [ ] Field yang tersedia: nominal (required), kategori (required), tanggal (default hari ini), catatan (opsional)
- [ ] Keyboard numerik muncul otomatis saat modal terbuka
- [ ] Nominal menggunakan format Rupiah otomatis (50000 → "Rp 50.000")
- [ ] Kategori ditampilkan sebagai grid icon — tidak dropdown
- [ ] Tanggal bisa diubah tapi default hari ini
- [ ] Catatan adalah textarea single-line, enter untuk submit
- [ ] Tombol simpan di posisi mudah dijangkau ibu jari
- [ ] Waktu dari buka modal sampai simpan berhasil: ≤ 10 detik (benchmark internal)
- [ ] Saat offline: data tersimpan lokal + muncul indikator "Akan disinkronkan"
- [ ] Saat sync berhasil: hapus indikator "pending"
- [ ] Support income dan expense (toggle di atas modal)
```

#### US-004: Edit & hapus transaksi

```
SEBAGAI pengguna
SAYA INGIN mengedit transaksi yang salah
AGAR data saya akurat

Acceptance Criteria:
- [ ] Tap transaksi di list → buka modal edit (prefilled)
- [ ] Swipe kiri pada transaksi → tampilkan tombol delete (dengan confirm dialog)
- [ ] Hapus adalah soft delete (data masih ada di server, tidak muncul di UI)
- [ ] Edit / hapus tersync saat online
```

#### US-005: Riwayat transaksi

```
SEBAGAI pengguna
SAYA INGIN melihat semua transaksi saya
AGAR saya bisa review pengeluaran

Acceptance Criteria:
- [ ] List transaksi dikelompokkan per hari (section header)
- [ ] Setiap item menampilkan: ikon kategori, nama kategori, catatan (jika ada), nominal, waktu
- [ ] Expense ditampilkan merah, income hijau
- [ ] Filter tersedia: bulan (default bulan ini), kategori, tipe (income/expense/all)
- [ ] Infinite scroll (bukan pagination dengan next button)
- [ ] Search by catatan (optional untuk MVP — bisa di v1.1)
- [ ] Empty state yang informatif jika belum ada transaksi
```

### 7.3 Dashboard

**Epic: Pengguna tahu kondisi keuangan dalam 3 detik**

#### US-006: Dashboard utama

```
SEBAGAI pengguna yang membuka aplikasi
SAYA INGIN langsung tahu kondisi keuangan bulan ini
AGAR saya bisa buat keputusan pengeluaran hari ini

Acceptance Criteria:
- [ ] Hero card: "Sisa Bulan Ini" dengan angka besar + indikator aman/hati-hati/bahaya
  - Aman (hijau): > 30% dari total budget
  - Hati-hati (kuning): 10–30% dari total budget
  - Bahaya (merah): < 10% dari total budget
- [ ] Summary card: Total Pemasukan vs Total Pengeluaran bulan ini
- [ ] Donut/pie chart kategori pengeluaran (top 5 + others)
- [ ] Daftar transaksi terbaru (5 item, tap untuk lihat semua)
- [ ] Dashboard load dalam < 1.5 detik (dari cache lokal)
- [ ] Data ditampilkan dari IndexedDB dulu (offline-first), sync di background
- [ ] Pull-to-refresh untuk force sync
- [ ] Tampilkan bulan/tahun yang sedang dilihat + navigator bulan
```

### 7.4 Budget

**Epic: Pengguna bisa set limit pengeluaran per kategori**

#### US-007: Set budget bulanan

```
SEBAGAI pengguna yang mau disiplin
SAYA INGIN set batas pengeluaran per kategori
AGAR saya tidak overspending

Acceptance Criteria:
- [ ] Halaman budget menampilkan semua kategori expense
- [ ] Setiap kategori menampilkan: budget amount, spent amount, progress bar, persentase
- [ ] Tap kategori untuk edit budget
- [ ] Budget 0 = tidak ada limit (progress bar tidak ditampilkan)
- [ ] Progress bar: hijau < 60%, kuning 60–80%, merah > 80%
- [ ] Label persentase di atas progress bar
- [ ] "Rp X tersisa" atau "Rp X over budget"
- [ ] Budget berlaku per bulan (ganti otomatis tiap bulan baru)
```

#### US-008: Notifikasi budget

```
SEBAGAI pengguna dengan budget aktif
SAYA INGIN dapat notifikasi saat mendekati limit
AGAR saya bisa stop pengeluaran sebelum terlambat

Acceptance Criteria:
- [ ] Notifikasi push dikirim saat pengeluaran mencapai notifyAt% dari budget (default 80%)
- [ ] Hanya satu notifikasi per budget per periode (tidak spam)
- [ ] Isi notifikasi: "[Kategori]: Budget hampir habis — Rp X tersisa dari Rp Y"
- [ ] Tap notifikasi → buka halaman budget
- [ ] Notifikasi tidak dikirim jika user belum subscribe push
- [ ] Minta izin push notification setelah user aktif 3 hari (bukan hari pertama)
- [ ] Pengguna bisa turn off notifikasi per kategori dari settings
```

### 7.5 Laporan Bulanan

**Epic: Pengguna punya insight pengeluaran di akhir bulan**

#### US-009: Laporan ringkasan

```
SEBAGAI pengguna aktif
SAYA INGIN lihat ringkasan keuangan bulan ini
AGAR saya bisa evaluasi dan perbaiki bulan depan

Acceptance Criteria:
- [ ] Summary: Total income, total expense, net balance
- [ ] Top 3 kategori pengeluaran terbesar (dengan nominal dan persentase)
- [ ] Bar chart: pengeluaran harian sepanjang bulan
- [ ] Navigasi bulan: bisa lihat bulan-bulan sebelumnya
- [ ] Perbandingan vs bulan lalu (month-over-month) untuk expense total
- [ ] Export CSV: kembalikan "Fitur premium — segera hadir" (jangan error)
- [ ] Laporan ter-generate < 2 detik
```

---

## 8. PWA Requirements

### 8.1 Web App Manifest

```json
// public/manifest.webmanifest
{
  "name": "Money Tracker — Catat Keuanganmu",
  "short_name": "MoneyTracker",
  "description": "Catat pengeluaran dan pemasukan dengan mudah",
  "start_url": "/?source=pwa",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FFFFFF",
  "theme_color": "#1A73E8",
  "lang": "id",
  "dir": "ltr",
  "categories": ["finance", "productivity"],
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/dashboard.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "shortcuts": [
    {
      "name": "Tambah Pengeluaran",
      "short_name": "Tambah",
      "description": "Catat pengeluaran baru",
      "url": "/?action=add-expense",
      "icons": [{ "src": "/icons/shortcut-add.png", "sizes": "96x96" }]
    }
  ],
  "share_target": {
    "action": "/share-target",
    "method": "GET",
    "params": { "text": "amount" }
  }
}
```

### 8.2 Service Worker Strategy (Workbox)

```typescript
// next.config.js (next-pwa config)
// Caching strategies per resource type:

const runtimeCaching = [
  // API calls: network-first dengan fallback ke cache
  {
    urlPattern: /^https:\/\/api\.yourdomain\.com\/v1\/.*/,
    handler: "NetworkFirst",
    options: {
      cacheName: "api-cache",
      networkTimeoutSeconds: 5,
      expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 }, // 1 jam
    },
  },
  // Static assets: cache-first
  {
    urlPattern: /\.(js|css|woff2)$/,
    handler: "CacheFirst",
    options: {
      cacheName: "static-assets",
      expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30 hari
    },
  },
  // Images: stale-while-revalidate
  {
    urlPattern: /\.(png|jpg|webp|svg|ico)$/,
    handler: "StaleWhileRevalidate",
    options: { cacheName: "images", expiration: { maxEntries: 30 } },
  },
];

// PENTING: Jangan cache response yang mengandung cookie/auth data
// Jangan cache /api/auth/* endpoints
```

### 8.3 Offline Page

```
- Buat halaman /offline yang tampil saat tidak ada koneksi dan halaman belum ter-cache
- Tampilkan pesan yang user-friendly: "Tidak ada koneksi internet"
- Tampilkan daftar fitur yang masih bisa digunakan offline:
  - Tambah transaksi (akan sync nanti)
  - Lihat transaksi bulan ini (dari cache)
  - Lihat dashboard (dari cache)
- Tombol "Coba lagi" untuk trigger reload
```

### 8.4 Install Prompt

```typescript
// Tampilkan install prompt setelah user:
// 1. Menggunakan app minimal 3 kali (tracked via localStorage)
// 2. Menambahkan minimal 1 transaksi
// 3. Belum pernah dismiss prompt sebelumnya

// Implementasi:
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  // Simpan event, tampilkan custom banner
  // Bukan browser default prompt yang muncul tiba-tiba
});

// Custom install banner:
// "Instal MoneyTracker untuk pengalaman lebih baik — buka langsung dari homescreen!"
// Tombol: "Instal" + "Nanti saja"
// Posisi: bottom sheet, bukan popup tengah layar
```

### 8.5 Lighhouse Score Target

```
Performance    : ≥ 90
Accessibility  : ≥ 90
Best Practices : ≥ 90
SEO            : ≥ 80
PWA            : ≥ 90 (semua checklist hijau)

Wajib lulus semua PWA checklist Lighthouse sebelum launch
```

---

## 9. Frontend Standards

### 9.1 TypeScript Rules

```typescript
// tsconfig.json — strict mode wajib
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  }
}

// Aturan:
// - Tidak boleh ada 'any' yang eksplisit — gunakan 'unknown' dan narrow
// - Semua function harus punya return type eksplisit (kecuali obvious inference)
// - Interface untuk object shapes, type untuk union/primitives
// - Tidak boleh ada non-null assertion operator (!) tanpa komentar justifikasi
```

### 9.2 Component Structure

```typescript
// Struktur file component:
// components/features/TransactionForm/
// ├── TransactionForm.tsx       ← Component utama
// ├── TransactionForm.test.tsx  ← Unit test
// ├── useTransactionForm.ts     ← Logic hook (jika complex)
// └── index.ts                  ← Export barrel

// Template component:
import type { FC } from 'react'
import { z } from 'zod'

// 1. Types & schema
const transactionSchema = z.object({ ... })
type TransactionFormProps = { onSuccess: (id: string) => void }

// 2. Component
export const TransactionForm: FC<TransactionFormProps> = ({ onSuccess }) => {
  // 3. Hooks dulu (urutan penting untuk hooks rules)
  // 4. Derived state
  // 5. Handlers
  // 6. JSX
}
```

### 9.3 State Management Rules

```typescript
// Zustand store — satu store per domain
// stores/transactionStore.ts

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TransactionStore {
  // State
  pendingTransactions: Transaction[];

  // Actions (bukan setter langsung)
  addTransaction: (tx: NewTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

// Gunakan immer untuk nested state mutation
// Gunakan devtools di development

// React Query untuk server state
// Jangan duplikasi server state di Zustand
// Aturan: Zustand untuk UI state + offline queue, React Query untuk data dari server
```

### 9.4 Error Handling

```typescript
// Custom error class
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Global error boundary di layout root
// Semua async operation dalam try-catch
// Log error ke Sentry: Sentry.captureException(error)
// Jangan expose technical error message ke user
// User-facing error messages harus dalam Bahasa Indonesia
```

### 9.5 Accessibility

```
- Semua interactive element harus bisa diakses via keyboard
- aria-label pada icon-only buttons
- Focus management saat modal buka/tutup
- Color contrast ratio minimal 4.5:1 (AA standard)
- Tidak mengandalkan warna saja untuk menyampaikan informasi
- Gunakan semantic HTML (nav, main, aside, button, input) — bukan div untuk segalanya
- Screen reader testing minimal sekali sebelum launch
```

### 9.6 Mobile-first UX Rules

```
- Touch target minimum 44x44px (Apple HIG standard)
- Bottom navigation (bukan sidebar) untuk nav utama
- FAB (Floating Action Button) untuk aksi utama
- Sheet/drawer untuk form — bukan full-page navigation
- Swipe gestures untuk aksi cepat (delete, edit)
- Tidak ada hover state sebagai satu-satunya cara akses fitur
- Pastikan seluruh app bisa dioperasikan satu tangan
- Keyboard push up layout — form fields tidak tertutup keyboard
```

---

## 10. Backend Standards

### 10.1 Repository Pattern

```typescript
// Semua akses database melalui repository layer
// Tidak boleh ada Prisma client langsung di route handler

// repositories/transactionRepository.ts
export const transactionRepository = {
  findMany: async (userId: string, filters: TransactionFilters) => { ... },
  create: async (data: CreateTransactionData) => { ... },
  update: async (id: string, userId: string, data: UpdateTransactionData) => { ... },
  softDelete: async (id: string, userId: string) => { ... },
}

// Service layer untuk business logic
// Route handler hanya: parse request → call service → format response
```

### 10.2 User ID Enforcement

```typescript
// KRITIS: userId SELALU dari session/token server-side
// TIDAK PERNAH dari request body atau URL params

// ✅ BENAR:
fastify.post("/transactions", { preHandler: requireAuth }, async (request, reply) => {
  const userId = request.user.id; // Dari JWT middleware
  const result = await transactionService.create(userId, request.body);
  return reply.send({ success: true, data: result });
});

// ❌ SALAH — Jangan pernah:
fastify.post("/transactions", async (request) => {
  const { userId, ...data } = request.body; // JANGAN! Client bisa inject userId lain
});
```

### 10.3 Logging Standard

```typescript
// Gunakan Pino untuk structured logging
// Setiap log entry harus ada: requestId, userId (jika auth), timestamp, level

// Di Fastify: reqId otomatis ada via plugin
// Log format: JSON di production, pretty di development

// Apa yang HARUS dilog:
// - Semua auth events (login, logout, token refresh, failed attempts)
// - Semua write operations (create, update, delete)
// - Semua errors (dengan stack trace)
// - Slow queries (> 500ms)

// Apa yang JANGAN dilog:
// - Password, token, API keys
// - Data keuangan pengguna (nominal transaksi)
// - Personal data (nama, email — kecuali di audit log yang terlindungi)
```

### 10.4 Migration Rules

```
- Semua perubahan schema melalui Prisma Migration (bukan manual SQL)
- Setiap migration harus reversible (ada rollback plan)
- Tidak boleh DROP COLUMN atau RENAME COLUMN tanpa deprecation period
- Migration production harus dijalankan dalam maintenance window
- Setelah migration: wajib jalankan integration test sebelum deploy app
```

---

## 11. Testing Requirements

### 11.1 Coverage Target

```
Unit tests   : Minimum 70% coverage untuk business logic (services, utils)
Integration  : Semua API endpoint harus punya test
E2E          : Happy path semua user stories (US-001 sampai US-009)
```

### 11.2 Unit Test Rules

```typescript
// Vitest + React Testing Library
// Naming: describe('[ComponentName/functionName]') + it('should [behavior]')

// Test yang WAJIB ada:
// - Semua Zod schema validation (valid & invalid cases)
// - Service layer functions dengan mock repository
// - Currency formatting utils
// - Sync queue logic
// - Encryption/decryption utils

// Contoh:
describe("formatCurrency", () => {
  it("should format 50000 as Rp 50.000", () => {
    expect(formatCurrency(50000)).toBe("Rp 50.000");
  });
  it("should handle 0", () => {
    expect(formatCurrency(0)).toBe("Rp 0");
  });
});
```

### 11.3 E2E Test Scenarios (Playwright)

```typescript
// Wajib ada sebelum launch:

test('Guest mode: add transaction without account', async ({ page }) => { ... })
test('Google SSO login flow', async ({ page }) => { ... })
test('Add expense transaction in < 10 seconds', async ({ page }) => { ... })
test('Dashboard shows correct monthly summary', async ({ page }) => { ... })
test('Set budget and see progress bar', async ({ page }) => { ... })
test('Receive push notification when budget 80% reached', async ({ page }) => { ... })
test('App works offline: add transaction, sync when online', async ({ page }) => { ... })
test('Install prompt appears after 3 sessions', async ({ page }) => { ... })
```

---

## 12. Performance Budgets

### 12.1 Core Web Vitals Target

```
LCP (Largest Contentful Paint) : ≤ 2.5s (mobile, 4G)
FID (First Input Delay)         : ≤ 100ms
CLS (Cumulative Layout Shift)   : ≤ 0.1
FCP (First Contentful Paint)    : ≤ 1.8s
TTFB (Time to First Byte)       : ≤ 800ms
```

### 12.2 Bundle Size Budget

```
Initial JS bundle    : ≤ 150KB (gzipped)
CSS                  : ≤ 30KB (gzipped)
Total page weight    : ≤ 500KB (first load)
```

### 12.3 API Response Time (p95)

```
GET /transactions   : ≤ 300ms
POST /transactions  : ≤ 500ms
GET /reports/*      : ≤ 2000ms
GET /budgets        : ≤ 300ms
POST /auth/*        : ≤ 500ms
```

### 12.4 Optimizations Wajib

```
Next.js:
- Image optimization via next/image
- Font optimization via next/font (subsets, display: swap)
- Dynamic imports untuk komponen besar (charts, modals)
- Route-based code splitting (otomatis oleh Next.js App Router)

Database:
- Semua query yang ada di spec harus punya index yang tepat (lihat schema)
- Gunakan SELECT spesifik field — jangan SELECT *
- Pagination wajib — jangan load semua data sekaligus
- Query aggregation (report) di-cache 5 menit di Redis

API:
- Compression (gzip/brotli) via Fastify plugin
- ETags untuk response caching
- HTTP keep-alive enabled
```

---

## 13. Deployment & CI/CD

### 13.1 Environment Variables

```bash
# Frontend (Vercel) — prefix NEXT_PUBLIC_ hanya untuk non-secret
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_SENTRY_DSN=...
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...

# Backend (Railway) — SEMUA secret, tidak ada prefix PUBLIC
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://... # Supabase direct connection
REDIS_URL=redis://...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:admin@yourdomain.com
ENCRYPTION_KEY=...          # 32-byte hex untuk AES-256 (generate via openssl rand -hex 32)
ENCRYPTION_KEY_VERSION=1    # Untuk key rotation
JWT_SECRET=...              # Untuk CSRF token signing
SENTRY_DSN=...
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
NODE_ENV=production
```

### 13.2 GitHub Actions Pipeline

```yaml
# .github/workflows/ci.yml

name: CI

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup pnpm + Node 20
      - pnpm install --frozen-lockfile
      - pnpm type-check # tsc --noEmit
      - pnpm lint # ESLint
      - pnpm test # Vitest unit tests
      - pnpm audit # Security audit — fail on high/critical
      - pnpm build # Build check

  e2e:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - playwright install
      - pnpm test:e2e

  lighthouse:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - Deploy preview
      - Jalankan Lighthouse CI
      - Fail jika PWA score < 90

  deploy-staging:
    needs: [quality, e2e]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - Deploy ke Vercel preview + Railway staging

  deploy-production:
    needs: [quality, e2e, lighthouse]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - Run DB migrations (prisma migrate deploy)
      - Deploy ke Vercel production + Railway production
      - Smoke test post-deploy
      - Notify Slack #deployments
```

### 13.3 Branch Strategy

```
main        → production
develop     → staging (auto-deploy)
feature/*   → PR ke develop
hotfix/*    → PR ke main + develop

PR rules:
- Minimal 1 reviewer approval
- Semua CI checks harus pass
- No merge jika ada pnpm audit high/critical
- Squash merge ke develop, merge commit ke main
```

---

## 14. Definition of Done

Sebuah fitur dianggap DONE jika memenuhi SEMUA kriteria berikut:

```
Code Quality:
☐ TypeScript strict mode — tidak ada error, tidak ada 'any' eksplisit
☐ ESLint clean — tidak ada warning yang diabaikan
☐ Semua acceptance criteria di user story terpenuhi
☐ Code di-review oleh minimal 1 engineer lain

Testing:
☐ Unit tests ditulis dan passing (coverage ≥ 70% untuk logic baru)
☐ E2E test untuk happy path (jika applicable)
☐ Manual testing di Chrome Android + Safari iOS 16+

Security:
☐ Input validation dengan Zod (FE + BE)
☐ userId selalu dari session — tidak dari request body
☐ Tidak ada secret/credential di codebase
☐ pnpm audit tidak ada high/critical

Performance:
☐ Lighthouse PWA score ≥ 90 (tidak boleh turun dari baseline)
☐ Tidak ada regresi di Core Web Vitals
☐ API response time sesuai budget (diuji dengan k6 jika ada endpoint baru)

Documentation:
☐ API endpoint baru didokumentasikan (update file API spec atau Swagger)
☐ Environment variable baru didokumentasikan di README + .env.example
☐ Database migration ter-dokumentasi

Deployment:
☐ Deploy ke staging dan berfungsi normal
☐ Tidak ada error baru di Sentry setelah deploy staging
```

---

## 15. Out of Scope (MVP)

Fitur-fitur berikut TIDAK akan diimplementasikan di MVP. Engineer dilarang menambahkan tanpa approval Product Owner:

| Fitur                           | Alasan                              | ETA                 |
| ------------------------------- | ----------------------------------- | ------------------- |
| Auto-sync bank / e-wallet       | Butuh OJK SNAP API, regulasi        | Phase 2 (12+ bulan) |
| AI chat input (seperti FinGPT)  | Infrastruktur ML mahal              | Phase 2             |
| Multi-currency                  | Out of target segment               | Phase 3             |
| Fitur sosial / sharing          | Privacy concern                     | Phase 3             |
| Export PDF dengan grafik        | Fitur premium                       | Phase 2             |
| Investasi / reksa dana          | Di luar scope pencatatan            | Tidak direncanakan  |
| Integrasi payment gateway       | Berpotensi jadi PJP (butuh izin BI) | Phase 3             |
| iOS App Store submission        | Butuh native wrapper                | Phase 2             |
| Apple SSO                       | Phase 2 priority                    | Phase 2             |
| Dark mode                       | Nice-to-have                        | Phase 2             |
| Multi-bahasa (selain Indonesia) | Phase 3                             | Phase 3             |
| Custom kategori                 | Bisa di v1.1                        | v1.1                |
| Recurring transaction           | v1.1                                | v1.1                |

---

## Appendix A: Shared Zod Schemas (packages/schemas)

```typescript
// packages/schemas/src/transaction.ts

import { z } from "zod";

export const createTransactionSchema = z.object({
  categoryId: z.string().cuid(),
  amountEncrypted: z.string().startsWith("enc:v1:"),
  amountCents: z.number().int().positive().max(999_999_999),
  type: z.enum(["INCOME", "EXPENSE"]),
  note: z.string().max(200).optional(),
  transactionDate: z.string().datetime(),
  clientId: z.string().uuid(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const transactionFiltersSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categoryId: z.string().cuid().optional(),
  type: z.enum(["INCOME", "EXPENSE", "ALL"]).default("ALL"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
```

---

## Appendix B: IndexedDB Schema (Dexie)

```typescript
// lib/db/schema.ts

import Dexie, { Table } from "dexie";

export interface LocalTransaction {
  id: string; // clientId (UUID) — primary key
  serverId?: string; // ID dari server setelah sync
  categoryId: string;
  amountEncrypted: string;
  amountCents: number;
  type: "INCOME" | "EXPENSE";
  note?: string;
  transactionDate: string; // ISO string
  syncStatus: "pending" | "synced" | "failed";
  syncedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // Untuk soft delete yang belum sync
}

export interface LocalBudget {
  id: string;
  serverId?: string;
  categoryId: string;
  amountCents: number;
  periodType: "MONTHLY" | "WEEKLY";
  periodYear: number;
  periodMonth?: number;
  periodWeek?: number;
  notifyAt: number;
  syncStatus: "pending" | "synced" | "failed";
}

export class AppDatabase extends Dexie {
  transactions!: Table<LocalTransaction>;
  budgets!: Table<LocalBudget>;

  constructor() {
    super("MoneyTrackerDB");
    this.version(1).stores({
      transactions: "id, categoryId, transactionDate, syncStatus, deletedAt",
      budgets: "id, categoryId, periodYear, periodMonth, syncStatus",
    });
  }
}

export const db = new AppDatabase();
```

---

_Dokumen ini adalah living document. Setiap perubahan harus melalui PR ke branch `docs/prd` dengan review dari Product Owner dan Tech Lead._

_Pertanyaan teknis: buat issue di GitHub dengan label `question` + `prd`_
