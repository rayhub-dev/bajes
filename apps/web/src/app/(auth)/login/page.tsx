"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/supabase/auth";
import { apiClient } from "@/lib/api/client";
import logoImg from "@/assets/logo.webp";

export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        setSuccessMessage("Cek email lo buat verifikasi akun! 📧");
        setLoading(false);
        return;
      }

      const { session } = await signInWithEmail(email, password);
      if (session) {
        try {
          await apiClient.get("/v1/auth/me", {
            headers: { Authorization: `Bearer ${session.access_token}` },
            timeout: 10000,
          });
        } catch {
          console.warn("Failed to provision user, will retry via AuthProvider");
        }
        document.cookie = "bajes-authenticated=true; Path=/; SameSite=Lax";
        document.cookie = "bajes-guest-mode=; Path=/; Max-Age=0; SameSite=Lax";
      }
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google login gagal";
      setError(message);
    }
  };

  const handleGuestMode = (): void => {
    localStorage.setItem("bajes-guest-mode", "true");
    document.cookie = "bajes-guest-mode=true; Path=/; SameSite=Lax";
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      {/* Decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[3px] border-bajes-black bg-bajes-yellow opacity-20" />
        <div className="absolute -left-16 bottom-[20%] h-48 w-48 rotate-12 rounded-2xl border-[3px] border-bajes-black bg-bajes-pink opacity-[0.15]" />
        <div className="absolute -bottom-16 right-[10%] h-40 w-40 -rotate-6 rounded-xl border-[3px] border-bajes-black bg-bajes-green opacity-[0.15]" />
        <div className="absolute left-[10%] top-[15%] h-10 w-10 rotate-45 rounded-lg border-[3px] border-bajes-black bg-bajes-blue opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo & Branding */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <div className="border-3 mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl border-bajes-black bg-white shadow-brutal">
              <img
                src={logoImg.src}
                alt="Bajes Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
            </div>
          </Link>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Bajes</h1>
          <p className="mt-1 text-sm font-medium text-[#4b5563]">Money tracker buat Gen-Z 🔥</p>
        </div>

        {/* Login Card */}
        <Card className="w-full">
          <div className="space-y-4">
            {/* Welcome text */}
            <div className="mb-2 text-center">
              <h2 className="font-display text-xl font-bold uppercase">
                {isSignUp ? "Buat Akun 🚀" : "Halo Bestie! 👋"}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#4b5563]">
                {isSignUp
                  ? "Daftar dulu biar data lo aman"
                  : "Yuk mulai catat keuangan lo biar gak boncos terus"}
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="border-3 rounded-xl border-bajes-red bg-red-50 p-3 text-sm font-semibold text-bajes-red">
                ⚠️ {error}
              </div>
            )}
            {successMessage && (
              <div className="border-3 rounded-xl border-bajes-green bg-green-50 p-3 text-sm font-semibold text-green-700">
                ✅ {successMessage}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Email lo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-brutal"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password (min 6 karakter)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input-brutal"
                />
              </div>
              <Button variant="primary" size="lg" fullWidth disabled={loading}>
                {loading ? "Loading..." : isSignUp ? "Daftar" : "Login"}
              </Button>
            </form>

            {/* Toggle Sign Up / Login */}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccessMessage(null);
              }}
              className="w-full text-center text-sm font-bold text-[#4b5563] transition-colors hover:text-bajes-black"
            >
              {isSignUp ? "Udah punya akun? Login" : "Belum punya akun? Daftar"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-[3px] flex-1 rounded-full bg-bajes-black/10" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#4b5563]">
                atau
              </span>
              <div className="h-[3px] flex-1 rounded-full bg-bajes-black/10" />
            </div>

            {/* Google SSO Button */}
            <Button variant="outline" size="lg" fullWidth onClick={handleGoogleLogin}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Login dengan Google
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-[3px] flex-1 rounded-full bg-bajes-black/10" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#4b5563]">
                atau
              </span>
              <div className="h-[3px] flex-1 rounded-full bg-bajes-black/10" />
            </div>

            {/* Guest Mode */}
            <Button variant="outline" size="lg" fullWidth onClick={handleGuestMode}>
              Coba Tanpa Akun 👀
            </Button>

            <p className="mt-2 text-center text-[10px] font-medium text-[#6b7280]">
              Guest mode: max 10 transaksi, data di device lo aja.
              <br />
              Buat akun kapan aja buat sync &amp; backup.
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-[10px] font-medium text-[#6b7280]">
          Dengan login, lo setuju sama{" "}
          <span className="cursor-pointer font-bold underline hover:text-bajes-black">
            Terms of Service
          </span>{" "}
          &amp;{" "}
          <span className="cursor-pointer font-bold underline hover:text-bajes-black">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
}
