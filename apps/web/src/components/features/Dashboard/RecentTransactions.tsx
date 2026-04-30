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

const MOCK_RECENT: RecentTransaction[] = [
  {
    id: "1",
    categoryIcon: "🍜",
    categoryName: "Makanan",
    categoryColor: "#FF6B6B",
    note: "Makan siang Warteg",
    amountCents: 25000,
    type: "EXPENSE",
    time: "12:30",
    syncStatus: "synced",
  },
  {
    id: "2",
    categoryIcon: "🚗",
    categoryName: "Transport",
    categoryColor: "#4ECDC4",
    note: "Grab ke kantor",
    amountCents: 35000,
    type: "EXPENSE",
    time: "08:15",
    syncStatus: "pending",
  },
  {
    id: "3",
    categoryIcon: "💼",
    categoryName: "Gaji",
    categoryColor: "#6BCB77",
    amountCents: 5000000,
    type: "INCOME",
    time: "07:00",
    syncStatus: "synced",
  },
  {
    id: "4",
    categoryIcon: "🎮",
    categoryName: "Hiburan",
    categoryColor: "#FFEAA7",
    note: "Netflix",
    amountCents: 54000,
    type: "EXPENSE",
    time: "Kemarin",
    syncStatus: "synced",
  },
  {
    id: "5",
    categoryIcon: "🛍️",
    categoryName: "Belanja",
    categoryColor: "#45B7D1",
    note: "Skincare",
    amountCents: 150000,
    type: "EXPENSE",
    time: "Kemarin",
    syncStatus: "synced",
  },
];

interface RecentTransactionsProps {
  transactions?: RecentTransaction[];
}

function RecentTransactions({
  transactions = MOCK_RECENT,
}: RecentTransactionsProps): React.ReactElement {
  return (
    <Card noPadding>
      <div className="flex items-center justify-between px-5 pb-2 pt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Transaksi Terbaru
        </p>
        <Link
          href="/transactions"
          className="flex items-center gap-0.5 text-xs font-bold uppercase tracking-wider text-bajes-blue hover:underline"
        >
          Lihat semua
          <ChevronRight size={14} strokeWidth={3} />
        </Link>
      </div>

      <div className="divide-y divide-gray-100 px-4 pb-3">
        {transactions.map((tx) => (
          <TransactionItem key={tx.id} {...tx} />
        ))}
      </div>
    </Card>
  );
}

export { RecentTransactions };
