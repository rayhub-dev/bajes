"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/currency";
import { Trash2, Cloud, CloudOff } from "lucide-react";
import { useState } from "react";

interface TransactionItemProps {
  id: string;
  categoryIcon: string;
  categoryName: string;
  categoryColor: string;
  note?: string;
  amountCents: number;
  type: "INCOME" | "EXPENSE";
  time: string;
  syncStatus: "synced" | "pending" | "failed";
  onTap?: () => void;
  onDelete?: () => void;
}

function TransactionItem({
  categoryIcon,
  categoryName,
  categoryColor,
  note,
  amountCents,
  type,
  time,
  syncStatus,
  onTap,
  onDelete,
}: TransactionItemProps): React.ReactElement {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className="group flex cursor-pointer items-center gap-3 px-1 py-3"
      onClick={onTap}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowDelete(!showDelete);
      }}
    >
      {/* Category Icon */}
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-bajes-black text-xl shadow-brutal-sm"
        style={{ backgroundColor: categoryColor + "30" }}
      >
        {categoryIcon}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-semibold">{categoryName}</p>
          {syncStatus === "pending" && (
            <CloudOff size={12} className="flex-shrink-0 text-yellow-500" />
          )}
          {syncStatus === "failed" && (
            <CloudOff size={12} className="flex-shrink-0 text-bajes-red" />
          )}
          {syncStatus === "synced" && (
            <Cloud
              size={12}
              className="flex-shrink-0 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100"
            />
          )}
        </div>
        {note && <p className="truncate text-xs text-gray-500">{note}</p>}
      </div>

      {/* Amount & Time */}
      <div className="flex-shrink-0 text-right">
        <p
          className={cn(
            "font-display text-sm font-bold",
            type === "EXPENSE" ? "text-bajes-red" : "text-green-600",
          )}
        >
          {type === "EXPENSE" ? "-" : "+"}
          {formatCurrency(amountCents)}
        </p>
        <p className="text-[10px] font-semibold uppercase text-gray-400">{time}</p>
      </div>

      {/* Delete button (shown on context menu) */}
      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
            setShowDelete(false);
          }}
          className="rounded-lg border-2 border-bajes-black bg-bajes-red p-2 text-white shadow-brutal-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          <Trash2 size={16} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

export { TransactionItem };
