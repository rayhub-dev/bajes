"use client";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

interface ReportSummaryProps {
  totalIncomeCents: number;
  totalExpenseCents: number;
}

function ReportSummary({
  totalIncomeCents,
  totalExpenseCents,
}: ReportSummaryProps): React.ReactElement {
  const netBalance = totalIncomeCents - totalExpenseCents;
  const isPositive = netBalance >= 0;

  return (
    <Card>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
        Ringkasan Bulan Ini
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600">Total Pemasukan</span>
          <span className="font-display font-bold text-green-600">
            +{formatCurrency(totalIncomeCents)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600">Total Pengeluaran</span>
          <span className="font-display font-bold text-bajes-red">
            -{formatCurrency(totalExpenseCents)}
          </span>
        </div>

        <div className="h-[3px] rounded-full bg-bajes-black" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">Net Balance</span>
          <span
            className={cn(
              "font-display text-xl font-bold",
              isPositive ? "text-green-600" : "text-bajes-red",
            )}
          >
            {isPositive ? "+" : "-"}
            {formatCurrency(Math.abs(netBalance))}
          </span>
        </div>
      </div>
    </Card>
  );
}

export { ReportSummary };
