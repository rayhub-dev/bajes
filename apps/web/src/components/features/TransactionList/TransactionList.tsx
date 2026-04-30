"use client";

import { TransactionItem } from "./TransactionItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

interface TransactionGroup {
  date: string;
  dateLabel: string;
  transactions: Array<{
    id: string;
    categoryIcon: string;
    categoryName: string;
    categoryColor: string;
    note?: string;
    amountCents: number;
    type: "INCOME" | "EXPENSE";
    time: string;
    syncStatus: "synced" | "pending" | "failed";
  }>;
}

// Mock data for UI preview
const MOCK_GROUPS: TransactionGroup[] = [
  {
    date: "2026-04-30",
    dateLabel: "Hari Ini",
    transactions: [
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
    ],
  },
  {
    date: "2026-04-29",
    dateLabel: "Kemarin",
    transactions: [
      {
        id: "4",
        categoryIcon: "🎮",
        categoryName: "Hiburan",
        categoryColor: "#FFEAA7",
        note: "Netflix",
        amountCents: 54000,
        type: "EXPENSE",
        time: "20:00",
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
        time: "15:30",
        syncStatus: "synced",
      },
    ],
  },
  {
    date: "2026-04-28",
    dateLabel: "28 April",
    transactions: [
      {
        id: "6",
        categoryIcon: "📱",
        categoryName: "Tagihan",
        categoryColor: "#96CEB4",
        note: "Pulsa",
        amountCents: 50000,
        type: "EXPENSE",
        time: "10:00",
        syncStatus: "synced",
      },
      {
        id: "7",
        categoryIcon: "💻",
        categoryName: "Freelance",
        categoryColor: "#4D96FF",
        note: "Project web",
        amountCents: 2500000,
        type: "INCOME",
        time: "09:00",
        syncStatus: "synced",
      },
    ],
  },
];

interface TransactionListProps {
  groups?: TransactionGroup[];
  onItemTap?: (id: string) => void;
  onItemDelete?: (id: string) => void;
}

function TransactionList({
  groups = MOCK_GROUPS,
  onItemTap,
  onItemDelete,
}: TransactionListProps): React.ReactElement {
  if (groups.length === 0) {
    return (
      <EmptyState
        icon="🫠"
        title="Belum ada transaksi"
        description="Yah kosong... persis kayak dompet lo akhir bulan. Yuk mulai catat!"
        action={
          <Button variant="primary" size="md">
            + Tambah Sekarang
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.date}>
          {/* Date Header */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {group.dateLabel}
            </span>
            <div className="h-[2px] flex-1 bg-gray-200" />
          </div>

          {/* Transactions */}
          <div className="divide-y divide-gray-100">
            {group.transactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                {...tx}
                onTap={() => onItemTap?.(tx.id)}
                onDelete={() => onItemDelete?.(tx.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { TransactionList, type TransactionGroup };
