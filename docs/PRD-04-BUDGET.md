# PRD-04: Budget Management & Push Notifications

**Service:** Budget CRUD, Progress Tracking, Push Notification Alerts  
**Priority:** P1  
**Dependencies:** PRD-01 (Foundation), PRD-02 (Auth), PRD-03 (Transactions)  
**Estimated Effort:** 1.5 minggu  
**Owner:** Fullstack Engineer

---

## 1. Tujuan

Mengimplementasikan fitur budget per kategori pengeluaran dengan progress tracking visual, dan push notification saat pengeluaran mendekati limit. Membantu user disiplin dalam pengeluaran tanpa harus terus-menerus membuka aplikasi.

---

## 2. Scope

### In Scope

- Set budget bulanan per kategori expense
- Progress bar visual (hijau/kuning/merah)
- Hitung spent amount real-time dari transaksi
- Push notification saat budget mencapai threshold (default 80%)
- Subscribe/unsubscribe push notification
- Notifikasi per kategori (bisa di-toggle)

### Out of Scope

- Weekly budget (schema sudah support, UI di v1.1)
- Budget rollover antar bulan
- Budget sharing / family budget
- In-app notification center (Phase 2)

---

## 3. API Endpoints

### 3.1 GET /v1/budgets

List budget bulan tertentu dengan spent amount.

```typescript
// Query params
{
  year?: number,    // Default: tahun ini
  month?: number,   // Default: bulan ini (1-12)
}

// Response (200)
{
  success: true,
  data: BudgetWithSpentDTO[]
}

// BudgetWithSpentDTO:
{
  id: string,
  categoryId: string,
  category: CategoryDTO,
  amountCents: number,        // Budget limit
  spentCents: number,         // Total expense bulan ini di kategori ini
  remainingCents: number,     // amountCents - spentCents
  percentage: number,         // (spentCents / amountCents) * 100
  periodType: "MONTHLY",
  periodYear: number,
  periodMonth: number,
  notifyAt: number,           // Threshold notifikasi (default 80%)
  isOverBudget: boolean,
}
```

### 3.2 POST /v1/budgets

Buat budget baru.

```typescript
// Request body
{
  categoryId: string,
  amountCents: number,          // Budget limit dalam IDR
  periodType: "MONTHLY",       // MVP: hanya MONTHLY
  periodYear: number,
  periodMonth: number,          // 1-12
  notifyAt?: number,            // Default 80 (persen)
}

// Response (201)
{ success: true, data: BudgetDTO }

// Validasi:
// - amountCents > 0 dan <= 999_999_999
// - categoryId harus tipe EXPENSE
// - Unique constraint: userId + categoryId + periodType + periodYear + periodMonth
// - Jika sudah ada -> return error RESOURCE_003
```

### 3.3 PUT /v1/budgets/:id

Update budget.

```typescript
// Request body (partial)
{
  amountCents?: number,
  notifyAt?: number,
}

// Response (200)
{ success: true, data: BudgetDTO }
```

### 3.4 DELETE /v1/budgets/:id

Hapus budget.

```typescript
// Response (200)
{
  success: true;
}
// Hard delete (bukan soft delete — budget tidak perlu sync history)
```

### 3.5 POST /v1/push/subscribe

Subscribe push notification.

```typescript
// Request body
{
  endpoint: string,
  keys: {
    p256dh: string,
    auth: string,
  }
}

// Response (201)
{ success: true, data: { subscriptionId: string } }
```

### 3.6 DELETE /v1/push/subscribe/:subscriptionId

Unsubscribe push notification.

```typescript
// Response (200)
{
  success: true;
}
```

---

## 4. User Stories

### US-007: Set Budget Bulanan

```
SEBAGAI pengguna yang mau disiplin
SAYA INGIN set batas pengeluaran per kategori
AGAR saya tidak overspending
```

**Acceptance Criteria:**

- [ ] Halaman budget menampilkan semua kategori expense
- [ ] Setiap kategori menampilkan: budget amount, spent amount, progress bar, persentase
- [ ] Tap kategori untuk edit budget
- [ ] Budget 0 = tidak ada limit (progress bar tidak ditampilkan)
- [ ] Progress bar warna:
  - Hijau: < 60%
  - Kuning: 60-80%
  - Merah: > 80%
- [ ] Label persentase di atas progress bar
- [ ] Teks: "Rp X tersisa" atau "Rp X over budget" (merah, bold)
- [ ] Budget berlaku per bulan (ganti otomatis tiap bulan baru)
- [ ] Bisa navigasi ke bulan lain untuk lihat history budget

**UX Specifications:**

- Budget page: list vertikal, setiap item = 1 kategori
- Edit budget: bottom sheet dengan numeric input
- Progress bar: rounded, height 8px, animated fill
- Over budget: progress bar merah + teks warning

---

### US-008: Notifikasi Budget

```
SEBAGAI pengguna dengan budget aktif
SAYA INGIN dapat notifikasi saat mendekati limit
AGAR saya bisa stop pengeluaran sebelum terlambat
```

**Acceptance Criteria:**

- [ ] Push notification dikirim saat pengeluaran mencapai `notifyAt`% dari budget (default 80%)
- [ ] Hanya satu notifikasi per budget per periode (tidak spam)
- [ ] Isi notifikasi: "[Kategori]: Budget hampir habis — Rp X tersisa dari Rp Y"
- [ ] Tap notifikasi -> buka halaman budget
- [ ] Notifikasi TIDAK dikirim jika user belum subscribe push
- [ ] Minta izin push notification setelah user aktif 3 hari (bukan hari pertama)
- [ ] Pengguna bisa turn off notifikasi per kategori dari settings

**Technical Notes:**

- Notification check terjadi di backend setelah setiap transaksi EXPENSE di-create
- Jika `spentCents >= (amountCents * notifyAt / 100)` DAN `notifiedAt` belum di-set untuk periode ini -> kirim push
- Set `notifiedAt` setelah kirim -> mencegah spam
- Gunakan `web-push` library dengan VAPID keys

---

## 5. Push Notification Flow

```
1. User create transaksi EXPENSE
2. Backend: hitung total spent untuk kategori + bulan tersebut
3. Backend: cek apakah ada budget aktif untuk kategori ini
4. Jika spent >= (budget * notifyAt%) DAN belum pernah notif bulan ini:
   a. Ambil push subscriptions user
   b. Kirim push notification via web-push
   c. Set notifiedAt pada budget record
5. Jika push gagal (subscription expired):
   a. Hapus subscription dari database
   b. Log error (jangan throw)
```

### Push Notification Permission Flow

```
1. User baru: JANGAN minta izin push di hari pertama
2. Setelah user aktif 3 hari (tracked via localStorage):
   a. Tampilkan in-app banner: "Aktifkan notifikasi agar tidak overspending"
   b. Tombol: "Aktifkan" + "Nanti"
3. Jika user tap "Aktifkan":
   a. Request browser notification permission
   b. Jika granted: subscribe ke push server
   c. Jika denied: simpan preference, jangan tanya lagi
4. Jika user tap "Nanti": tanya lagi setelah 7 hari
```

---

## 6. Frontend Implementation

### 6.1 Components

```
components/features/
├── BudgetList/
│   ├── BudgetList.tsx          # List semua kategori + progress
│   ├── BudgetItem.tsx          # Single budget row dengan progress bar
│   ├── BudgetProgressBar.tsx   # Animated progress bar (hijau/kuning/merah)
│   └── index.ts
├── BudgetForm/
│   ├── BudgetForm.tsx          # Bottom sheet edit budget amount
│   └── index.ts
└── PushPermission/
    ├── PushBanner.tsx          # In-app banner minta izin push
    └── index.ts
```

### 6.2 Pages

```
app/(app)/
├── budget/
│   └── page.tsx                # Budget list + month navigator
```

### 6.3 React Query Hooks

```typescript
useBudgets(year: number, month: number)    // GET budgets with spent
useCreateBudget()                           // POST mutation
useUpdateBudget()                           // PUT mutation
useDeleteBudget()                           // DELETE mutation
```

---

## 7. Backend Implementation

### 7.1 Budget Service

```typescript
// services/budgetService.ts
{
  listWithSpent(userId: string, year: number, month: number): Promise<BudgetWithSpentDTO[]>
  create(userId: string, data: CreateBudgetInput): Promise<BudgetDTO>
  update(userId: string, id: string, data: UpdateBudgetInput): Promise<BudgetDTO>
  delete(userId: string, id: string): Promise<void>
  checkAndNotify(userId: string, categoryId: string, year: number, month: number): Promise<void>
}
```

### 7.2 Push Service

```typescript
// services/pushService.ts
{
  subscribe(userId: string, subscription: PushSubscriptionData): Promise<string>
  unsubscribe(userId: string, subscriptionId: string): Promise<void>
  sendNotification(userId: string, payload: NotificationPayload): Promise<void>
  cleanupExpiredSubscriptions(userId: string): Promise<void>
}
```

### 7.3 Notification Trigger

```typescript
// Di transactionService.create():
// Setelah transaksi EXPENSE berhasil disimpan:
if (transaction.type === "EXPENSE") {
  await budgetService.checkAndNotify(
    userId,
    transaction.categoryId,
    transaction.transactionDate.getFullYear(),
    transaction.transactionDate.getMonth() + 1,
  );
}
```

---

## 8. Rate Limiting

```typescript
"/api/budgets":    { max: 50, timeWindow: "1 minute" }
"/api/push/*":     { max: 5, timeWindow: "1 minute" }
```

---

## 9. Performance Requirements

| Metric                     | Target                 |
| -------------------------- | ---------------------- |
| GET /v1/budgets (p95)      | <= 300ms               |
| Budget page load           | < 1.5s (dari cache)    |
| Push notification delivery | < 5s setelah transaksi |
| Progress bar animation     | 60fps                  |

---

## 10. Acceptance Criteria (PRD Level)

- [ ] Budget list menampilkan semua kategori expense dengan progress
- [ ] Set/edit budget amount berfungsi
- [ ] Progress bar warna berubah sesuai threshold (hijau/kuning/merah)
- [ ] "Rp X tersisa" / "Rp X over budget" tampil akurat
- [ ] Budget 0 = tidak ada limit, progress bar hidden
- [ ] Push notification terkirim saat budget mencapai threshold
- [ ] Hanya 1 notifikasi per budget per bulan (tidak spam)
- [ ] Tap notifikasi membuka halaman budget
- [ ] Push permission diminta setelah 3 hari aktif
- [ ] User bisa toggle notifikasi per kategori
- [ ] Budget auto-reset tiap bulan baru (data bulan lalu tetap bisa dilihat)
- [ ] Spent amount dihitung real-time dari transaksi
