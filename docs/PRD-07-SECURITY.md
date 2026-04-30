# PRD-07: Security Layer

**Service:** Encryption, HTTP Headers, Input Validation, Rate Limiting, Audit Log  
**Priority:** P0  
**Dependencies:** PRD-01 (Foundation)  
**Estimated Effort:** 1 minggu  
**Owner:** Backend Engineer (lead) + Frontend Engineer

---

## 1. Tujuan

Mengimplementasikan lapisan keamanan menyeluruh untuk melindungi data keuangan pengguna. Mencakup enkripsi data sensitif (client-side dan server-side), HTTP security headers, input validation, rate limiting, dan audit logging. Semua poin di PRD ini adalah **hard requirement** -- PR tidak akan di-merge jika ada yang belum terpenuhi.

---

## 2. Scope

### In Scope

- Transport security (HTTPS, TLS, HSTS)
- Client-side encryption (Web Crypto API)
- Server-side encryption (AES-256-GCM)
- HTTP security headers (CSP, X-Frame-Options, dll)
- Input validation dan sanitization (Zod + DOMPurify)
- Rate limiting (per endpoint)
- Audit logging
- Dependency security (pnpm audit)
- Row Level Security (Supabase)

### Out of Scope

- Penetration testing (dilakukan pihak ketiga sebelum launch)
- SOC 2 compliance (Phase 2)
- GDPR compliance (Phase 3)

---

## 3. Transport Security

| Requirement    | Detail                                        |
| -------------- | --------------------------------------------- |
| HTTPS          | Wajib di semua environment (termasuk staging) |
| TLS version    | Minimum TLS 1.2, preferred TLS 1.3            |
| HSTS           | max-age=31536000; includeSubDomains; preload  |
| Cloudflare SSL | Mode: Full (Strict)                           |
| Mixed content  | Tidak boleh ada -- semua asset via HTTPS      |

---

## 4. Data Encryption

### 4.1 Client-Side Encryption (Web Crypto API)

Data sensitif (nominal transaksi, budget amount) dienkripsi di sisi klien SEBELUM dikirim ke server.

**Config:**

- Algorithm: AES-GCM, 256-bit
- Key derivation: PBKDF2 dari kombinasi user UID + device fingerprint
- IV: baru untuk setiap enkripsi (12 bytes random)
- PBKDF2 iterations: 100,000
- Salt length: 16 bytes
- Format ciphertext: `enc:v1:<iv_hex>:<ciphertext_base64>`

**Functions yang harus diimplementasi:**

```
lib/crypto/encrypt.ts
- encrypt(plaintext, userUid) -> Promise<string>
- decrypt(ciphertext, userUid) -> Promise<string>
- deriveKey(userUid, deviceFingerprint) -> Promise<CryptoKey>
```

**Rules:**

- Enkripsi terjadi SEBELUM data dikirim ke server
- IV baru untuk SETIAP operasi enkripsi (jangan reuse)
- Key derivation menggunakan PBKDF2 (bukan langsung hash)
- Guest mode: data TIDAK dienkripsi (tidak ada akun)

### 4.2 Server-Side Encryption

- Field sensitif di PostgreSQL dienkripsi dengan AES-256-GCM
- Library: @noble/ciphers
- Format: `senc:v{version}:<iv_hex>:<ciphertext_base64>`
- Encryption key dari environment variable (TIDAK hardcode)
- Key rotation support: versi key disimpan bersama ciphertext
- Connection PostgreSQL menggunakan SSL

### 4.3 IndexedDB Encryption

- Data sensitif di IndexedDB dienkripsi sebelum disimpan
- Kunci enkripsi lokal disimpan di sessionStorage (clear saat browser tutup)
- Derived dari user session token
- Guest mode: data TIDAK dienkripsi

---

## 5. HTTP Security Headers

### 5.1 Frontend (next.config.js)

| Header                    | Value                                        |
| ------------------------- | -------------------------------------------- |
| X-DNS-Prefetch-Control    | on                                           |
| Strict-Transport-Security | max-age=31536000; includeSubDomains; preload |
| X-Frame-Options           | DENY                                         |
| X-Content-Type-Options    | nosniff                                      |
| Referrer-Policy           | strict-origin-when-cross-origin              |
| Permissions-Policy        | camera=(), microphone=(), geolocation=()     |
| Content-Security-Policy   | (lihat detail di bawah)                      |

**CSP Policy:**

- default-src 'self'
- script-src 'self' 'nonce-{NONCE}' (nonce-based, bukan unsafe-inline)
- style-src 'self' 'unsafe-inline' (Tailwind memerlukan ini)
- img-src 'self' data: https:
- font-src 'self'
- connect-src 'self' https://api.yourdomain.com https://\*.firebaseapp.com
- frame-ancestors 'none'
- base-uri 'self'
- form-action 'self'

### 5.2 Backend (Fastify)

Fastify hook onSend untuk set headers + CORS:

- Access-Control-Allow-Origin: dari CORS_ORIGINS env
- Access-Control-Allow-Credentials: true
- Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
- Access-Control-Allow-Headers: Content-Type, X-CSRF-Token

---

## 6. Input Validation dan Sanitization

### 6.1 Rules

| Rule              | Detail                                                        |
| ----------------- | ------------------------------------------------------------- |
| Library           | Zod (shared packages/schemas)                                 |
| Lokasi validasi   | DUA tempat: frontend (UX) DAN backend (keamanan)              |
| Trust model       | Backend TIDAK PERNAH mempercayai input dari frontend          |
| HTML sanitization | DOMPurify untuk konten yang di-render sebagai HTML            |
| SQL injection     | Dicegah oleh Prisma (parameterized queries) -- JANGAN raw SQL |
| Amount range      | 0 < amount <= 999,999,999                                     |
| String fields     | trim + maxLength validation                                   |
| Date fields       | Tidak boleh > 1 tahun ke depan atau 10 tahun ke belakang      |

### 6.2 Shared Zod Schemas

Semua validation schema di packages/schemas/, digunakan FE dan BE:

- createTransactionSchema, updateTransactionSchema, transactionFiltersSchema
- createBudgetSchema, updateBudgetSchema
- authSessionSchema (idToken: string)
- createCategorySchema

### 6.3 Backend Validation Middleware

```
middleware/validate.ts
- Fastify preHandler
- Parse request body/query/params dengan Zod schema
- Jika invalid: return 400 VALIDATION_001 dengan detail field errors
- Jika valid: attach parsed data ke request
- Trim semua string fields otomatis
```

---

## 7. Rate Limiting

### 7.1 Configuration

| Endpoint          | Max Requests | Time Window |
| ----------------- | ------------ | ----------- |
| /api/auth/\*      | 10           | 15 minutes  |
| /api/transactions | 100          | 1 minute    |
| /api/budgets      | 50           | 1 minute    |
| /api/reports      | 10           | 1 minute    |
| /api/push/\*      | 5            | 1 minute    |
| Global fallback   | 200          | 1 minute    |

### 7.2 Implementation

- Key by: IP + User ID (jika authenticated)
- Storage: Redis (Upstash)
- Response saat limit exceeded: 429 Too Many Requests
- Error code: AUTH_004
- Header: Retry-After: seconds

---

## 8. Audit Logging

### 8.1 Events yang WAJIB di-log

| Event              | Action String       | Detail                         |
| ------------------ | ------------------- | ------------------------------ |
| Login berhasil     | auth.login          | Provider, IP, user agent       |
| Login gagal        | auth.login_failed   | Reason, IP                     |
| Logout             | auth.logout         | Session ID                     |
| Token refresh      | auth.refresh        | -                              |
| Session revoked    | session.revoked     | Session ID                     |
| Transaksi dibuat   | transaction.created | Transaction ID                 |
| Transaksi diupdate | transaction.updated | Transaction ID, changed fields |
| Transaksi dihapus  | transaction.deleted | Transaction ID                 |
| Budget dibuat      | budget.created      | Budget ID                      |
| Budget diupdate    | budget.updated      | Budget ID                      |
| Budget dihapus     | budget.deleted      | Budget ID                      |

### 8.2 JANGAN di-log

- Password, token, API keys
- Data keuangan pengguna (nominal transaksi)
- Personal data (nama, email) kecuali di audit log yang terlindungi
- Full request/response bodies

### 8.3 Retention

- Audit logs disimpan minimal 1 tahun
- Setelah 1 tahun: archive ke cold storage (Phase 2)

---

## 9. User ID Enforcement

**KRITIS -- Aturan paling penting di seluruh backend:**

userId SELALU dari session/token server-side. TIDAK PERNAH dari request body atau URL params.

```
// BENAR:
const userId = request.user.id;  // Dari JWT middleware

// SALAH -- JANGAN PERNAH:
const { userId, ...data } = request.body;  // Client bisa inject userId lain!
```

---

## 10. Dependency Security

| Rule        | Detail                                             |
| ----------- | -------------------------------------------------- |
| Audit       | pnpm audit di setiap CI pipeline run               |
| Block merge | Jika ada high/critical vulnerability               |
| Auto-update | Dependabot untuk auto-update dependencies          |
| Lock file   | pnpm-lock.yaml wajib di-commit                     |
| Production  | Tidak boleh ada package dengan known vulnerability |

---

## 11. Error Codes (Security-Related)

| Code           | Deskripsi                                              |
| -------------- | ------------------------------------------------------ |
| AUTH_001       | Token tidak valid atau expired                         |
| AUTH_002       | Session tidak ditemukan atau sudah dicabut             |
| AUTH_003       | CSRF token tidak valid                                 |
| AUTH_004       | Rate limit exceeded                                    |
| VALIDATION_001 | Input tidak valid (sertakan field yang error)          |
| SERVER_001     | Internal server error (JANGAN expose detail ke client) |

---

## 12. Acceptance Criteria (PRD Level)

### Transport

- [ ] HTTPS aktif di semua environment
- [ ] HSTS header terpasang
- [ ] Tidak ada mixed content

### Encryption

- [ ] Client-side encryption berfungsi (encrypt sebelum kirim ke server)
- [ ] Server-side encryption berfungsi (field sensitif terenkripsi di DB)
- [ ] IndexedDB encryption berfungsi (data sensitif terenkripsi lokal)
- [ ] Key rotation support tersedia
- [ ] IV tidak pernah di-reuse

### Headers

- [ ] Semua security headers terpasang di frontend dan backend
- [ ] CSP policy aktif dengan nonce-based script-src
- [ ] CORS hanya mengizinkan domain yang terdaftar

### Validation

- [ ] Semua input divalidasi dengan Zod di frontend DAN backend
- [ ] Backend tidak mempercayai input frontend (validasi ulang)
- [ ] Amount range enforced (0 < x <= 999,999,999)
- [ ] Date range enforced
- [ ] String trim + maxLength enforced

### Rate Limiting

- [ ] Rate limiting aktif di semua endpoint sesuai config
- [ ] 429 response dengan Retry-After header
- [ ] Key by IP + User ID

### Audit

- [ ] Semua auth events ter-log
- [ ] Semua write operations ter-log
- [ ] Tidak ada data sensitif di log

### Dependencies

- [ ] pnpm audit pass (no high/critical)
- [ ] Dependabot terkonfigurasi
- [ ] Lock file ter-commit

### User ID

- [ ] userId SELALU dari session di semua endpoint
- [ ] Code review checklist: tidak ada userId dari request body
