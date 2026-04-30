"use client";

import { useState } from "react";
import { MonthNavigator } from "@/components/layouts/MonthNavigator";
import { TransactionList } from "@/components/features/TransactionList/TransactionList";
import {
  TransactionFilters,
  type FilterType,
} from "@/components/features/TransactionList/TransactionFilters";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function TransactionsPage(): React.ReactElement {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (): void => {
    if (deleteId) {
      // TODO: integrate with Zustand store
      console.log("Delete transaction:", deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-4 px-4 py-5">
      {/* Header */}
      <h1 className="font-display text-xl font-bold uppercase">Riwayat Transaksi</h1>

      {/* Month Navigator */}
      <MonthNavigator
        year={year}
        month={month}
        onChange={(y, m) => {
          setYear(y);
          setMonth(m);
        }}
      />

      {/* Filters */}
      <TransactionFilters activeType={filterType} onTypeChange={setFilterType} />

      {/* Transaction List */}
      <TransactionList
        onItemTap={(id) => console.log("Edit:", id)}
        onItemDelete={(id) => setDeleteId(id)}
      />

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
