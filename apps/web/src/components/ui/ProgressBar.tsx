"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percentage: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

function getProgressColor(percentage: number): string {
  if (percentage > 80) return "bg-bajes-red";
  if (percentage > 60) return "bg-bajes-yellow";
  return "bg-bajes-green";
}

function getProgressLabel(percentage: number): string {
  if (percentage > 100) return "OVER BUDGET! 🔥";
  if (percentage > 80) return "Bahaya! 😱";
  if (percentage > 60) return "Hati-hati 😬";
  return "Aman 😎";
}

const sizeStyles: Record<string, string> = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

function ProgressBar({
  percentage,
  className,
  showLabel = false,
  size = "md",
}: ProgressBarProps): React.ReactElement {
  const clampedPercentage = Math.min(percentage, 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            {Math.round(percentage)}%
          </span>
          <span
            className={cn(
              "text-xs font-bold uppercase",
              percentage > 80
                ? "text-bajes-red"
                : percentage > 60
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-green-600 dark:text-green-400",
            )}
          >
            {getProgressLabel(percentage)}
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full border-2 border-bajes-black bg-gray-200 dark:border-white/20 dark:bg-white/10",
          sizeStyles[size],
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            getProgressColor(percentage),
          )}
          style={
            {
              "--progress-width": `${clampedPercentage}%`,
              width: `${clampedPercentage}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}

export { ProgressBar, type ProgressBarProps };
