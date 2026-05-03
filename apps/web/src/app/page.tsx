import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LandingPage(): React.ReactElement {
  return (
    <div className="min-h-screen overflow-x-hidden bg-bajes-bg font-sans text-bajes-black selection:bg-bajes-yellow">
      {/* Navigation / Header */}
      <header className="mx-auto flex max-w-5xl animate-fade-in items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.webp" alt="Bajes Logo" width={40} height={40} priority />
          <span className="font-display text-xl font-bold uppercase tracking-tight">Bajes</span>
        </div>
        <Link href="/login">
          <Button variant="outline" size="sm">
            Masuk
          </Button>
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 md:px-6">
        {/* Hero Section */}
        <section className="flex animate-bounce-in flex-col items-center space-y-8 pb-20 pt-12 text-center md:pb-32 md:pt-20">
          <div className="border-3 mb-4 inline-block rotate-2 rounded-full border-bajes-black bg-bajes-pink px-4 py-1 text-xs font-bold uppercase shadow-brutal-sm">
            🔥 Money Tracker Gen-Z
          </div>
          <h1 className="text-balance font-display text-5xl font-extrabold uppercase leading-[1.1] md:text-7xl">
            Catat Duit Lo,
            <br />
            <span className="mt-2 inline-block -rotate-1 bg-bajes-yellow px-2">
              Gak Pake Ribet 💸
            </span>
          </h1>
          <p className="text-muted mt-6 max-w-2xl text-balance text-lg font-medium md:text-xl">
            Money tracker buat lo yang anti boring. Bajes bikin lo aware sama pengeluaran tanpa
            bikin pusing. Akhir bulan aman, bestie!
          </p>
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
        </section>

        {/* Features Section */}
        <section className="space-y-12 py-16">
          <div className="space-y-4 text-center">
            <h2 className="font-display text-3xl font-bold uppercase md:text-5xl">
              Kenapa Pake Bajes?
            </h2>
            <p className="text-muted">Fitur asik yang bikin keuangan lo makin slay.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card variant="pink" className="transition-transform duration-300 hover:-translate-y-2">
              <div className="mb-4 text-4xl">📝</div>
              <h3 className="mb-2 font-display text-xl font-bold uppercase">Track Pengeluaran</h3>
              <p className="text-sm font-medium">
                Catat jajan boba atau kopi lo dalam hitungan detik. Biar ketahuan duit lari ke mana
                aja!
              </p>
            </Card>

            <Card
              variant="yellow"
              className="transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="mb-2 font-display text-xl font-bold uppercase">Set Bajes Bulanan</h3>
              <p className="text-sm font-medium">
                Atur limit jajan bulanan lo. Kalo udah mepet, kita ingetin biar gak boncos.
              </p>
            </Card>

            <Card
              variant="green"
              className="transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="mb-2 font-display text-xl font-bold uppercase">Offline-First PWA</h3>
              <p className="text-sm font-medium">
                Gak ada kuota? Tenang! Lo tetep bisa nyatet tanpa internet. Install di HP kayak
                aplikasi biasa.
              </p>
            </Card>
          </div>
        </section>

        {/* Social Proof / Fun Section */}
        <section className="py-16">
          <Card
            variant="default"
            className="relative overflow-hidden !border-bajes-black !bg-bajes-blue !text-white"
          >
            <div className="relative z-10 space-y-6 p-8 text-center md:p-12">
              <h2 className="text-balance font-display text-3xl font-bold uppercase md:text-4xl">
                &ldquo;Yah kosong... persis kayak dompet lo akhir bulan&rdquo;
              </h2>
              <p className="mx-auto max-w-lg font-medium text-white/90">
                Stop overthinking pengeluaran. Biar Bajes yang mikirin, lo tinggal nabung buat masa
                depan (atau buat konser K-Pop).
              </p>
            </div>
            <div className="pointer-events-none absolute right-0 top-0 -mr-10 -mt-10 rotate-12 select-none text-[10rem] opacity-20">
              💸
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 -mb-10 -ml-10 -rotate-12 select-none text-[10rem] opacity-20">
              📉
            </div>
          </Card>
        </section>
      </main>

      {/* Footer CTA */}
      <footer className="border-t-[3px] border-bajes-black bg-white px-6 py-12">
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
  );
}
