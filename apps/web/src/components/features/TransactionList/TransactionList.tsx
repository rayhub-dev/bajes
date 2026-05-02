"use client";

import { useMemo } from "react";
import { TransactionItem } from "./TransactionItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ListItemSkeleton } from "@/components/ui/Skeleton";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuthStore } from "@/store/auth";
import type { TransactionFilters } from "@bajes/schemas";

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

interface TransactionListProps {
  filters?: Partial<TransactionFilters>;
  onItemTap?: (id: string) => void;
  onItemDelete?: (id: string) => void;
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() === today.getTime()) return "Hari Ini";
  if (date.getTime() === yesterday.getTime()) return "Kemarin";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long" });
}

function TransactionList({
  filters = {},
  onItemTap,
  onItemDelete,
}: TransactionListProps): React.ReactElement {
  const { data: response, isLoading } = useTransactions(filters);
  const { isInitializing } = useAuthStore();
  const transactions = useMemo(() => response?.data ?? [], [response?.data]);

  const groups: TransactionGroup[] = useMemo(() => {
    const map = new Map<string, TransactionGroup>();

    for (const tx of transactions) {
      const dateKey = tx.transactionDate.split("T")[0] ?? tx.transactionDate;
      if (!map.has(dateKey)) {
        map.set(dateKey, {
          date: dateKey,
          dateLabel: formatDateLabel(dateKey),
          transactions: [],
        });
      }
      map.get(dateKey)!.transactions.push({
        id: tx.id,
        categoryIcon: tx.category.icon,
        categoryName: tx.category.name,
        categoryColor: tx.category.color,
        note: tx.note ?? undefined,
        amountCents: tx.amountCents,
        type: tx.type,
        time: new Date(tx.createdAt)
          .toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(" pukul", ","),
        syncStatus: "synced",
      });
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [transactions]);

  if (isLoading || isInitializing) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    );
  }

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
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {group.dateLabel}
            </span>
            <div className="h-[2px] flex-1 bg-gray-200 dark:bg-white/10" />
          </div>

          {/* Transactions */}
          <div className="divide-y divide-gray-100 dark:divide-white/10">
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
