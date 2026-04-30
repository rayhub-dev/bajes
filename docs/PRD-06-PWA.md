# PRD-06: PWA & Offline-First Engine

**Service:** Service Worker, Web App Manifest, Install Prompt, Offline Page, Caching  
**Priority:** P0  
**Dependencies:** PRD-01 (Foundation)  
**Estimated Effort:** 1 minggu  
**Owner:** Frontend Engineer

---

## 1. Tujuan

Mengimplementasikan Progressive Web App (PWA) yang bisa diinstal di Android dan iOS, bekerja offline, dan memenuhi semua Lighthouse PWA checklist. App harus terasa seperti native app dengan standalone display, home screen shortcut, dan share target.

---

## 2. Scope

### In Scope

- Web App Manifest (installable)
- Service Worker dengan Workbox caching strategies
- Offline page
- Install prompt (custom, bukan browser default)
- App shortcuts
- Share target
- Background sync
- Lighthouse PWA score >= 90

### Out of Scope

- Native app wrapper (Phase 2)
- iOS App Store submission (Phase 2)
- Web Push setup (dihandle PRD-04)

---

## 3. Web App Manifest

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
    { "src": "/icons/icon-128x128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144x144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152x152.png", "sizes": "152x152", "type": "image/png" },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    { "src": "/icons/icon-384x384.png", "sizes": "384x384", "type": "image/png" },
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

### Icon Requirements

Semua icon harus tersedia dalam ukuran berikut:

- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- Format: PNG
- 192x192 dan 512x512 harus support `maskable` purpose
- Shortcut icon: 96x96

---

## 4. Service Worker Strategy (Workbox)

### 4.1 Caching Strategies

```typescript
// next.config.js (next-pwa config)
const runtimeCaching = [
  // API calls: Network-First dengan fallback ke cache
  {
    urlPattern: /^https:\/\/api\.yourdomain\.com\/v1\/.*/,
    handler: "NetworkFirst",
    options: {
      cacheName: "api-cache",
      networkTimeoutSeconds: 5,
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60, // 1 jam
      },
    },
  },

  // Static assets (JS, CSS, fonts): Cache-First
  {
    urlPattern: /\.(js|css|woff2)$/,
    handler: "CacheFirst",
    options: {
      cacheName: "static-assets",
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      },
    },
  },

  // Images: Stale-While-Revalidate
  {
    urlPattern: /\.(png|jpg|webp|svg|ico)$/,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "images",
      expiration: { maxEntries: 30 },
    },
  },
];
```

### 4.2 Caching Rules

| Resource     | Strategy             | Cache Name    | TTL     | Max Entries |
| ------------ | -------------------- | ------------- | ------- | ----------- |
| API calls    | NetworkFirst         | api-cache     | 1 jam   | 100         |
| JS/CSS/Fonts | CacheFirst           | static-assets | 30 hari | 50          |
| Images       | StaleWhileRevalidate | images        | -       | 30          |
| HTML pages   | NetworkFirst         | pages         | 1 jam   | 20          |

**PENTING:**

- JANGAN cache response yang mengandung cookie/auth data
- JANGAN cache `/api/auth/*` endpoints
- Precache: app shell (layout, bottom nav, offline page)

---

## 5. Offline Page

### 5.1 Requirements

- URL: `/offline`
- Tampil saat tidak ada koneksi DAN halaman belum ter-cache
- Pesan user-friendly: "Tidak ada koneksi internet"

### 5.2 Content

```
[Icon: wifi-off]

Tidak ada koneksi internet

Fitur yang masih bisa digunakan offline:
✓ Tambah transaksi (akan sync nanti)
✓ Lihat transaksi bulan ini (dari cache)
✓ Lihat dashboard (dari cache)

[Tombol: Coba lagi]
```

### 5.3 Technical

- Halaman offline di-precache oleh service worker
- Tombol "Coba lagi" trigger `window.location.reload()`
- Deteksi online/offline via `navigator.onLine` + `online`/`offline` events
- Tampilkan toast/banner saat status berubah: "Kembali online" / "Offline mode"

---

## 6. Install Prompt

### 6.1 Trigger Conditions

Install prompt ditampilkan jika SEMUA kondisi terpenuhi:

1. User menggunakan app minimal 3 kali (tracked via localStorage counter)
2. User sudah menambahkan minimal 1 transaksi
3. User belum pernah dismiss prompt sebelumnya
4. Browser mendukung install (beforeinstallprompt event tersedia)

### 6.2 Implementation

```typescript
// hooks/useInstallPrompt.ts

// 1. Intercept browser default prompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  // Simpan event untuk digunakan nanti
  setDeferredPrompt(e);
});

// 2. Tampilkan custom banner saat conditions terpenuhi
// 3. Saat user tap "Instal" -> trigger deferredPrompt.prompt()
// 4. Saat user tap "Nanti saja" -> simpan dismissal, jangan tampilkan lagi
```

### 6.3 Custom Install Banner

```
[Bottom sheet, bukan popup tengah layar]

📱 Instal MoneyTracker
Buka langsung dari homescreen untuk pengalaman lebih baik!

[Tombol: Instal]  [Link: Nanti saja]
```

**UX Rules:**

- Posisi: bottom sheet (bukan modal/popup tengah)
- Tidak mengganggu flow utama
- Dismiss = tidak tampil lagi (permanent)
- Setelah install berhasil: tampilkan toast "Berhasil diinstal!"

---

## 7. Background Sync

### 7.1 Strategy

```typescript
// Service worker: register sync event
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-transactions") {
    event.waitUntil(syncPendingTransactions());
  }
});

// Fallback untuk browser yang tidak support Background Sync:
// - Sync saat app dibuka
// - Periodic check setiap 30 detik saat app aktif
// - Sync saat online event terdeteksi
```

### 7.2 Sync Queue

- Semua pending operations disimpan di IndexedDB
- Saat online: batch sync via POST /v1/transactions/batch
- Max 50 operations per batch
- Retry failed operations (max 3 retries, exponential backoff)

---

## 8. Lighthouse Score Targets

| Category       | Target                        |
| -------------- | ----------------------------- |
| Performance    | >= 90                         |
| Accessibility  | >= 90                         |
| Best Practices | >= 90                         |
| SEO            | >= 80                         |
| PWA            | >= 90 (semua checklist hijau) |

**Wajib lulus SEMUA PWA checklist Lighthouse sebelum launch.**

### PWA Checklist Items

- [ ] Registers a service worker
- [ ] Responds with 200 when offline
- [ ] Has a `<meta name="viewport">` tag
- [ ] Contains content when JavaScript is not available (SSR/SSG)
- [ ] Uses HTTPS
- [ ] Redirects HTTP to HTTPS
- [ ] Configured for a custom splash screen
- [ ] Sets a theme color for the address bar
- [ ] Content is sized correctly for the viewport
- [ ] Has a valid web app manifest
- [ ] Provides a valid `apple-touch-icon`
- [ ] Installable

---

## 9. Share Target

### 9.1 Flow

```
1. User share angka dari app lain (kalkulator, chat, dll)
2. MoneyTracker muncul di share sheet
3. App terbuka dengan amount pre-filled di transaction form
4. User tinggal pilih kategori dan simpan
```

### 9.2 Implementation

```typescript
// app/share-target/page.tsx
// 1. Baca query param ?amount=50000
// 2. Parse angka
// 3. Redirect ke dashboard dengan modal transaksi terbuka + amount prefilled
```

---

## 10. Online/Offline Status Indicator

```typescript
// components/ui/ConnectionStatus.tsx
// - Tampilkan banner di atas layar saat offline: "Mode offline — data akan disinkronkan"
// - Warna: kuning/amber
// - Tampilkan toast saat kembali online: "Kembali online — menyinkronkan data..."
// - Auto-dismiss setelah 3 detik
```

---

## 11. Acceptance Criteria (PRD Level)

- [ ] App bisa diinstal di Android (Chrome) dan iOS (Safari)
- [ ] Manifest valid dan semua icon tersedia
- [ ] Service worker terdaftar dan berfungsi
- [ ] Offline page tampil saat tidak ada koneksi
- [ ] Caching strategies berfungsi sesuai spec
- [ ] Install prompt custom muncul sesuai conditions
- [ ] App shortcuts berfungsi (long press icon -> "Tambah Pengeluaran")
- [ ] Share target berfungsi (share angka -> prefill amount)
- [ ] Background sync berfungsi (offline transactions sync saat online)
- [ ] Online/offline status indicator tampil
- [ ] Lighthouse PWA score >= 90
- [ ] Semua PWA checklist Lighthouse hijau
- [ ] Standalone display (tidak ada browser chrome)
- [ ] Splash screen tampil saat app dibuka dari homescreen
