"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/supabase/auth";
import { apiClient } from "@/lib/api/client";

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
        // Provision user in DB with timeout
        try {
          await apiClient.get("/v1/auth/me", {
            headers: { Authorization: `Bearer ${session.access_token}` },
            timeout: 10000,
          });
        } catch {
          // API might be down — still allow navigation since Supabase auth succeeded
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
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      {/* Logo & Branding */}
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-bajes-black bg-bajes-yellow shadow-brutal-lg">
          <span className="text-4xl">💰</span>
        </div>
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Bajes</h1>
        <p className="mt-1 font-sans text-sm text-gray-500">Money tracker buat Gen-Z 🔥</p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-sm">
        <div className="space-y-4">
          {/* Welcome text */}
          <div className="mb-2 text-center">
            <h2 className="font-display text-xl font-bold uppercase">
              {isSignUp ? "Buat Akun 🚀" : "Halo Bestie! 👋"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isSignUp
                ? "Daftar dulu biar data lo aman"
                : "Yuk mulai catat keuangan lo biar gak boncos terus"}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="rounded-lg border-2 border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="rounded-lg border-2 border-green-300 bg-green-50 p-3 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-900/20 dark:text-green-400">
              {successMessage}
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
                className="w-full rounded-xl border-2 border-bajes-black bg-white px-4 py-3 text-sm font-semibold text-bajes-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bajes-yellow dark:border-white/20 dark:bg-bajes-surface-dark dark:text-white dark:placeholder:text-gray-500"
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
                className="w-full rounded-xl border-2 border-bajes-black bg-white px-4 py-3 text-sm font-semibold text-bajes-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-bajes-yellow dark:border-white/20 dark:bg-bajes-surface-dark dark:text-white dark:placeholder:text-gray-500"
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
            className="w-full text-center text-sm font-semibold text-gray-500 hover:text-bajes-black dark:text-gray-400 dark:hover:text-white"
          >
            {isSignUp ? "Udah punya akun? Login" : "Belum punya akun? Daftar"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-[2px] flex-1 bg-gray-200 dark:bg-white/10" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">atau</span>
            <div className="h-[2px] flex-1 bg-gray-200 dark:bg-white/10" />
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
            <div className="h-[2px] flex-1 bg-gray-200 dark:bg-white/10" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">atau</span>
            <div className="h-[2px] flex-1 bg-gray-200 dark:bg-white/10" />
          </div>

          {/* Guest Mode */}
          <Button variant="outline" size="lg" fullWidth onClick={handleGuestMode}>
            Coba Tanpa Akun 👀
          </Button>

          <p className="mt-2 text-center text-[10px] text-gray-400">
            Guest mode: max 10 transaksi, data di device lo aja.
            <br />
            Buat akun kapan aja buat sync & backup.
          </p>
        </div>
      </Card>

      {/* Footer */}
      <p className="mt-8 text-center text-[10px] text-gray-400">
        Dengan login, lo setuju sama{" "}
        <span className="cursor-pointer underline hover:text-gray-600 dark:hover:text-gray-300">
          Terms of Service
        </span>{" "}
        &{" "}
        <span className="cursor-pointer underline hover:text-gray-600 dark:hover:text-gray-300">
          Privacy Policy
        </span>
      </p>
    </div>
  );
}
