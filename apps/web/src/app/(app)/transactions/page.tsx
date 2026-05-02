"use client";

import { useState } from "react";
import { MonthNavigator } from "@/components/layouts/MonthNavigator";
import { TransactionList } from "@/components/features/TransactionList/TransactionList";
import {
  TransactionFilters,
  type FilterType,
} from "@/components/features/TransactionList/TransactionFilters";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteTransaction } from "@/hooks/useTransactions";

export default function TransactionsPage(): React.ReactElement {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteMutation = useDeleteTransaction();

  const startDate = `${year}-${String(month).padStart(2, "0")}-01T00:00:00.000Z`;
  const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

  const filters = {
    startDate,
    endDate,
    ...(filterType !== "ALL" ? { type: filterType as "INCOME" | "EXPENSE" } : {}),
  };

  const handleDelete = (): void => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-5 md:px-6 lg:px-8 lg:py-8">
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-xl font-bold uppercase lg:text-2xl">Riwayat Transaksi</h1>
        <MonthNavigator
          year={year}
          month={month}
          onChange={(y, m) => {
            setYear(y);
            setMonth(m);
          }}
        />
      </div>

      {/* Filters */}
      <TransactionFilters activeType={filterType} onTypeChange={setFilterType} />

      {/* Transaction List — constrained width for readability on large screens */}
      <div className="max-w-3xl">
        <TransactionList
          filters={filters}
          onItemTap={(id) => console.log("Edit:", id)}
          onItemDelete={(id) => setDeleteId(id)}
        />
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Hapus Transaksi?"
        message="Yakin mau hapus transaksi ini? Data yang udah dihapus gak bisa balik lagi."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
