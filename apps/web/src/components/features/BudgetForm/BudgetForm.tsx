"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { formatInputCurrency, parseCurrencyInput, formatCurrency } from "@/lib/utils/currency";

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  categoryIcon: string;
  categoryName: string;
  currentBudgetCents?: number;
  spentCents?: number;
  onSubmit?: (amountCents: number) => void;
  onRemove?: () => void;
}

function BudgetForm({
  isOpen,
  onClose,
  categoryIcon,
  categoryName,
  currentBudgetCents = 0,
  spentCents = 0,
  onSubmit,
  onRemove,
}: BudgetFormProps): React.ReactElement {
  const [amount, setAmount] = useState(
    currentBudgetCents > 0 ? formatInputCurrency(String(currentBudgetCents)) : "",
  );

  const handleAmountChange = (value: string): void => {
    setAmount(formatInputCurrency(value));
  };

  const handleSubmit = (): void => {
    const amountCents = parseCurrencyInput(amount);
    if (onSubmit) {
      onSubmit(amountCents);
    }
    onClose();
  };

  const handleRemove = (): void => {
    if (onRemove) {
      onRemove();
    }
    onClose();
  };

  const parsedAmount = parseCurrencyInput(amount);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Set Bajes">
      <div className="space-y-5">
        {/* Category info */}
        <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
          <span className="text-3xl">{categoryIcon}</span>
          <div>
            <p className="text-sm font-bold">{categoryName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sudah keluar: {formatCurrency(spentCents)} bulan ini
            </p>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Limit Bajes Bulanan
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
          {parsedAmount > 0 && spentCents > 0 && (
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {spentCents > parsedAmount
                ? `⚠️ Udah over ${formatCurrency(spentCents - parsedAmount)} dari limit ini`
                : `✅ Masih sisa ${formatCurrency(parsedAmount - spentCents)} dari limit ini`}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={parsedAmount <= 0}
            onClick={handleSubmit}
          >
            Simpan Bajes 💪
          </Button>
          {currentBudgetCents > 0 && (
            <Button variant="ghost" size="md" fullWidth onClick={handleRemove}>
              Hapus Bajes Kategori Ini
            </Button>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}

export { BudgetForm };
