/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import logoImg from "@/assets/logo.webp";

export default function LandingPage(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bajes-bg font-sans text-bajes-black selection:bg-bajes-yellow">
      {/* ===== DECORATIVE BACKGROUND ELEMENTS ===== */}
      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating geometric shapes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Top-right: yellow circle */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[3px] border-bajes-black bg-bajes-yellow opacity-20 md:h-80 md:w-80" />
        {/* Left: pink rectangle */}
        <div className="absolute -left-10 top-[30%] h-40 w-24 rotate-12 rounded-2xl border-[3px] border-bajes-black bg-bajes-pink opacity-[0.15] md:h-52 md:w-32" />
        {/* Bottom-right: green square */}
        <div className="absolute -right-8 bottom-[20%] h-36 w-36 -rotate-6 rounded-xl border-[3px] border-bajes-black bg-bajes-green opacity-[0.15] md:h-48 md:w-48" />
        {/* Center-left: blue circle */}
        <div className="absolute -left-20 bottom-[5%] h-48 w-48 rounded-full border-[3px] border-bajes-black bg-bajes-blue opacity-10 md:h-64 md:w-64" />
        {/* Top-left: small yellow square */}
        <div className="absolute left-[15%] top-[8%] h-12 w-12 rotate-45 rounded-lg border-[3px] border-bajes-black bg-bajes-yellow opacity-20 md:h-16 md:w-16" />
        {/* Mid-right: small pink circle */}
        <div className="absolute right-[10%] top-[45%] h-10 w-10 rounded-full border-[3px] border-bajes-black bg-bajes-pink opacity-20 md:h-14 md:w-14" />
      </div>

      {/* ===== CONTENT ===== */}
      <div className="relative z-10">
        {/* Navigation / Header */}
        <header className="mx-auto flex max-w-5xl animate-fade-in items-center justify-between p-4 md:p-6">
          <Link href="/" className="flex items-center gap-2">
            <img
              src={logoImg.src}
              alt="Bajes Logo"
              width={140}
              height={140}
              className="h-[60px] w-auto object-contain md:h-[72px]"
            />
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Masuk
            </Button>
          </Link>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-24 md:px-6">
          {/* Hero Section */}
          <section className="flex animate-bounce-in flex-col items-center space-y-8 pb-20 pt-12 text-center md:pb-32 md:pt-20">
            {/* Badge */}
            <div className="border-3 mb-4 inline-block rotate-2 rounded-full border-bajes-black bg-bajes-pink px-4 py-1 text-xs font-bold uppercase shadow-brutal-sm">
              🔥 Money Tracker Gen-Z
            </div>

            {/* Headline */}
            <h1 className="text-balance font-display text-5xl font-extrabold uppercase leading-[1.1] md:text-7xl">
              Catat Duit Lo,
              <br />
              <span className="mt-2 inline-block -rotate-1 bg-bajes-yellow px-3 py-1">
                Gak Pake Ribet 💸
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-muted mt-6 max-w-2xl text-balance text-lg font-medium md:text-xl">
              Money tracker buat lo yang anti boring. Bajes bikin lo aware sama pengeluaran tanpa
              bikin pusing. Akhir bulan aman, bestie!
            </p>

            {/* CTA Buttons */}
            <div className="flex w-full flex-col gap-4 pt-4 sm:w-auto sm:flex-row">
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full text-lg">
                  Mulai Sekarang
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full bg-white text-lg">
                  Coba Tanpa Akun
                </Button>
              </Link>
            </div>

            {/* Decorative arrow pointing down */}
            <div className="mt-8 animate-bounce text-3xl">↓</div>
          </section>

          {/* Features Section */}
          <section className="relative space-y-12 py-16">
            {/* Section decorative element */}
            <div className="absolute -left-4 top-8 hidden h-20 w-3 rounded-full bg-bajes-yellow md:block" />

            <div className="space-y-4 text-center">
              <div className="border-3 mx-auto mb-6 inline-block rounded-xl border-bajes-black bg-bajes-green px-5 py-2 shadow-brutal-sm">
                <h2 className="font-display text-3xl font-bold uppercase md:text-5xl">
                  Kenapa Pake Bajes?
                </h2>
              </div>
              <p className="text-muted text-lg">Fitur asik yang bikin keuangan lo makin slay.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Card 1 */}
              <Card
                variant="pink"
                className="transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="border-3 mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl border-bajes-black bg-white text-3xl shadow-brutal-sm">
                  📝
                </div>
                <h3 className="mb-2 font-display text-xl font-bold uppercase">Track Pengeluaran</h3>
                <p className="text-sm font-medium">
                  Catat jajan boba atau kopi lo dalam hitungan detik. Biar ketahuan duit lari ke
                  mana aja!
                </p>
              </Card>

              {/* Card 2 */}
              <Card
                variant="yellow"
                className="transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="border-3 mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl border-bajes-black bg-white text-3xl shadow-brutal-sm">
                  🎯
                </div>
                <h3 className="mb-2 font-display text-xl font-bold uppercase">Set Bajes Bulanan</h3>
                <p className="text-sm font-medium">
                  Atur limit jajan bulanan lo. Kalo udah mepet, kita ingetin biar gak boncos.
                </p>
              </Card>

              {/* Card 3 */}
              <Card
                variant="green"
                className="transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="border-3 mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl border-bajes-black bg-white text-3xl shadow-brutal-sm">
                  ⚡
                </div>
                <h3 className="mb-2 font-display text-xl font-bold uppercase">Offline-First PWA</h3>
                <p className="text-sm font-medium">
                  Gak ada kuota? Tenang! Lo tetep bisa nyatet tanpa internet. Install di HP kayak
                  aplikasi biasa.
                </p>
              </Card>
            </div>
          </section>

          {/* Social Proof / Fun Section */}
          <section className="relative py-16">
            {/* Decorative tape/sticker effect */}
            <div className="absolute -left-2 top-20 z-20 hidden -rotate-3 md:block">
              <div className="border-3 rounded-lg border-bajes-black bg-bajes-yellow px-3 py-1 font-display text-xs font-bold uppercase shadow-brutal-sm">
                Real talk 💯
              </div>
            </div>

            <Card
              variant="default"
              className="relative overflow-hidden !border-bajes-black !bg-bajes-blue !text-white"
            >
              <div className="relative z-10 space-y-6 p-8 text-center md:p-12">
                <h2 className="text-balance font-display text-3xl font-bold uppercase md:text-4xl">
                  &ldquo;Yah kosong... persis kayak dompet lo akhir bulan&rdquo;
                </h2>
                <p className="mx-auto max-w-lg font-medium text-white/90">
                  Stop overthinking pengeluaran. Biar Bajes yang mikirin, lo tinggal nabung buat
                  masa depan (atau buat konser K-Pop).
                </p>
              </div>
              {/* Decorative floating emojis */}
              <div className="pointer-events-none absolute right-0 top-0 -mr-10 -mt-10 rotate-12 select-none text-[10rem] opacity-20">
                💸
              </div>
              <div className="pointer-events-none absolute bottom-0 left-0 -mb-10 -ml-10 -rotate-12 select-none text-[10rem] opacity-20">
                📉
              </div>
              {/* Decorative corner shapes */}
              <div className="absolute -bottom-4 -right-4 h-16 w-16 rotate-12 rounded-lg border-[3px] border-white/30 bg-bajes-pink opacity-40" />
              <div className="absolute -left-4 -top-4 h-12 w-12 -rotate-6 rounded-full border-[3px] border-white/30 bg-bajes-green opacity-40" />
            </Card>
          </section>

          {/* Stats / Trust Section */}
          <section className="py-16">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              <div className="border-3 flex flex-col items-center rounded-2xl border-bajes-black bg-white p-5 shadow-brutal-sm">
                <span className="font-display text-3xl font-extrabold text-bajes-blue md:text-4xl">
                  100%
                </span>
                <span className="text-muted mt-1 text-center text-xs font-bold uppercase">
                  Gratis
                </span>
              </div>
              <div className="border-3 flex flex-col items-center rounded-2xl border-bajes-black bg-white p-5 shadow-brutal-sm">
                <span className="font-display text-3xl font-extrabold text-bajes-pink md:text-4xl">
                  PWA
                </span>
                <span className="text-muted mt-1 text-center text-xs font-bold uppercase">
                  Install di HP
                </span>
              </div>
              <div className="border-3 flex flex-col items-center rounded-2xl border-bajes-black bg-white p-5 shadow-brutal-sm">
                <span className="font-display text-3xl font-extrabold text-bajes-green md:text-4xl">
                  🔒
                </span>
                <span className="text-muted mt-1 text-center text-xs font-bold uppercase">
                  Data Aman
                </span>
              </div>
              <div className="border-3 flex flex-col items-center rounded-2xl border-bajes-black bg-white p-5 shadow-brutal-sm">
                <span className="font-display text-3xl font-extrabold md:text-4xl">⚡</span>
                <span className="text-muted mt-1 text-center text-xs font-bold uppercase">
                  Offline Ready
                </span>
              </div>
            </div>
          </section>
        </main>

        {/* Footer CTA */}
        <footer className="relative border-t-[3px] border-bajes-black bg-white px-6 py-12">
          {/* Footer decorative dots */}
          <div className="pointer-events-none absolute left-6 top-6 flex gap-2">
            <div className="h-3 w-3 rounded-full bg-bajes-yellow" />
            <div className="h-3 w-3 rounded-full bg-bajes-pink" />
            <div className="h-3 w-3 rounded-full bg-bajes-green" />
          </div>

          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold uppercase">
                Udah siap waras finansial?
              </h2>
              <p className="text-muted font-medium">Yok gabung bareng bestie lainnya.</p>
            </div>
            <Link href="/login">
              <Button variant="primary" size="lg" className="animate-wiggle">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
