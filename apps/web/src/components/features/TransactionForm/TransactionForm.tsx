"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { formatInputCurrency, parseCurrencyInput } from "@/lib/utils/currency";
import { StickyNote } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { TransactionDateTimePicker } from "./TransactionDateTimePicker";

type TransactionType = "EXPENSE" | "INCOME";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: {
    id: string;
    type: TransactionType;
    categoryId: string;
    amountCents: number;
    note?: string;
    transactionDate: string;
  };
}

function TransactionForm({ isOpen, onClose, editData }: TransactionFormProps): React.ReactElement {
  const [type, setType] = useState<TransactionType>(editData?.type || "EXPENSE");
  const [selectedCategory, setSelectedCategory] = useState<string>(editData?.categoryId || "");
  const [amount, setAmount] = useState(
    editData ? formatInputCurrency(String(editData.amountCents)) : "",
  );
  const [note, setNote] = useState(editData?.note || "");
  const [date, setDate] = useState<string>(() => {
    if (editData?.transactionDate) {
      // Create a local date from the ISO string to feed the input correctly
      const d = new Date(editData.transactionDate);
      if (!isNaN(d.getTime())) {
        const tzOffset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
      }
    }
    // Default to current local time, format to YYYY-MM-DDThh:mm
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  });

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const createMutation = useCreateTransaction();

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleAmountChange = (value: string): void => {
    setAmount(formatInputCurrency(value));
  };

  const handleSubmit = (): void => {
    const amountCents = parseCurrencyInput(amount);
    if (amountCents <= 0 || !selectedCategory) return;

    createMutation.mutate(
      {
        type,
        categoryId: selectedCategory,
        amountCents,
        amountEncrypted: "enc:v1:placeholder",
        note: note.trim() || undefined,
        transactionDate: new Date(date).toISOString(),
        clientId: crypto.randomUUID(),
      },
      {
        onSuccess: () => {
          setAmount("");
          setNote("");
          setSelectedCategory("");
          const now = new Date();
          const tzOffset = now.getTimezoneOffset() * 60000;
          setDate(new Date(now.getTime() - tzOffset).toISOString().slice(0, 16));
          onClose();
        },
      },
    );
  };

  const isValid =
    parseCurrencyInput(amount) > 0 && selectedCategory !== "" && !createMutation.isPending;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit Transaksi" : "Tambah Transaksi"}
    >
      <div className="space-y-5">
        {/* Type Toggle */}
        <div className="border-3 flex overflow-hidden rounded-xl border-bajes-black dark:border-white/20">
          <button
            onClick={() => {
              setType("EXPENSE");
              setSelectedCategory("");
            }}
            className={cn(
              "flex-1 py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-colors",
              type === "EXPENSE"
                ? "bg-bajes-red text-white"
                : "bg-white text-gray-400 hover:bg-gray-50 dark:bg-bajes-surface-dark-2 dark:text-gray-500 dark:hover:bg-white/5",
            )}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => {
              setType("INCOME");
              setSelectedCategory("");
            }}
            className={cn(
              "border-l-3 flex-1 border-bajes-black py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-colors dark:border-white/20",
              type === "INCOME"
                ? "bg-bajes-green text-bajes-black"
                : "bg-white text-gray-400 hover:bg-gray-50 dark:bg-bajes-surface-dark-2 dark:text-gray-500 dark:hover:bg-white/5",
            )}
          >
            Pemasukan
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Nominal
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-lg font-bold text-gray-400">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              autoFocus
              className="input-brutal pl-14 font-display text-2xl font-bold"
            />
          </div>
        </div>

        {/* Category Grid */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Kategori
          </label>
          {categoriesLoading ? (
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all",
                    selectedCategory === cat.id
                      ? "scale-[1.02] border-bajes-black bg-bajes-yellow shadow-brutal-sm dark:border-white/20 dark:shadow-brutal-dark-sm"
                      : "border-gray-200 bg-white hover:border-gray-400 dark:border-white/10 dark:bg-bajes-surface-dark-2 dark:hover:border-white/30",
                  )}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="w-full truncate text-center text-[10px] font-bold uppercase tracking-wider">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Tanggal & Waktu
          </label>
          <TransactionDateTimePicker value={date} onChange={setDate} />
        </div>

        {/* Note */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Catatan (opsional)
          </label>
          <div className="relative">
            <StickyNote size={18} className="absolute left-3 top-3.5 text-gray-500" />
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Makan siang, ngopi, dll..."
              maxLength={200}
              className="input-brutal pl-10"
            />
          </div>
        </div>

        {/* Submit */}
        <Button variant="primary" size="lg" fullWidth disabled={!isValid} onClick={handleSubmit}>
          {createMutation.isPending
            ? "Menyimpan..."
            : editData
              ? "Simpan Perubahan"
              : "Simpan Transaksi"}{" "}
          💰
        </Button>
      </div>
    </BottomSheet>
  );
}

export { TransactionForm };
