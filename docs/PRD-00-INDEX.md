# Bajes — PRD Index (Master Plan)

**App:** Bajes (Money Tracker MVP)  
**Version:** 1.0.0  
**Status:** Ready for Development  
**Last Updated:** April 2026

---

## Tentang Dokumen Ini

Dokumen `PROJECT.md` telah di-refactor menjadi **7 PRD spesifik** per service/functionality. Setiap PRD bersifat self-contained dan bisa di-assign ke tim/engineer yang berbeda secara paralel.

---

## Daftar PRD

| PRD                                     | Nama                        | Deskripsi                                                                            | Prioritas                  | Dependencies           |
| --------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------ | -------------------------- | ---------------------- |
| [PRD-01](./PRD-01-FOUNDATION.md)        | Foundation & Infrastructure | Monorepo setup, tech stack, database schema, shared packages, CI/CD pipeline         | P0 — Harus selesai pertama | Tidak ada              |
| [PRD-02](./PRD-02-AUTH.md)              | Authentication & Session    | Google SSO, Firebase Auth, server session, CSRF, guest mode, onboarding              | P0                         | PRD-01                 |
| [PRD-03](./PRD-03-TRANSACTIONS.md)      | Transaction Management      | CRUD transaksi, offline queue, batch sync, riwayat, format currency                  | P0                         | PRD-01, PRD-02         |
| [PRD-04](./PRD-04-BUDGET.md)            | Budget & Notifications      | Budget per kategori, progress tracking, push notification, alert threshold           | P1                         | PRD-01, PRD-02, PRD-03 |
| [PRD-05](./PRD-05-DASHBOARD-REPORTS.md) | Dashboard & Reporting       | Dashboard utama, laporan bulanan, chart, summary, export (gated)                     | P1                         | PRD-01, PRD-02, PRD-03 |
| [PRD-06](./PRD-06-PWA.md)               | PWA & Offline-First         | Service worker, manifest, install prompt, offline page, caching strategy             | P0                         | PRD-01                 |
| [PRD-07](./PRD-07-SECURITY.md)          | Security Layer              | Encryption (client+server), HTTP headers, input validation, rate limiting, audit log | P0                         | PRD-01                 |

---

## Dependency Graph

```
PRD-01 (Foundation)
  ├── PRD-07 (Security)     ← bisa paralel dengan PRD-02
  ├── PRD-06 (PWA)          ← bisa paralel dengan PRD-02
  └── PRD-02 (Auth)
        └── PRD-03 (Transactions)
              ├── PRD-04 (Budget & Notif)
              └── PRD-05 (Dashboard & Reports)
```

## Urutan Implementasi yang Disarankan

### Sprint 1 — Foundation (1-2 minggu)

- PRD-01: Monorepo, database, shared packages
- PRD-07: Security layer (headers, validation schemas, encryption utils)
- PRD-06: PWA shell (manifest, service worker, offline page)

### Sprint 2 — Core Auth (1 minggu)

- PRD-02: Authentication & session management

### Sprint 3 — Core Feature (2 minggu)

- PRD-03: Transaction CRUD + offline sync

### Sprint 4 — Extended Features (2 minggu)

- PRD-04: Budget management + push notifications
- PRD-05: Dashboard + monthly reports

---

## Cross-Cutting Concerns

Hal-hal berikut berlaku di SEMUA PRD:

### TypeScript Strict Mode

- `strict: true`, `noUncheckedIndexedAccess: true`
- Tidak boleh ada `any` eksplisit
- Semua function harus punya return type

### Testing

- Unit test coverage >= 70% untuk business logic
- E2E test untuk setiap happy path user story
- Manual test di Chrome Android + Safari iOS 16+

### Performance Budget

- LCP <= 2.5s, FID <= 100ms, CLS <= 0.1
- Initial JS bundle <= 150KB gzipped
- API response p95 sesuai spec per endpoint

### Definition of Done

Setiap fitur DONE jika:

- TypeScript strict clean, ESLint clean
- Acceptance criteria terpenuhi
- Unit + E2E test passing
- Code review oleh 1 engineer
- Security checklist pass (Zod validation, userId dari session, no secrets)
- Lighthouse PWA >= 90
- Deploy ke staging tanpa error baru di Sentry

---

## Out of Scope (MVP)

| Fitur                     | Alasan                 | ETA                 |
| ------------------------- | ---------------------- | ------------------- |
| Auto-sync bank / e-wallet | Butuh OJK SNAP API     | Phase 2 (12+ bulan) |
| AI chat input             | Infrastruktur ML mahal | Phase 2             |
| Multi-currency            | Out of target segment  | Phase 3             |
| Fitur sosial / sharing    | Privacy concern        | Phase 3             |
| Export PDF dengan grafik  | Fitur premium          | Phase 2             |
| iOS App Store submission  | Butuh native wrapper   | Phase 2             |
| Apple SSO                 | Phase 2 priority       | Phase 2             |
| Dark mode                 | Nice-to-have           | Phase 2             |
| Multi-bahasa              | Phase 3                | Phase 3             |
| Custom kategori           | v1.1                   | v1.1                |
| Recurring transaction     | v1.1                   | v1.1                |

---

_Setiap PRD adalah living document. Perubahan melalui PR ke branch `docs/prd` dengan review Product Owner + Tech Lead._
