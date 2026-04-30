"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useCallback } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps): React.ReactElement | null {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 max-h-[90vh] animate-slide-up overflow-y-auto rounded-t-3xl border-x-4 border-t-4 border-bajes-black bg-bajes-bg",
          className,
        )}
      >
        {/* Handle bar */}
        <div className="flex justify-center pb-1 pt-3">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        {title && (
          <div className="border-b-3 flex items-center justify-between border-bajes-black px-5 pb-3">
            <h2 className="font-display text-lg font-bold uppercase">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg border-2 border-bajes-black bg-white p-1.5 shadow-brutal-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="pb-safe p-5">{children}</div>
      </div>
    </div>
  );
}

export { BottomSheet, type BottomSheetProps };
