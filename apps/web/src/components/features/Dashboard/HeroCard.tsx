"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

interface HeroCardProps {
  remainingCents: number;
  totalBudgetCents: number;
  hasBudget: boolean;
  totalIncomeCents?: number;
  totalExpenseCents?: number;
}

function getStatusInfo(
  remaining: number,
  total: number,
): { label: string; emoji: string; variant: "green" | "yellow" | "red" } {
  if (total === 0) return { label: "Belum ada bajes", emoji: "🤷", variant: "yellow" };
  const pct = (remaining / total) * 100;
  if (pct > 30) return { label: "Aman", emoji: "😎", variant: "green" };
  if (pct > 10) return { label: "Hati-hati", emoji: "😬", variant: "yellow" };
  return { label: "Bahaya!", emoji: "🔥", variant: "red" };
}

function HeroCard({
  remainingCents,
  totalBudgetCents,
  hasBudget,
  totalIncomeCents = 0,
  totalExpenseCents = 0,
}: HeroCardProps): React.ReactElement {
  const status = getStatusInfo(remainingCents, totalBudgetCents);
  const displayAmount = hasBudget ? remainingCents : totalIncomeCents - totalExpenseCents;
  const isNegative = displayAmount < 0;

  return (
    <Card className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-bajes-yellow/20" />
      <div className="absolute -bottom-8 -right-2 h-16 w-16 rounded-full bg-bajes-pink/20" />

      <div className="relative">
        <div className="mb-1 flex items-start justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {hasBudget ? "Sisa Bajes Lo" : "Balance Bulan Ini"}
          </p>
          <Badge variant={status.variant}>
            {status.label} {status.emoji}
          </Badge>
        </div>

        <h1
          className={cn(
            "mt-2 font-display text-4xl font-bold",
            isNegative ? "text-bajes-red" : "text-bajes-black",
          )}
        >
          {isNegative && "-"}
          {formatCurrency(Math.abs(displayAmount))}
        </h1>

        {hasBudget && (
          <p className="mt-1 text-xs font-semibold text-gray-500">
            dari total bajes {formatCurrency(totalBudgetCents)}
          </p>
        )}
      </div>
    </Card>
  );
}

export { HeroCard };
