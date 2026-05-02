"use client";

import { Card } from "@/components/ui/Card";
import { TransactionItem } from "@/components/features/TransactionList/TransactionItem";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface RecentTransaction {
  id: string;
  categoryIcon: string;
  categoryName: string;
  categoryColor: string;
  note?: string;
  amountCents: number;
  type: "INCOME" | "EXPENSE";
  time: string;
  syncStatus: "synced" | "pending" | "failed";
}

interface RecentTransactionsProps {
  transactions?: RecentTransaction[];
}

function RecentTransactions({ transactions = [] }: RecentTransactionsProps): React.ReactElement {
  return (
    <Card noPadding>
      <div className="flex items-center justify-between px-5 pb-2 pt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Transaksi Terbaru
        </p>
        <Link
          href="/transactions"
          className="flex items-center gap-0.5 text-xs font-bold uppercase tracking-wider text-bajes-blue hover:underline dark:text-blue-400"
        >
          Lihat semua
          <ChevronRight size={14} strokeWidth={3} />
        </Link>
      </div>

      <div className="divide-y divide-gray-100 px-4 pb-3 dark:divide-white/10">
        {transactions.length === 0 ? (
          <p className="py-6 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
            Belum ada transaksi bulan ini
          </p>
        ) : (
          transactions.map((tx) => <TransactionItem key={tx.id} {...tx} />)
        )}
      </div>
    </Card>
  );
}

export { RecentTransactions };
