"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} strokeWidth={3} />,
  error: <AlertTriangle size={18} strokeWidth={3} />,
  warning: <AlertTriangle size={18} strokeWidth={3} />,
  info: <Info size={18} strokeWidth={3} />,
};

const toastStyles: Record<ToastType, string> = {
  success: "bg-bajes-green text-bajes-black border-bajes-black",
  error: "bg-bajes-red text-white border-bajes-black",
  warning: "bg-bajes-yellow text-bajes-black border-bajes-black",
  info: "bg-bajes-blue text-white border-bajes-black",
};

// Simple global toast state
let toastListeners: Array<(toast: ToastData) => void> = [];

export function showToast(message: string, type: ToastType = "info", duration = 3000): void {
  const toast: ToastData = {
    id: Date.now().toString(),
    message,
    type,
    duration,
  };
  toastListeners.forEach((listener) => listener(toast));
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastData;
  onRemove: (id: string) => void;
}): React.ReactElement {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div
      className={cn(
        "border-3 flex animate-slide-up items-center gap-2 rounded-xl px-4 py-3 font-sans text-sm font-semibold shadow-brutal-sm",
        toastStyles[toast.type],
      )}
    >
      {toastIcons[toast.type]}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-0.5 transition-opacity hover:opacity-70"
      >
        <X size={14} strokeWidth={3} />
      </button>
    </div>
  );
}

function ToastContainer(): React.ReactElement {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const handleRemove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const listener = (toast: ToastData): void => {
      setToasts((prev) => [...prev, toast]);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-4 right-4 top-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={handleRemove} />
        </div>
      ))}
    </div>
  );
}

export { ToastContainer, type ToastData };
