# PRD-05: Dashboard & Monthly Reports

**Service:** Dashboard Utama, Laporan Bulanan, Charts, Summary  
**Priority:** P1  
**Dependencies:** PRD-01 (Foundation), PRD-02 (Auth), PRD-03 (Transactions)  
**Estimated Effort:** 1.5 minggu  
**Owner:** Frontend Engineer (lead) + Backend Engineer

---

## 1. Tujuan

Mengimplementasikan dashboard utama yang menampilkan kondisi keuangan user dalam 3 detik, dan laporan bulanan dengan chart dan insight untuk evaluasi pengeluaran. Data ditampilkan offline-first dari IndexedDB, dengan sync di background.

---

## 2. Scope

### In Scope

- Dashboard utama (hero card, summary, donut chart, transaksi terbaru)
- Laporan bulanan (summary, top kategori, bar chart harian, month-over-month)
- Navigasi bulan (bisa lihat bulan sebelumnya)
- Pull-to-refresh untuk force sync
- Export CSV (gated — return "Coming soon")

### Out of Scope

- Export PDF dengan grafik (Phase 2 — premium)
- Yearly report (Phase 2)
- AI-powered insights (Phase 2)
- Comparison dengan user lain (Phase 3)

---

## 3. API Endpoints

### 3.1 GET /v1/reports/summary

Ringkasan keuangan bulanan.

```typescript
// Query params
{
  year: number,
  month: number,   // 1-12
}

// Response (200)
{
  success: true,
  data: {
    totalIncome: number,      // Dalam cents (IDR)
    totalExpense: number,
    netBalance: number,       // totalIncome - totalExpense

    topExpenseCategories: Array<{
      category: CategoryDTO,
      totalCents: number,
      percentage: number,       // Persentase dari total expense
      transactionCount: number,
    }>,

    dailyTotals: Array<{
      date: string,             // "2026-04-01"
      totalIncomeCents: number,
      totalExpenseCents: number,
    }>,
  }
}
```

### 3.2 GET /v1/reports/export/csv

Export data ke CSV (gated untuk premium).

```typescript
// Query params
{ year: number, month: number }

// Response (402 Payment Required)
{
  success: false,
  error: {
    code: "PREMIUM_001",
    message: "Fitur premium — segera hadir"
  }
}
// MVP: selalu return 402, JANGAN return error 500
```

---

## 4. User Stories

### US-006: Dashboard Utama

```
SEBAGAI pengguna yang membuka aplikasi
SAYA INGIN langsung tahu kondisi keuangan bulan ini
AGAR saya bisa buat keputusan pengeluaran hari ini
```

**Acceptance Criteria:**

- [ ] **Hero Card — "Sisa Bulan Ini":**
  - Angka besar menampilkan sisa budget (total budget - total expense)
  - Indikator warna:
    - Aman (hijau): > 30% dari total budget tersisa
    - Hati-hati (kuning): 10-30% tersisa
    - Bahaya (merah): < 10% tersisa
  - Jika tidak ada budget: tampilkan net balance (income - expense)

- [ ] **Summary Card:**
  - Total Pemasukan bulan ini (hijau)
  - Total Pengeluaran bulan ini (merah)
  - Layout: side-by-side, compact

- [ ] **Donut/Pie Chart:**
  - Top 5 kategori pengeluaran + "Lainnya"
  - Warna sesuai kategori color
  - Tap segment -> tampilkan detail (nama + nominal + persentase)

- [ ] **Transaksi Terbaru:**
  - 5 transaksi terakhir
  - Tap "Lihat semua" -> navigasi ke halaman riwayat transaksi

- [ ] **General:**
  - Dashboard load dalam < 1.5 detik (dari cache lokal)
  - Data dari IndexedDB dulu (offline-first), sync di background
  - Pull-to-refresh untuk force sync
  - Tampilkan bulan/tahun yang sedang dilihat + navigator bulan (< >)

**UX Specifications:**

- Layout: single column, scrollable
- Hero card: full width, prominent, di paling atas
- Summary card: di bawah hero card
- Chart: di bawah summary, height ~200px
- Transaksi terbaru: di bawah chart, compact list
- Month navigator: di header, tap < > untuk ganti bulan

---

### US-009: Laporan Ringkasan

```
SEBAGAI pengguna aktif
SAYA INGIN lihat ringkasan keuangan bulan ini
AGAR saya bisa evaluasi dan perbaiki bulan depan
```

**Acceptance Criteria:**

- [ ] **Summary Section:**
  - Total income, total expense, net balance
  - Angka besar, jelas, dengan warna (hijau/merah)

- [ ] **Top 3 Kategori Pengeluaran:**
  - Nama kategori + ikon
  - Nominal (format Rupiah)
  - Persentase dari total expense
  - Horizontal bar chart per kategori

- [ ] **Bar Chart Harian:**
  - Pengeluaran harian sepanjang bulan
  - X-axis: tanggal (1-31)
  - Y-axis: nominal
  - Tap bar -> tooltip dengan detail

- [ ] **Month-over-Month:**
  - Perbandingan total expense vs bulan lalu
  - Format: "Rp X (+Y% dari bulan lalu)" atau "(-Y%)"
  - Warna: merah jika naik, hijau jika turun

- [ ] **Navigasi Bulan:**
  - Bisa lihat bulan-bulan sebelumnya
  - Tidak bisa lihat bulan depan (belum ada data)

- [ ] **Export CSV:**
  - Tombol "Export CSV" tersedia
  - Saat di-tap: tampilkan message "Fitur premium — segera hadir"
  - JANGAN tampilkan error/crash

- [ ] **Performance:**
  - Laporan ter-generate < 2 detik

---

## 5. Frontend Implementation

### 5.1 Pages

```
app/(app)/
├── dashboard/
│   └── page.tsx              # Dashboard utama (default landing setelah login)
├── report/
│   └── page.tsx              # Laporan bulanan
```

### 5.2 Components

```
components/features/
├── Dashboard/
│   ├── HeroCard.tsx           # "Sisa Bulan Ini" dengan indikator warna
│   ├── SummaryCard.tsx        # Income vs Expense side-by-side
│   ├── ExpenseDonutChart.tsx  # Recharts donut chart top 5 kategori
│   ├── RecentTransactions.tsx # 5 transaksi terakhir + "Lihat semua"
│   ├── MonthNavigator.tsx     # < April 2026 > header
│   └── index.ts
├── Report/
│   ├── ReportSummary.tsx      # Total income/expense/net
│   ├── TopCategories.tsx      # Top 3 kategori + horizontal bars
│   ├── DailyExpenseChart.tsx  # Recharts bar chart harian
│   ├── MonthComparison.tsx    # Month-over-month comparison
│   ├── ExportButton.tsx       # "Export CSV" (gated)
│   └── index.ts
```

### 5.3 Charts (Recharts)

```typescript
// Dynamic import untuk code splitting (chart library besar)
const ExpenseDonutChart = dynamic(
  () => import("@/components/features/Dashboard/ExpenseDonutChart"),
  { loading: () => <ChartSkeleton />, ssr: false }
);

const DailyExpenseChart = dynamic(
  () => import("@/components/features/Report/DailyExpenseChart"),
  { loading: () => <ChartSkeleton />, ssr: false }
);
```

### 5.4 React Query Hooks

```typescript
// hooks/useReportSummary.ts
useReportSummary(year: number, month: number)

// Caching strategy:
// - staleTime: 5 menit (data tidak berubah terlalu sering)
// - Invalidate saat transaksi baru ditambahkan
// - Prefetch bulan sebelumnya saat user navigasi
```

### 5.5 Offline-First Dashboard

```typescript
// Dashboard data flow:
// 1. Buka dashboard -> load dari IndexedDB (instant)
// 2. Hitung summary dari local transactions
// 3. Background: fetch dari server via React Query
// 4. Jika server data berbeda -> update IndexedDB + re-render
// 5. Pull-to-refresh: force invalidate + refetch
```

---

## 6. Backend Implementation

### 6.1 Report Service

```typescript
// services/reportService.ts
{
  getMonthlySummary(userId: string, year: number, month: number): Promise<MonthlySummary>
  getMonthComparison(userId: string, year: number, month: number): Promise<MonthComparison>
}
```

### 6.2 Query Optimization

```typescript
// Aggregation query untuk summary:
// - SUM(amount_cents) GROUP BY type -> total income & expense
// - SUM(amount_cents) GROUP BY category_id WHERE type = 'EXPENSE' -> top categories
// - SUM(amount_cents) GROUP BY DATE(transaction_date) -> daily totals

// Caching:
// - Cache result di Redis (Upstash) selama 5 menit
// - Cache key: `report:${userId}:${year}:${month}`
// - Invalidate saat transaksi baru di-create/update/delete
```

---

## 7. Rate Limiting

```typescript
"/api/reports": { max: 10, timeWindow: "1 minute" }
// Report generation relatif berat, limit lebih ketat
```

---

## 8. Performance Requirements

| Metric                        | Target    |
| ----------------------------- | --------- |
| Dashboard load (from cache)   | < 1.5s    |
| GET /v1/reports/summary (p95) | <= 2000ms |
| Chart render time             | < 500ms   |
| Month navigation (cached)     | < 300ms   |

---

## 9. Acceptance Criteria (PRD Level)

- [ ] Dashboard menampilkan hero card dengan sisa budget + indikator warna
- [ ] Summary card menampilkan income vs expense akurat
- [ ] Donut chart menampilkan top 5 kategori pengeluaran
- [ ] Transaksi terbaru (5 item) tampil di dashboard
- [ ] "Lihat semua" navigasi ke halaman riwayat
- [ ] Dashboard load < 1.5 detik dari cache
- [ ] Pull-to-refresh berfungsi
- [ ] Month navigator berfungsi (< >)
- [ ] Laporan bulanan: summary, top 3 kategori, bar chart harian
- [ ] Month-over-month comparison tampil akurat
- [ ] Export CSV menampilkan "Fitur premium — segera hadir" (bukan error)
- [ ] Laporan ter-generate < 2 detik
- [ ] Data offline-first: tampil dari IndexedDB, sync di background
- [ ] Charts di-lazy load (dynamic import)
