"use client";

import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  variant = "danger",
}: ConfirmDialogProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative w-full max-w-sm animate-bounce-in rounded-2xl border-4 border-bajes-black bg-white p-6 shadow-brutal-lg">
        <h3 className="mb-2 font-display text-lg font-bold uppercase">{title}</h3>
        <p className="mb-6 font-sans text-sm text-gray-600">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" size="md" fullWidth onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="md"
            fullWidth
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ConfirmDialog, type ConfirmDialogProps };
