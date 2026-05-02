"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-bajes-yellow text-bajes-black border-3 border-bajes-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none dark:border-white/20 dark:shadow-brutal-dark dark:hover:shadow-brutal-dark-hover",
  secondary:
    "bg-bajes-pink text-bajes-black border-3 border-bajes-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none dark:border-white/20 dark:shadow-brutal-dark dark:hover:shadow-brutal-dark-hover",
  danger:
    "bg-bajes-red text-white border-3 border-bajes-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none dark:border-white/20 dark:shadow-brutal-dark dark:hover:shadow-brutal-dark-hover",
  ghost:
    "bg-transparent text-bajes-black border-3 border-transparent hover:bg-bajes-black/5 active:bg-bajes-black/10 dark:text-white dark:hover:bg-white/5 dark:active:bg-white/10",
  outline:
    "bg-white text-bajes-black border-3 border-bajes-black shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:bg-gray-50 dark:bg-bajes-surface-dark dark:text-white dark:border-white/20 dark:shadow-brutal-dark-sm dark:hover:shadow-none dark:active:bg-bajes-surface-dark-2",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      isLoading,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-display font-bold uppercase tracking-wide transition-all duration-150",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          (disabled || isLoading) && "pointer-events-none cursor-not-allowed opacity-50",
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps };
