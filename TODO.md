# Bajes — Development TODO

**Project:** Bajes (Money Tracker MVP PWA)  
**Last Updated:** 2026-05-02  
**Status Legend:** ⬜ Belum mulai | 🔄 In Progress | ✅ Done | ❌ Blocked | ⏭️ Skipped

---

## Sprint 1 — Foundation + Security + PWA Shell (1-2 minggu)

### PRD-01: Foundation & Infrastructure

#### 1.1 Monorepo Setup

- ✅ Init Turborepo + pnpm workspace (`pnpm-workspace.yaml`, `turbo.json`) (2026-04-30)
- ✅ Setup `apps/web` — Next.js 14 (App Router) project (2026-04-30)
- ✅ Setup `apps/api` — Fastify 4 project (2026-04-30)
- ✅ Setup `packages/types` — shared TypeScript types (2026-04-30)
- ✅ Setup `packages/schemas` — shared Zod validation schemas (2026-04-30)
- ✅ Setup `packages/config` — shared ESLint, Prettier, TS configs (2026-04-30)
- ✅ Verify `pnpm install` + `pnpm build` berjalan tanpa error (2026-04-30)
- ✅ Verify `pnpm type-check` pass di semua packages dan apps (2026-04-30)

#### 1.2 TypeScript & Tooling

- ✅ TypeScript strict mode (`strict: true`, `noUncheckedIndexedAccess: true`) (2026-04-30)
- ✅ ESLint config (strict TypeScript rules, no explicit `any`) (2026-04-30)
- ✅ Prettier config (2026-04-30)
- ✅ Husky + lint-staged (pre-commit hooks) (2026-04-30)

#### 1.3 Database

- ⬜ Setup Supabase project (PostgreSQL 15)
- ✅ Prisma schema — Model `User` (2026-05-01)
- ✅ Prisma schema — Model `Session` (2026-05-01)
- ✅ Prisma schema — Model `Category` + enum `CategoryType` (2026-05-01)
- ✅ Prisma schema — Model `Transaction` + enum `TransactionType` (2026-05-01)
- ✅ Prisma schema — Model `Budget` + enum `PeriodType` (2026-05-01)
- ✅ Prisma schema — Model `PushSubscription` (2026-05-01)
- ✅ Prisma schema — Model `AuditLog` (2026-05-01)
- ✅ Run initial migration ke Supabase staging (2026-05-01)
- ✅ Seed data — 5 default expense categories + 2 income categories (2026-05-01)
- ✅ Enable Row Level Security (RLS) di semua tabel (2026-05-01)
- ✅ Verify seed data berhasil dijalankan (2026-05-01)

#### 1.4 Shared Packages

- ✅ `packages/types` — DTO types: `UserDTO`, `TransactionDTO`, `BudgetDTO`, `CategoryDTO` (2026-04-30)
- ✅ `packages/types` — `PaginationMeta`, `ApiResponse<T>`, `ApiError` (2026-04-30)
- ✅ `packages/types` — Enum types: `CategoryType`, `TransactionType`, `PeriodType` (2026-04-30)
- ✅ `packages/schemas` — `createTransactionSchema`, `updateTransactionSchema` (2026-04-30)
- ✅ `packages/schemas` — `transactionFiltersSchema` (2026-04-30)
- ✅ `packages/schemas` — `createBudgetSchema`, `updateBudgetSchema` (2026-04-30)
- ✅ `packages/schemas` — `authSessionSchema` (2026-04-30)
- ✅ Verify shared packages bisa di-import dari `apps/web` dan `apps/api` (2026-04-30)

#### 1.5 Backend Architecture

- ✅ Fastify server entry point (`server.ts`) (2026-04-30)
- ✅ Repository pattern setup (route -> service -> repository -> Prisma) (2026-05-01)
- ✅ API response format standar (success/error/paginated) (2026-04-30)
- ✅ Pino structured logging setup (2026-04-30)
- ✅ Request ID middleware (2026-04-30)
- ✅ Error handler global (format standar, jangan expose detail) (2026-05-01)

#### 1.6 Frontend Base

- ✅ Next.js App Router folder structure (`(auth)/`, `(app)/`) (2026-05-01)
- ✅ Tailwind CSS setup (2026-04-30)
- ✅ Axios instance + base config (`credentials: 'include'`) (2026-05-01)
- ✅ IndexedDB schema (Dexie.js) — `LocalTransaction`, `LocalBudget` (2026-05-01)
- ✅ Zustand base store setup (2026-05-01)
- ✅ React Query provider setup (2026-05-01)

#### 1.7 CI/CD & Deployment

- ✅ GitHub Actions — quality job (type-check, lint, test, audit, build) (2026-05-02)
- ✅ GitHub Actions — e2e job (Playwright) (2026-05-02)
- ✅ GitHub Actions — Lighthouse CI job (2026-05-02)
- ✅ GitHub Actions — deploy staging (develop branch → VPS via SSH+rsync) (2026-05-02)
- ✅ GitHub Actions — deploy production (main branch → VPS via SSH+rsync) (2026-05-02)
- ⬜ Vercel project setup (apps/web) — connect GitHub repo
- ⏭️ Railway project setup (apps/api) — skipped, using VPS with PM2+Nginx
- ⬜ Cloudflare DNS + SSL config (after domain purchase)
- ✅ Branch strategy: `main` -> production, `develop` -> staging (2026-05-02)
- ⬜ PR rules: 1 reviewer, CI pass, no high/critical audit (configure in GitHub)
- ✅ `.env.example` untuk semua environment variables (2026-04-30)
- ✅ PM2 ecosystem config (`ecosystem.config.cjs`) (2026-05-02)
- ✅ Nginx reverse proxy config template (2026-05-02)
- ✅ VPS setup script (`deploy/vps-setup.sh`) (2026-05-02)
- ✅ Dependabot config (`.github/dependabot.yml`) (2026-05-02)

#### 1.8 Monitoring

- ⬜ Sentry setup (error tracking + performance)
- ⬜ PostHog setup (analytics, free tier)

---

### PRD-07: Security Layer

#### 7.1 Transport Security

- ⬜ HTTPS di semua environment (termasuk staging)
- ⬜ HSTS header (`max-age=31536000; includeSubDomains; preload`)
- ⬜ Cloudflare SSL mode: Full (Strict)
- ⬜ Verify tidak ada mixed content

#### 7.2 Client-Side Encryption

- ⬜ `lib/crypto/encrypt.ts` — `encrypt(plaintext, userUid)` function
- ⬜ `lib/crypto/encrypt.ts` — `decrypt(ciphertext, userUid)` function
- ⬜ `lib/crypto/encrypt.ts` — `deriveKey(userUid, deviceFingerprint)` function
- ⬜ AES-GCM 256-bit, PBKDF2 100K iterations, 16-byte salt, 12-byte IV
- ⬜ Format ciphertext: `enc:v1:<iv_hex>:<ciphertext_base64>`
- ⬜ IV baru untuk setiap enkripsi (jangan reuse)
- ⬜ Unit test: encrypt -> decrypt roundtrip

#### 7.3 Server-Side Encryption

- ⬜ AES-256-GCM via `@noble/ciphers`
- ⬜ Format: `senc:v{version}:<iv_hex>:<ciphertext_base64>`
- ⬜ Encryption key dari env var `ENCRYPTION_KEY`
- ⬜ Key rotation support (versi key disimpan bersama ciphertext)
- ⬜ PostgreSQL connection via SSL

#### 7.4 IndexedDB Encryption

- ⬜ Data sensitif dienkripsi sebelum simpan ke IndexedDB
- ⬜ Kunci enkripsi lokal di sessionStorage (clear saat browser tutup)
- ⬜ Guest mode: data TIDAK dienkripsi

#### 7.5 HTTP Security Headers

- ⬜ Frontend (`next.config.js`): X-Frame-Options DENY
- ⬜ Frontend: X-Content-Type-Options nosniff
- ⬜ Frontend: Referrer-Policy strict-origin-when-cross-origin
- ⬜ Frontend: Permissions-Policy (camera, mic, geo = disabled)
- ⬜ Frontend: CSP nonce-based (`script-src 'self' 'nonce-{NONCE}'`)
- ⬜ Backend (Fastify): CORS config dari `CORS_ORIGINS` env
- ⬜ Backend: `Access-Control-Allow-Credentials: true`

#### 7.6 Input Validation

- ⬜ Fastify `validate.ts` middleware (Zod preHandler)
- ⬜ Dual validation: frontend (UX) + backend (security)
- ⬜ Amount range enforced: `0 < x <= 999,999,999`
- ⬜ Date range enforced: tidak > 1 tahun ke depan / 10 tahun ke belakang
- ⬜ String trim + maxLength enforced
- ⬜ DOMPurify untuk HTML content rendering

#### 7.7 Rate Limiting

- ⬜ Rate limiter plugin (Redis/Upstash)
- ⬜ `/api/auth/*`: 10 req / 15 min
- ⬜ `/api/transactions`: 100 req / 1 min
- ⬜ `/api/budgets`: 50 req / 1 min
- ⬜ `/api/reports`: 10 req / 1 min
- ⬜ `/api/push/*`: 5 req / 1 min
- ⬜ Global fallback: 200 req / 1 min
- ⬜ 429 response dengan `Retry-After` header

#### 7.8 Audit Logging

- ⬜ AuditLog service — log auth events (login, logout, refresh, revoke)
- ⬜ AuditLog service — log write operations (transaction/budget CRUD)
- ⬜ Verify: TIDAK ada data sensitif di log (password, token, nominal)
- ⬜ Retention policy: minimal 1 tahun

#### 7.9 User ID Enforcement

- ⬜ userId SELALU dari `request.user.id` (JWT middleware)
- ⬜ Code review checklist: tidak ada userId dari request body
- ⬜ Verify di semua endpoint

#### 7.10 Dependency Security

- ⬜ `pnpm audit` di CI pipeline (fail on high/critical)
- ⬜ Dependabot config (`.github/dependabot.yml`)
- ⬜ `pnpm-lock.yaml` committed

---

### PRD-06: PWA & Offline-First Engine

#### 6.1 Web App Manifest

- ⬜ `public/manifest.webmanifest` — semua field sesuai spec
- ⬜ PWA icons: 72, 96, 128, 144, 152, 192, 384, 512 (PNG)
- ⬜ 192x192 dan 512x512 dengan `maskable` purpose
- ⬜ Shortcut icon: 96x96 ("Tambah Pengeluaran")
- ⬜ Screenshot untuk install prompt
- ⬜ Share target config

#### 6.2 Service Worker (Workbox)

- ⬜ `next-pwa` + Workbox 7 setup di `next.config.js`
- ⬜ Caching: API calls — NetworkFirst (1 jam, max 100 entries)
- ⬜ Caching: Static assets (JS/CSS/fonts) — CacheFirst (30 hari, max 50)
- ⬜ Caching: Images — StaleWhileRevalidate (max 30)
- ⬜ Caching: HTML pages — NetworkFirst (1 jam, max 20)
- ⬜ Precache: app shell (layout, bottom nav, offline page)
- ⬜ JANGAN cache `/api/auth/*` endpoints
- ⬜ Verify service worker terdaftar dan berfungsi

#### 6.3 Offline Page

- ⬜ `/offline` page — pesan user-friendly
- ⬜ Content: fitur yang masih bisa digunakan offline
- ⬜ Tombol "Coba lagi" (`window.location.reload()`)
- ⬜ Precached oleh service worker

#### 6.4 Install Prompt

- ⬜ Intercept `beforeinstallprompt` event
- ⬜ Custom bottom sheet banner (bukan browser default)
- ⬜ Trigger conditions: 3 visits + 1 transaksi + belum dismiss
- ⬜ "Nanti saja" = permanent dismiss
- ⬜ Toast "Berhasil diinstal!" setelah install

#### 6.5 App Shortcuts

- ⬜ Long press icon -> "Tambah Pengeluaran" shortcut
- ⬜ URL: `/?action=add-expense`

#### 6.6 Share Target

- ⬜ `/share-target` page — parse `?amount=` query param
- ⬜ Redirect ke dashboard dengan modal transaksi + amount prefilled

#### 6.7 Background Sync

- ⬜ Register `sync-transactions` event di service worker
- ⬜ Fallback: sync saat app dibuka + periodic 30 detik + online event
- ⬜ Max 50 operations per batch, retry max 3x (exponential backoff)

#### 6.8 Online/Offline Status

- ⬜ `ConnectionStatus.tsx` — banner saat offline (kuning/amber)
- ⬜ Toast saat kembali online ("Kembali online — menyinkronkan data...")
- ⬜ Auto-dismiss setelah 3 detik

#### 6.9 Lighthouse

- ⬜ Performance >= 90
- ⬜ Accessibility >= 90
- ⬜ Best Practices >= 90
- ⬜ SEO >= 80
- ⬜ PWA >= 90 (semua checklist hijau)
- ⬜ Standalone display (tidak ada browser chrome)
- ⬜ Splash screen saat buka dari homescreen

---

## Sprint 2 — Authentication (1 minggu)

### PRD-02: Authentication & Session Management

#### 2.1 Supabase Auth (Email + Google SSO)

- ✅ Supabase project setup + config (2026-05-02)
- ✅ Supabase Auth JS SDK integration (frontend) (2026-05-02)
- ✅ Supabase Admin SDK setup (backend — service role key) (2026-05-02)
- ✅ Login page UI — Email/Password + Google SSO + Guest option (2026-05-02)
- ✅ Auth layout (no bottom nav) (2026-05-01)

#### 2.2 Server-Side Session

- ⏭️ `POST /v1/auth/session` — skipped (Supabase handles token exchange)
- ⏭️ Set HttpOnly cookies — skipped (using Supabase JWT Bearer tokens)
- ⏭️ `POST /v1/auth/refresh` — skipped (Supabase client auto-refreshes)
- ✅ `POST /v1/auth/logout` — revoke session + clear cookies (2026-05-02)
- ✅ `GET /v1/auth/me` — get current user (2026-05-02)
- ⬜ `DELETE /v1/auth/sessions/:sessionId` — revoke specific session

#### 2.3 CSRF Protection

- ⬜ Double-submit cookie pattern implementation
- ⬜ `csrfProtection.ts` middleware (POST, PUT, DELETE only)
- ⬜ Verify: header `X-CSRF-Token` === cookie `csrf_token`

#### 2.4 Auth Middleware

- ✅ `requireAuth.ts` — verify Supabase JWT Bearer token, attach user ke request (2026-05-02)
- ✅ Return 401 `AUTH_001` jika expired/invalid (2026-05-02)
- ⏭️ Refresh token hash di database — skipped (Supabase manages refresh tokens)

#### 2.5 Frontend Auth

- ✅ Auth store (Zustand): user/session state + AuthProvider component (2026-05-02)
- ✅ Axios interceptor: attach Bearer token, auto-refresh on 401, retry request (2026-05-02)
- ✅ Route protection middleware (`middleware.ts`): redirect ke `/login` jika no auth cookie (2026-05-02)
- ✅ Guest mode flag di localStorage (2026-05-02)

#### 2.6 Guest Mode

- ✅ "Coba tanpa akun" button di landing (2026-05-02)
- ⬜ Data di IndexedDB only (tidak kirim ke server)
- ⬜ Max 10 transaksi — prompt daftar setelahnya
- ⬜ Banner "Buat akun untuk menyimpan data" setelah 3 transaksi
- ⬜ Clear data guest jika tidak aktif 30 hari

#### 2.7 Guest -> Akun Migration

- ⬜ `migrateGuestData()` — batch POST `/v1/transactions/batch` setelah login pertama
- ⬜ Verify data lokal ter-migrate dengan benar

#### 2.8 Onboarding Tutorial

- ⬜ `/onboarding` page — 3 langkah (tambah transaksi, set budget, lihat dashboard)
- ⬜ Dismissible (bisa di-skip)
- ⬜ Tampil hanya saat login pertama
- ⬜ Total waktu <= 60 detik
- ⬜ Setelah selesai/skip -> redirect ke dashboard

#### 2.9 Rate Limiting Auth

- ⬜ `/api/auth/*`: 10 req / 15 min (key: IP + User ID)

---

## Sprint 3 — Transaction Management (2 minggu)

### PRD-03: Transaction CRUD + Offline Sync

#### 3.1 API Endpoints

- ✅ `GET /v1/transactions` — list dengan filter + pagination (2026-05-02)
- ✅ `POST /v1/transactions` — create (idempotent via clientId) (2026-05-02)
- ✅ `PUT /v1/transactions/:id` — update (verify ownership) (2026-05-02)
- ✅ `DELETE /v1/transactions/:id` — soft delete (2026-05-02)
- ✅ `POST /v1/transactions/batch` — batch sync (max 50 ops) (2026-05-02)
- ✅ `GET /v1/categories` — list default + user categories (2026-05-01)

#### 3.2 Backend

- ✅ `transactionRepository.ts` — findMany, findById, create, update, softDelete, findByClientId, batchCreate (2026-05-02)
- ✅ `transactionService.ts` — list, create, update, delete, batchSync (2026-05-02)
- ✅ Idempotency: duplicate clientId return existing record (bukan error) (2026-05-02)
- ✅ Ownership validation: userId dari session harus match (2026-05-02)

#### 3.3 Frontend — Transaction Form

- ⬜ FAB button "+" di bottom navigation (selalu visible)
- ⬜ Bottom sheet modal (bukan full page), muncul < 200ms
- ⬜ Fields: nominal (required), kategori (required), tanggal (default hari ini), catatan (opsional)
- ⬜ Keyboard numerik otomatis saat modal terbuka
- ⬜ `AmountInput.tsx` — format Rupiah otomatis (50000 -> "Rp 50.000")
- ⬜ `CategoryGrid.tsx` — grid icon selector (2 baris x 4 kolom, scrollable)
- ⬜ Date picker: calendar popup, range validation
- ⬜ Income/Expense toggle di atas modal
- ⬜ Tombol simpan posisi mudah dijangkau ibu jari
- ⬜ Waktu input -> simpan: <= 10 detik

#### 3.4 Frontend — Transaction List

- ⬜ `TransactionList.tsx` — grouped per hari (section header tanggal)
- ⬜ `TransactionItem.tsx` — ikon kategori, nama, catatan, nominal, waktu
- ⬜ Expense merah, income hijau
- ⬜ `TransactionFilters.tsx` — filter bulan, kategori, tipe
- ⬜ Infinite scroll (bukan pagination button)
- ⬜ Empty state informatif
- ⬜ Swipe kiri -> tombol delete + confirm dialog

#### 3.5 Frontend — Edit Transaction

- ⬜ Tap transaksi -> modal edit (prefilled)
- ⬜ `TransactionDetail.tsx` — edit modal

#### 3.6 Offline-First & Sync

- ⬜ Zustand store: `addTransaction`, `updateTransaction`, `deleteTransaction`, `syncPendingTransactions`
- ✅ React Query hooks: `useTransactions`, `useCreateTransaction`, `useUpdateTransaction`, `useDeleteTransaction` (2026-05-02)
- ⬜ Data SELALU simpan ke IndexedDB dulu -> UI update optimistic
- ✅ Sync queue: ambil `syncStatus = "pending"` dari IndexedDB (2026-05-02)
- ✅ Batch sync via `POST /v1/transactions/batch` (max 50) (2026-05-02)
- ✅ Update `syncStatus` ke "synced" / "failed" (2026-05-02)
- ✅ Background Sync API + fallback (app open + 30s periodic + online event) (2026-05-02)
- ⬜ Sync status indicator di UI (pending/synced)
- ⬜ Conflict resolution: last-write-wins berdasarkan `updatedAt`

#### 3.7 Currency Formatting

- ⬜ `formatCurrency(amountCents)` — "Rp 50.000"
- ⬜ `parseCurrencyInput(input)` — strip non-numeric, parse to integer

#### 3.8 Validation (Shared Zod)

- ⬜ `createTransactionSchema` — frontend + backend
- ⬜ `transactionFiltersSchema` — frontend + backend
- ⬜ Backend: transactionDate range validation
- ⬜ Backend: categoryId existence + ownership check

#### 3.9 Performance

- ⬜ Modal open time < 200ms
- ⬜ `GET /v1/transactions` p95 <= 300ms
- ⬜ `POST /v1/transactions` p95 <= 500ms
- ⬜ IndexedDB write < 50ms

---

## Sprint 4 — Budget + Dashboard (2 minggu)

### PRD-04: Budget Management & Push Notifications

#### 4.1 API Endpoints

- ⬜ `GET /v1/budgets` — list bulan tertentu + spent amount
- ⬜ `POST /v1/budgets` — create (unique: userId + categoryId + period)
- ⬜ `PUT /v1/budgets/:id` — update amount / notifyAt
- ⬜ `DELETE /v1/budgets/:id` — hard delete
- ⬜ `POST /v1/push/subscribe` — subscribe push notification
- ⬜ `DELETE /v1/push/subscribe/:subscriptionId` — unsubscribe

#### 4.2 Backend

- ⬜ `budgetService.ts` — listWithSpent, create, update, delete, checkAndNotify
- ⬜ `pushService.ts` — subscribe, unsubscribe, sendNotification, cleanupExpired
- ⬜ Budget spent calculation: SUM expense transactions per category per month
- ⬜ Notification trigger: setelah EXPENSE transaction, cek threshold
- ⬜ `web-push` library + VAPID keys setup

#### 4.3 Frontend — Budget Page

- ⬜ Budget list: semua kategori expense + progress bar + persentase
- ⬜ `BudgetProgressBar.tsx` — animated, hijau (<60%), kuning (60-80%), merah (>80%)
- ⬜ "Rp X tersisa" / "Rp X over budget" (merah, bold)
- ⬜ Budget 0 = tidak ada limit, progress bar hidden
- ⬜ Tap kategori -> bottom sheet edit budget
- ⬜ `BudgetForm.tsx` — numeric input edit amount
- ⬜ Month navigator (bisa lihat history budget)

#### 4.4 Push Notifications

- ⬜ Notification content: "[Kategori]: Budget hampir habis — Rp X tersisa dari Rp Y"
- ⬜ Hanya 1 notifikasi per budget per periode (set `notifiedAt`)
- ⬜ Tap notifikasi -> buka halaman budget
- ⬜ Push permission flow: minta setelah 3 hari aktif (bukan hari pertama)
- ⬜ `PushBanner.tsx` — in-app banner "Aktifkan notifikasi"
- ⬜ "Nanti" -> tanya lagi setelah 7 hari
- ⬜ Cleanup expired subscriptions

#### 4.5 React Query Hooks

- ⬜ `useBudgets(year, month)`, `useCreateBudget()`, `useUpdateBudget()`, `useDeleteBudget()`

---

### PRD-05: Dashboard & Monthly Reports

#### 5.1 API Endpoints

- ⬜ `GET /v1/reports/summary` — ringkasan bulanan (income, expense, top categories, daily totals)
- ⬜ `GET /v1/reports/export/csv` — gated, return 402 "Fitur premium — segera hadir"

#### 5.2 Backend

- ⬜ `reportService.ts` — getMonthlySummary, getMonthComparison
- ⬜ Aggregation queries (SUM by type, by category, by date)
- ⬜ Redis caching 5 menit (key: `report:${userId}:${year}:${month}`)
- ⬜ Cache invalidation saat transaksi CRUD

#### 5.3 Dashboard Page

- ⬜ `HeroCard.tsx` — "Sisa Bulan Ini" + indikator warna (hijau >30%, kuning 10-30%, merah <10%)
- ⬜ `SummaryCard.tsx` — total income (hijau) vs expense (merah), side-by-side
- ⬜ `ExpenseDonutChart.tsx` — Recharts donut, top 5 kategori + "Lainnya"
- ⬜ `RecentTransactions.tsx` — 5 transaksi terakhir + "Lihat semua"
- ⬜ `MonthNavigator.tsx` — < April 2026 > header
- ⬜ Dashboard load < 1.5 detik dari cache
- ⬜ Pull-to-refresh untuk force sync
- ⬜ Offline-first: load dari IndexedDB dulu, sync di background

#### 5.4 Report Page

- ⬜ `ReportSummary.tsx` — total income/expense/net balance
- ⬜ `TopCategories.tsx` — top 3 kategori + horizontal bar chart
- ⬜ `DailyExpenseChart.tsx` — Recharts bar chart harian (1-31)
- ⬜ `MonthComparison.tsx` — "Rp X (+Y% dari bulan lalu)"
- ⬜ `ExportButton.tsx` — "Export CSV" -> message "Fitur premium — segera hadir"
- ⬜ Navigasi bulan (tidak bisa lihat bulan depan)
- ⬜ Laporan ter-generate < 2 detik

#### 5.5 Charts

- ⬜ Recharts dynamic import (code splitting, `ssr: false`)
- ⬜ `ChartSkeleton` loading component
- ⬜ Chart render time < 500ms

#### 5.6 React Query Hooks

- ⬜ `useReportSummary(year, month)` — staleTime 5 menit
- ⬜ Invalidate saat transaksi baru
- ⬜ Prefetch bulan sebelumnya saat navigasi

---

## Cross-Cutting (Ongoing)

### Testing

- ⬜ Unit test setup (Vitest)
- ⬜ Unit test coverage >= 70% untuk business logic
- ⬜ E2E test setup (Playwright)
- ⬜ E2E test: happy path setiap user story
- ⬜ Manual test: Chrome Android
- ⬜ Manual test: Safari iOS 16+

### Performance Budget

- ⬜ LCP <= 2.5s
- ⬜ FID <= 100ms
- ⬜ CLS <= 0.1
- ⬜ Initial JS bundle <= 150KB gzipped

### UI Components (Shared)

- ⬜ `components/ui/Button.tsx`
- ⬜ `components/ui/Input.tsx`
- ⬜ `components/ui/Modal.tsx` (bottom sheet)
- ⬜ `components/ui/Toast.tsx`
- ⬜ `components/layouts/AppShell.tsx`
- ⬜ `components/layouts/BottomNav.tsx`

---

## Out of Scope (MVP) — Backlog

| Fitur                        | Target  |
| ---------------------------- | ------- |
| ⬜ Custom kategori           | v1.1    |
| ⬜ Recurring transaction     | v1.1    |
| ⬜ Dark mode                 | Phase 2 |
| ⬜ Apple SSO                 | Phase 2 |
| ⬜ Export PDF dengan grafik  | Phase 2 |
| ⬜ AI chat input             | Phase 2 |
| ⬜ Auto-sync bank / e-wallet | Phase 2 |
| ⬜ iOS App Store submission  | Phase 2 |
| ⬜ Multi-bahasa              | Phase 3 |
| ⬜ Multi-currency            | Phase 3 |
| ⬜ Fitur sosial / sharing    | Phase 3 |

---

## Cara Update File Ini

1. Ganti ⬜ menjadi 🔄 saat mulai kerjakan
2. Ganti 🔄 menjadi ✅ saat selesai
3. Ganti menjadi ❌ jika blocked (tambahkan alasan)
4. Ganti menjadi ⏭️ jika di-skip (tambahkan alasan)
5. Tambahkan tanggal di samping item jika perlu tracking:
   ```
   - ✅ Setup Turborepo (2026-04-20)
   ```
6. Commit perubahan TODO.md di setiap akhir sesi kerja

---

_File ini adalah living document. Update seiring development progress._
