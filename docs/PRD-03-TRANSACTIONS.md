# PRD-03: Transaction Management

**Service:** Transaction CRUD, Offline Queue, Batch Sync, Riwayat  
**Priority:** P0  
**Dependencies:** PRD-01 (Foundation), PRD-02 (Auth)  
**Estimated Effort:** 2 minggu  
**Owner:** Fullstack Engineer

---

## 1. Tujuan

Mengimplementasikan fitur pencatatan transaksi (income & expense) yang bisa dilakukan dalam < 10 detik, bekerja offline-first dengan sync otomatis saat online, dan menampilkan riwayat transaksi yang terorganisir.

---

## 2. Scope

### In Scope

- Tambah transaksi (income & expense)
- Edit transaksi
- Hapus transaksi (soft delete)
- Riwayat transaksi dengan filter & infinite scroll
- Offline-first: simpan ke IndexedDB dulu, sync ke server di background
- Batch sync untuk offline queue
- Format currency Rupiah otomatis
- Idempotency via clientId

### Out of Scope

- Search by catatan (v1.1)
- Recurring transaction (v1.1)
- Custom kategori (v1.1)
- Export data (Phase 2)

---

## 3. Data Flow (Offline-First)

```
User Input
    |
    v
[Zustand store] --> [IndexedDB via Dexie] --> UI update (optimistic)
                           |
                           v
                    [Sync Queue]
                     (background)
                           |
                    Online? --> YES --> [Fastify API] --> [PostgreSQL]
                           |                                   |
                           NO                             Conflict?
                           |                                   |
                    Queue preserved               last-write-wins + timestamp
                    (Background Sync API)
```

**Prinsip:**

1. Data SELALU disimpan ke IndexedDB terlebih dahulu
2. UI update secara optimistic (tidak menunggu server)
3. Sync ke server terjadi di background
4. Jika offline, queue dipertahankan dan di-sync saat online kembali
5. Conflict resolution: last-write-wins berdasarkan `updatedAt` timestamp

---

## 4. API Endpoints

### 4.1 GET /v1/transactions

List transaksi dengan filter dan pagination.

```typescript
// Query params
{
  startDate?: string,    // ISO datetime, default: awal bulan ini
  endDate?: string,      // ISO datetime, default: akhir bulan ini
  categoryId?: string,   // Filter by kategori
  type?: "INCOME" | "EXPENSE" | "ALL",  // Default: ALL
  page?: number,         // Default: 1
  pageSize?: number,     // Default: 20, max: 100
  sortBy?: string,       // Default: transactionDate DESC
}

// Response (200)
{
  success: true,
  data: TransactionDTO[],
  pagination: {
    page: number,
    pageSize: number,
    total: number,
    totalPages: number
  }
}
```

### 4.2 POST /v1/transactions

Buat transaksi baru.

```typescript
// Request body
{
  categoryId: string,       // CUID
  amountEncrypted: string,  // "enc:v1:<iv>:<ciphertext>"
  amountCents: number,      // Integer IDR, untuk aggregation
  type: "INCOME" | "EXPENSE",
  note?: string,            // Max 200 chars, opsional
  transactionDate: string,  // ISO datetime
  clientId: string,         // UUID dari IndexedDB, untuk idempotency
}

// Response (201)
{
  success: true,
  data: TransactionDTO
}

// Idempotency: jika clientId sudah ada, return existing record (bukan error)
// Error code: RESOURCE_003 (conflict, return existing)
```

### 4.3 PUT /v1/transactions/:id

Update transaksi.

```typescript
// Request body (partial, kecuali clientId)
{
  categoryId?: string,
  amountEncrypted?: string,
  amountCents?: number,
  type?: "INCOME" | "EXPENSE",
  note?: string,
  transactionDate?: string,
}

// Response (200)
{ success: true, data: TransactionDTO }

// Validasi: userId dari session harus match dengan transaction owner
// Error: RESOURCE_002 jika bukan milik user
```

### 4.4 DELETE /v1/transactions/:id

Soft delete transaksi.

```typescript
// Response (200)
{
  success: true;
}

// Server: set deletedAt = now()
// Data tetap ada di database untuk sync consistency
```

### 4.5 POST /v1/transactions/batch

Sync batch dari offline queue.

```typescript
// Request body
{
  operations: Array<{
    type: "create" | "update" | "delete",
    data: TransactionDTO
  }>
}
// Maksimal 50 operations per request

// Response (200)
{
  success: true,
  data: {
    succeeded: string[],     // clientId yang berhasil
    failed: Array<{
      clientId: string,
      error: string
    }>
  }
}
```

### 4.6 GET /v1/categories

List kategori (default + custom user).

```typescript
// Query params
{ type?: "INCOME" | "EXPENSE" | "ALL" }

// Response (200)
{
  success: true,
  data: CategoryDTO[]
}
// Returns: default categories (userId: null) + user custom categories
```

---

## 5. User Stories

### US-003: Tambah Transaksi

```
SEBAGAI pengguna aktif
SAYA INGIN mencatat pengeluaran dengan cepat
AGAR saya tidak kehilangan momen untuk mencatat
```

**Acceptance Criteria:**

- [ ] Tombol "+" (FAB) selalu visible di bottom navigation
- [ ] Modal/sheet transaksi muncul dalam < 200ms setelah tap
- [ ] Field: nominal (required), kategori (required), tanggal (default hari ini), catatan (opsional)
- [ ] Keyboard numerik muncul otomatis saat modal terbuka
- [ ] Nominal format Rupiah otomatis (50000 -> "Rp 50.000")
- [ ] Kategori ditampilkan sebagai grid icon (bukan dropdown)
- [ ] Tanggal bisa diubah, default hari ini
- [ ] Catatan: textarea single-line, enter untuk submit
- [ ] Tombol simpan di posisi mudah dijangkau ibu jari
- [ ] Waktu buka modal -> simpan berhasil: <= 10 detik
- [ ] Saat offline: data tersimpan lokal + indikator "Akan disinkronkan"
- [ ] Saat sync berhasil: hapus indikator "pending"
- [ ] Support income dan expense (toggle di atas modal)

**UX Specifications:**

- Modal muncul sebagai bottom sheet (bukan full page)
- Nominal input: angka saja, auto-format ribuan
- Validasi range: 0 < amount <= 999.999.999
- Kategori grid: 2 baris x 4 kolom (scrollable horizontal jika lebih)
- Date picker: calendar popup, tidak boleh > 1 tahun ke depan atau 10 tahun ke belakang

---

### US-004: Edit & Hapus Transaksi

```
SEBAGAI pengguna
SAYA INGIN mengedit transaksi yang salah
AGAR data saya akurat
```

**Acceptance Criteria:**

- [ ] Tap transaksi di list -> buka modal edit (prefilled)
- [ ] Swipe kiri pada transaksi -> tampilkan tombol delete (dengan confirm dialog)
- [ ] Hapus adalah soft delete (data masih ada di server, tidak muncul di UI)
- [ ] Edit / hapus tersync saat online
- [ ] Confirm dialog untuk delete: "Hapus transaksi ini?" dengan tombol "Batal" dan "Hapus"

---

### US-005: Riwayat Transaksi

```
SEBAGAI pengguna
SAYA INGIN melihat semua transaksi saya
AGAR saya bisa review pengeluaran
```

**Acceptance Criteria:**

- [ ] List transaksi dikelompokkan per hari (section header dengan tanggal)
- [ ] Setiap item: ikon kategori, nama kategori, catatan (jika ada), nominal, waktu
- [ ] Expense ditampilkan merah, income hijau
- [ ] Filter: bulan (default bulan ini), kategori, tipe (income/expense/all)
- [ ] Infinite scroll (bukan pagination button)
- [ ] Empty state yang informatif jika belum ada transaksi
- [ ] Data ditampilkan dari IndexedDB dulu (offline-first), sync di background

---

## 6. Frontend Implementation

### 6.1 Components

```
components/features/
├── TransactionForm/
│   ├── TransactionForm.tsx       # Bottom sheet form
│   ├── TransactionForm.test.tsx
│   ├── useTransactionForm.ts     # Form logic hook
│   ├── AmountInput.tsx           # Numeric input dengan format Rupiah
│   ├── CategoryGrid.tsx          # Grid icon selector
│   └── index.ts
├── TransactionList/
│   ├── TransactionList.tsx       # Grouped list dengan infinite scroll
│   ├── TransactionItem.tsx       # Single transaction row (swipeable)
│   ├── TransactionFilters.tsx    # Filter bar (bulan, kategori, tipe)
│   └── index.ts
└── TransactionDetail/
    ├── TransactionDetail.tsx     # Edit modal (prefilled)
    └── index.ts
```

### 6.2 Zustand Store

```typescript
interface TransactionStore {
  // State
  pendingTransactions: LocalTransaction[];
  syncStatus: "idle" | "syncing" | "error";

  // Actions
  addTransaction: (tx: NewTransaction) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  syncPendingTransactions: () => Promise<void>;
}
```

### 6.3 React Query Hooks

```typescript
// hooks/useTransactions.ts
useTransactions(filters: TransactionFilters)     // GET with infinite query
useCreateTransaction()                            // POST mutation
useUpdateTransaction()                            // PUT mutation
useDeleteTransaction()                            // DELETE mutation
```

### 6.4 Sync Queue Logic

```typescript
// lib/sync/transactionSync.ts
// 1. Saat online: ambil semua records dengan syncStatus = "pending" dari IndexedDB
// 2. Batch ke POST /v1/transactions/batch (max 50 per request)
// 3. Update syncStatus ke "synced" untuk yang berhasil
// 4. Update syncStatus ke "failed" untuk yang gagal (retry nanti)
// 5. Gunakan Background Sync API jika tersedia
// 6. Fallback: sync saat app dibuka + periodic check setiap 30 detik
```

---

## 7. Backend Implementation

### 7.1 Repository

```typescript
// repositories/transactionRepository.ts
{
  findMany(userId: string, filters: TransactionFilters): Promise<PaginatedResult<Transaction>>
  findById(id: string, userId: string): Promise<Transaction | null>
  create(data: CreateTransactionData): Promise<Transaction>
  update(id: string, userId: string, data: UpdateTransactionData): Promise<Transaction>
  softDelete(id: string, userId: string): Promise<void>
  findByClientId(clientId: string): Promise<Transaction | null>
  batchCreate(operations: BatchOperation[]): Promise<BatchResult>
}
```

### 7.2 Service

```typescript
// services/transactionService.ts
{
  list(userId: string, filters: TransactionFilters): Promise<PaginatedResult<TransactionDTO>>
  create(userId: string, data: CreateTransactionInput): Promise<TransactionDTO>
  update(userId: string, id: string, data: UpdateTransactionInput): Promise<TransactionDTO>
  delete(userId: string, id: string): Promise<void>
  batchSync(userId: string, operations: BatchOperation[]): Promise<BatchResult>
}
```

---

## 8. Validation (Zod — shared)

```typescript
// packages/schemas/src/transaction.ts
export const createTransactionSchema = z.object({
  categoryId: z.string().cuid(),
  amountEncrypted: z.string().startsWith("enc:v1:"),
  amountCents: z.number().int().positive().max(999_999_999),
  type: z.enum(["INCOME", "EXPENSE"]),
  note: z.string().trim().max(200).optional(),
  transactionDate: z.string().datetime(),
  clientId: z.string().uuid(),
});

// Validasi tambahan di backend:
// - transactionDate tidak boleh > 1 tahun ke depan atau 10 tahun ke belakang
// - categoryId harus exist dan milik user atau default
// - userId SELALU dari session, TIDAK dari request body
```

---

## 9. Currency Formatting

```typescript
// utils/currency.ts
export function formatCurrency(amountCents: number): string {
  // 50000 -> "Rp 50.000"
  // 1500000 -> "Rp 1.500.000"
  // 0 -> "Rp 0"
  return `Rp ${amountCents.toLocaleString("id-ID")}`;
}

// Input parsing: strip non-numeric, parse to integer
export function parseCurrencyInput(input: string): number {
  return parseInt(input.replace(/\D/g, ""), 10) || 0;
}
```

---

## 10. Error Codes

| Code           | Deskripsi                                             |
| -------------- | ----------------------------------------------------- |
| VALIDATION_001 | Input tidak valid (sertakan field yang error)         |
| VALIDATION_002 | Amount harus > 0                                      |
| VALIDATION_003 | Tanggal tidak valid                                   |
| RESOURCE_001   | Transaksi tidak ditemukan                             |
| RESOURCE_002   | Akses ditolak (bukan milik user ini)                  |
| RESOURCE_003   | Konflik clientId (idempotent, return existing record) |

---

## 11. Rate Limiting

```typescript
"/api/transactions": { max: 100, timeWindow: "1 minute" }
```

---

## 12. Performance Requirements

| Metric                         | Target      |
| ------------------------------ | ----------- |
| Modal open time                | < 200ms     |
| Input -> save (user benchmark) | <= 10 detik |
| GET /v1/transactions (p95)     | <= 300ms    |
| POST /v1/transactions (p95)    | <= 500ms    |
| IndexedDB write                | < 50ms      |

---

## 13. Acceptance Criteria (PRD Level)

- [ ] Tambah transaksi berfungsi online dan offline
- [ ] Edit transaksi berfungsi dengan prefilled data
- [ ] Hapus transaksi (soft delete) dengan confirm dialog
- [ ] Riwayat transaksi dengan grouping per hari
- [ ] Filter bulan, kategori, tipe berfungsi
- [ ] Infinite scroll berfungsi
- [ ] Offline queue: data tersimpan lokal saat offline
- [ ] Sync otomatis saat kembali online
- [ ] Batch sync berfungsi (max 50 per request)
- [ ] Idempotency: duplicate clientId tidak membuat record baru
- [ ] Format Rupiah otomatis di input
- [ ] Keyboard numerik muncul otomatis
- [ ] Waktu input <= 10 detik (benchmark internal)
- [ ] Empty state informatif
- [ ] Sync status indicator (pending/synced) visible di UI
