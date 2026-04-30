"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function ShareTargetContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amount = searchParams.get("amount") || searchParams.get("text") || "";

  useEffect(() => {
    // Redirect to dashboard with amount prefilled
    // The dashboard will detect the query param and open the transaction form
    if (amount) {
      router.replace(`/dashboard?prefill_amount=${encodeURIComponent(amount)}`);
    } else {
      router.replace("/dashboard");
    }
  }, [amount, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bajes-bg">
      <div className="text-center">
        <span className="mb-2 block text-4xl">💰</span>
        <p className="font-display font-bold uppercase">Memproses...</p>
      </div>
    </div>
  );
}

export default function ShareTargetPage(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bajes-bg">
          <p className="font-display font-bold uppercase">Loading...</p>
        </div>
      }
    >
      <ShareTargetContent />
    </Suspense>
  );
}
