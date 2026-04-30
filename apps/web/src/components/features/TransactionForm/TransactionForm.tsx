"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { formatInputCurrency, parseCurrencyInput } from "@/lib/utils/currency";
import { Calendar, StickyNote } from "lucide-react";

type TransactionType = "EXPENSE" | "INCOME";

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

const MOCK_CATEGORIES: CategoryItem[] = [
  { id: "1", name: "Makanan", icon: "🍜", color: "#FF6B6B", type: "EXPENSE" },
  { id: "2", name: "Transport", icon: "🚗", color: "#4ECDC4", type: "EXPENSE" },
  { id: "3", name: "Belanja", icon: "🛍️", color: "#45B7D1", type: "EXPENSE" },
  { id: "4", name: "Tagihan", icon: "📱", color: "#96CEB4", type: "EXPENSE" },
  { id: "5", name: "Hiburan", icon: "🎮", color: "#FFEAA7", type: "EXPENSE" },
  { id: "6", name: "Gaji", icon: "💼", color: "#6BCB77", type: "INCOME" },
  { id: "7", name: "Freelance", icon: "💻", color: "#4D96FF", type: "INCOME" },
];

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
  const [date, setDate] = useState(
    editData?.transactionDate || new Date().toISOString().split("T")[0],
  );

  const filteredCategories = MOCK_CATEGORIES.filter((c) => c.type === type);

  const handleAmountChange = (value: string): void => {
    setAmount(formatInputCurrency(value));
  };

  const handleSubmit = (): void => {
    const amountCents = parseCurrencyInput(amount);
    if (amountCents <= 0 || !selectedCategory) return;

    // TODO: integrate with Zustand store + IndexedDB
    console.log({
      type,
      categoryId: selectedCategory,
      amountCents,
      note: note.trim() || undefined,
      transactionDate: date,
    });

    // Reset & close
    setAmount("");
    setNote("");
    setSelectedCategory("");
    setDate(new Date().toISOString().split("T")[0]);
    onClose();
  };

  const isValid = parseCurrencyInput(amount) > 0 && selectedCategory !== "";

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit Transaksi" : "Tambah Transaksi"}
    >
      <div className="space-y-5">
        {/* Type Toggle */}
        <div className="border-3 flex overflow-hidden rounded-xl border-bajes-black">
          <button
            onClick={() => {
              setType("EXPENSE");
              setSelectedCategory("");
            }}
            className={cn(
              "flex-1 py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-colors",
              type === "EXPENSE"
                ? "bg-bajes-red text-white"
                : "bg-white text-gray-400 hover:bg-gray-50",
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
              "border-l-3 flex-1 border-bajes-black py-2.5 font-display text-sm font-bold uppercase tracking-wider transition-colors",
              type === "INCOME"
                ? "bg-bajes-green text-bajes-black"
                : "bg-white text-gray-400 hover:bg-gray-50",
            )}
          >
            Pemasukan
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
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
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600">
            Kategori
          </label>
          <div className="grid grid-cols-4 gap-2">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all",
                  selectedCategory === cat.id
                    ? "scale-[1.02] border-bajes-black bg-bajes-yellow shadow-brutal-sm"
                    : "border-gray-200 bg-white hover:border-gray-400",
                )}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="w-full truncate text-center text-[10px] font-bold uppercase tracking-wider">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
            Tanggal
          </label>
          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-brutal pl-10"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
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
          {editData ? "Simpan Perubahan" : "Simpan Transaksi"} 💰
        </Button>
      </div>
    </BottomSheet>
  );
}

export { TransactionForm };
