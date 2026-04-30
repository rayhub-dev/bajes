# PRD-02: Authentication & Session Management

**Service:** Auth, Session, Guest Mode, Onboarding  
**Priority:** P0  
**Dependencies:** PRD-01 (Foundation)  
**Estimated Effort:** 1 minggu  
**Owner:** Backend Engineer + Frontend Engineer

---

## 1. Tujuan

Mengimplementasikan sistem autentikasi yang aman menggunakan Google SSO via Firebase Auth, server-side session management dengan HttpOnly cookies, guest mode untuk trial tanpa akun, dan onboarding flow yang bisa diselesaikan dalam < 60 detik.

---

## 2. Scope

### In Scope

- Google SSO login via Firebase Auth
- Server-side session (access token + refresh token via HttpOnly cookies)
- CSRF protection (double-submit cookie pattern)
- Guest mode (data lokal tanpa server)
- Onboarding tutorial (3 langkah, dismissible)
- Migrasi data guest ke akun baru
- Logout + session revocation
- Multi-device session management

### Out of Scope

- Email/password login (tidak ada di MVP)
- Apple SSO (Phase 2)
- Two-factor authentication (Phase 2)

---

## 3. Authentication Flow

```
1. User klik "Login dengan Google"
2. Firebase Auth mengembalikan ID Token (JWT Firebase)
3. FE kirim ID Token ke POST /v1/auth/session
4. BE validasi token via Firebase Admin SDK
5. BE buat/update User record di PostgreSQL
6. BE buat server-side session -> set HttpOnly cookie:
   - access_token (15 menit TTL)
   - refresh_token (7 hari TTL, rotated)
   - csrf_token (non-HttpOnly, untuk double-submit)
7. Semua request API berikutnya menggunakan cookie (bukan Authorization header)
8. CSRF token dikirim via X-CSRF-Token header
```

---

## 4. API Endpoints

### 4.1 POST /v1/auth/session

Tukar Firebase ID Token menjadi server session.

```typescript
// Request
{ idToken: string }

// Response (200)
{
  success: true,
  data: { user: UserDTO }
}

// Cookies yang di-set:
// access_token  — HttpOnly, Secure, SameSite=Strict, Max-Age=900 (15min)
// refresh_token — HttpOnly, Secure, SameSite=Strict, Max-Age=604800 (7d)
// csrf_token    — Secure, SameSite=Strict (BUKAN HttpOnly, agar JS bisa baca)
```

### 4.2 POST /v1/auth/refresh

Rotate refresh token.

```typescript
// Request: cookie refresh_token + Header X-CSRF-Token
// Response (200)
{
  success: true,
  data: { user: UserDTO }
}
// Cookies: access_token + refresh_token (rotated, token lama di-invalidasi)
```

### 4.3 POST /v1/auth/logout

Revoke session dan clear cookies.

```typescript
// Request: cookie refresh_token + Header X-CSRF-Token
// Response (200)
{
  success: true;
}
// Cookies: Clear semua auth cookies
// Server: Set revokedAt pada session record
```

### 4.4 GET /v1/auth/me

Ambil data user yang sedang login.

```typescript
// Response (200)
{
  success: true,
  data: { user: UserDTO }
}
```

### 4.5 DELETE /v1/auth/sessions/:sessionId

Revoke satu session spesifik (untuk "logout device lain").

```typescript
// Response (200)
{
  success: true;
}
```

---

## 5. Session Security Rules

| Rule                | Detail                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Token storage       | HttpOnly + Secure + SameSite=Strict cookie SAJA. JANGAN localStorage/sessionStorage                                                   |
| Access token TTL    | 15 menit                                                                                                                              |
| Refresh token TTL   | 7 hari                                                                                                                                |
| Refresh rotation    | Setiap kali digunakan, token lama di-invalidasi (one-time use)                                                                        |
| CSRF protection     | Double-submit cookie pattern: server set csrf_token cookie, client kirim via X-CSRF-Token header, server verifikasi header === cookie |
| Firebase validation | ID Token divalidasi server-side SETIAP sesi baru                                                                                      |
| Logout              | Wajib invalidasi refresh token di database (denylist)                                                                                 |
| Refresh token hash  | Simpan hashed di database, bukan plaintext                                                                                            |

---

## 6. User Stories

### US-001: Guest Mode

```
SEBAGAI pengunjung baru
SAYA INGIN langsung mencoba aplikasi tanpa daftar
AGAR saya bisa menilai apakah aplikasinya berguna sebelum komitmen
```

**Acceptance Criteria:**

- [ ] Tersedia tombol "Coba tanpa akun" di halaman landing
- [ ] Data tersimpan di IndexedDB lokal (tidak dikirim ke server)
- [ ] Maksimal 10 transaksi di guest mode — selebihnya muncul prompt untuk daftar
- [ ] Muncul banner "Buat akun untuk menyimpan data" setelah 3 transaksi
- [ ] Saat user daftar dari guest mode, data lokal di-migrate ke akun baru
- [ ] Clear data guest jika user tidak aktif 30 hari

**Technical Notes:**

- Guest data TIDAK dienkripsi (tidak ada akun, tidak ada data sensitif)
- Guest mode tidak membuat record di server sama sekali
- Migrasi guest -> akun: batch POST /v1/transactions/batch setelah login pertama

---

### US-002: Daftar / Login

```
SEBAGAI calon pengguna
SAYA INGIN mendaftar menggunakan akun Google
AGAR saya tidak perlu membuat password baru
```

**Acceptance Criteria:**

- [ ] Halaman auth menampilkan: Google SSO + Guest option
- [ ] Tidak ada form email/password di MVP
- [ ] Setelah login pertama, tampilkan tutorial 3 langkah (dismissible)
- [ ] Tutorial langkah 1: cara tambah transaksi
- [ ] Tutorial langkah 2: cara set budget
- [ ] Tutorial langkah 3: cara lihat dashboard
- [ ] Tutorial bisa di-skip
- [ ] Setelah selesai/skip tutorial, langsung ke dashboard
- [ ] Total waktu onboarding <= 60 detik

---

## 7. Frontend Implementation

### 7.1 Auth Pages

```
app/(auth)/
├── login/page.tsx          # Google SSO + Guest button
├── onboarding/page.tsx     # Tutorial 3 langkah
└── layout.tsx              # Auth layout (no bottom nav)
```

### 7.2 Auth State (Zustand)

```typescript
interface AuthStore {
  user: UserDTO | null;
  isGuest: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;

  loginWithGoogle: () => Promise<void>;
  enterGuestMode: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  migrateGuestData: () => Promise<void>;
}
```

### 7.3 Axios Interceptor

```typescript
// Otomatis:
// 1. Attach CSRF token dari cookie ke header X-CSRF-Token
// 2. Jika 401 response -> coba refresh token -> retry request
// 3. Jika refresh gagal -> redirect ke login
// 4. Credentials: 'include' (agar cookie dikirim)
```

### 7.4 Route Protection

```typescript
// middleware.ts (Next.js)
// Protected routes: /dashboard, /transactions, /budget, /report
// Cek access_token cookie existence
// Jika tidak ada -> redirect ke /login
// Guest mode: cek localStorage flag, izinkan akses terbatas
```

---

## 8. Backend Implementation

### 8.1 Auth Middleware

```typescript
// middleware/requireAuth.ts
// 1. Baca access_token dari cookie
// 2. Verify JWT signature + expiry
// 3. Attach user object ke request
// 4. Jika expired -> return 401 AUTH_001

// middleware/csrfProtection.ts
// 1. Baca csrf_token dari cookie
// 2. Baca X-CSRF-Token dari header
// 3. Bandingkan: jika tidak sama -> return 403 AUTH_003
// 4. Hanya untuk mutating requests (POST, PUT, DELETE)
```

### 8.2 Session Service

```typescript
// services/authService.ts
{
  createSession(firebaseIdToken: string, userAgent: string, ip: string): Promise<SessionResult>
  refreshSession(refreshToken: string): Promise<SessionResult>
  revokeSession(sessionId: string, userId: string): Promise<void>
  revokeAllSessions(userId: string): Promise<void>
  getActiveSessions(userId: string): Promise<SessionDTO[]>
}
```

---

## 9. Error Codes

| Code     | Deskripsi                                  |
| -------- | ------------------------------------------ |
| AUTH_001 | Token tidak valid atau expired             |
| AUTH_002 | Session tidak ditemukan atau sudah dicabut |
| AUTH_003 | CSRF token tidak valid                     |
| AUTH_004 | Rate limit exceeded                        |

---

## 10. Rate Limiting

```typescript
"/api/auth/*": { max: 10, timeWindow: "15 minutes" }
// Key by: IP + User ID (jika authenticated)
```

---

## 11. Acceptance Criteria (PRD Level)

- [ ] Google SSO login berfungsi end-to-end (FE -> Firebase -> BE -> session cookie)
- [ ] Access token auto-refresh saat expired (transparent ke user)
- [ ] CSRF protection aktif untuk semua mutating endpoints
- [ ] Guest mode berfungsi tanpa server call
- [ ] Guest -> akun migrasi data berhasil
- [ ] Onboarding tutorial tampil saat login pertama
- [ ] Logout menghapus session di server + clear cookies
- [ ] Multi-device: bisa revoke session dari device lain
- [ ] Rate limiting aktif di auth endpoints
- [ ] Semua auth events ter-log di audit log
