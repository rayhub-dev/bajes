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
      <div
        className="absolute inset-0 animate-fade-in bg-black/40 dark:bg-black/60"
        onClick={onClose}
      />

      {/* Sheet — on desktop, center as a modal instead of bottom sheet */}
      <div
        className={cn(
          "absolute animate-slide-up overflow-y-auto border-bajes-black bg-bajes-bg dark:border-white/20 dark:bg-bajes-bg-dark",
          // Mobile: bottom sheet
          "bottom-0 left-0 right-0 max-h-[90vh] rounded-t-3xl border-x-4 border-t-4",
          // Desktop: centered modal
          "lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:max-h-[80vh] lg:w-full lg:max-w-lg lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:border-4",
          className,
        )}
      >
        {/* Handle bar — mobile only */}
        <div className="flex justify-center pb-1 pt-3 lg:hidden">
          <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Header */}
        {title && (
          <div className="border-b-3 flex items-center justify-between border-bajes-black px-5 pb-3 dark:border-white/20">
            <h2 className="font-display text-lg font-bold uppercase">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg border-2 border-bajes-black bg-white p-1.5 shadow-brutal-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none dark:border-white/20 dark:bg-bajes-surface-dark-2 dark:shadow-brutal-dark-sm dark:hover:shadow-none"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 pb-8 pt-5">{children}</div>
      </div>
    </div>
  );
}

export { BottomSheet, type BottomSheetProps };
