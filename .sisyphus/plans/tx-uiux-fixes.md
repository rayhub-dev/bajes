## TODOs

- [x] T1: Tambah white space antara tombol arrow nav dan teks judul di page transaksi.
- [x] T2: Perbaiki keterangan waktu di bawah nominal agar menampilkan tanggal + waktu transaksi dibuat (bukan `07.00` statis/bug).
- [x] T3: Rapikan modal add transaksi dengan menghapus class `pb-safe` dan mengatur ulang padding atas-bawah agar proporsional.
- [x] T4: Styling kalender pada modal mengikuti theme BAJES + tambah opsi atur waktu dengan default tanggal-waktu `now()`.

## Final Verification Wave

- [x] F1: LSP diagnostics clean pada semua file TS/TSX yang berubah.
- [x] F2: `pnpm --filter @bajes/web type-check` lulus.
- [x] F3: `pnpm --filter @bajes/web build` lulus.
- [ ] F4: Hands-on QA alur transaksi: spacing nav-title benar, metadata tanggal+waktu benar, modal padding rapi, kalender bertema BAJES, input waktu tersedia default now.
