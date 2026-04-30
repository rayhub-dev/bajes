"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface OnboardingStep {
  emoji: string;
  title: string;
  description: string;
  highlight: string;
}

const STEPS: OnboardingStep[] = [
  {
    emoji: "💸",
    title: "Catat Transaksi",
    description: "Tap tombol + di bawah buat catat pengeluaran atau pemasukan. Gak sampe 10 detik!",
    highlight: "Bisa offline juga loh!",
  },
  {
    emoji: "🎯",
    title: "Set Bajes (Budget)",
    description: "Tentuin limit pengeluaran per kategori. Biar lo gak boncos di akhir bulan.",
    highlight: "Dapet notif kalo mau limit!",
  },
  {
    emoji: "📊",
    title: "Pantau Dashboard",
    description: "Lihat ringkasan keuangan lo di dashboard. Chart, laporan, semua ada!",
    highlight: "Data lo aman & terenkripsi!",
  },
];

export default function OnboardingPage(): React.ReactElement {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const step = STEPS[currentStep] as OnboardingStep;

  const handleNext = (): void => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handleSkip = (): void => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      {/* Progress dots */}
      <div className="mb-8 flex gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 rounded-full border-2 border-bajes-black transition-all duration-300",
              i === currentStep
                ? "w-8 bg-bajes-yellow"
                : i < currentStep
                  ? "w-2 bg-bajes-black"
                  : "w-2 bg-gray-200",
            )}
          />
        ))}
      </div>

      {/* Step Content */}
      <Card className="w-full max-w-sm animate-bounce-in text-center" key={currentStep}>
        <span className="mb-4 block text-6xl">{step.emoji}</span>
        <h2 className="mb-2 font-display text-2xl font-bold uppercase">{step.title}</h2>
        <p className="mb-3 text-sm text-gray-600">{step.description}</p>
        <div className="inline-block rounded-lg border-2 border-bajes-black bg-bajes-yellow px-3 py-1.5 shadow-brutal-sm">
          <span className="text-xs font-bold uppercase">{step.highlight}</span>
        </div>
      </Card>

      {/* Actions */}
      <div className="mt-8 w-full max-w-sm space-y-3">
        <Button variant="primary" size="lg" fullWidth onClick={handleNext}>
          {currentStep < STEPS.length - 1 ? "Lanjut →" : "Mulai Sekarang! 🚀"}
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={handleSkip}>
          Skip aja deh
        </Button>
      </div>

      {/* Step counter */}
      <p className="mt-4 text-xs font-semibold text-gray-400">
        {currentStep + 1} / {STEPS.length}
      </p>
    </div>
  );
}
