"use client";

import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "yellow" | "pink" | "red" | "green";
  noPadding?: boolean;
  noShadow?: boolean;
}

const bgVariants: Record<string, string> = {
  default: "bg-white dark:bg-bajes-surface-dark",
  yellow: "bg-bajes-yellow",
  pink: "bg-bajes-pink",
  red: "bg-bajes-red",
  green: "bg-bajes-green",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", noPadding, noShadow, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-3 rounded-2xl border-bajes-black dark:border-white/20",
          bgVariants[variant],
          !noPadding && "p-5",
          !noShadow && "shadow-brutal dark:shadow-brutal-dark",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card, type CardProps };
