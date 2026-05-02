"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "yellow" | "pink" | "blue" | "green" | "red" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  yellow: "bg-bajes-yellow text-bajes-black",
  pink: "bg-bajes-pink text-bajes-black",
  blue: "bg-bajes-blue text-white",
  green: "bg-bajes-green text-bajes-black",
  red: "bg-bajes-red text-white",
  neutral: "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300",
};

function Badge({ children, variant = "neutral", className }: BadgeProps): React.ReactElement {
  return <span className={cn("badge-brutal", variantStyles[variant], className)}>{children}</span>;
}

export { Badge, type BadgeProps };
