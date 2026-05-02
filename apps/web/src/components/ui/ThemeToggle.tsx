"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

function ThemeToggle({ className, size = "md" }: ThemeToggleProps): React.ReactElement | null {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch — render nothing until client-side
  if (!mounted) {
    return (
      <div
        className={cn(
          "rounded-xl border-2 border-bajes-black dark:border-white/30",
          size === "sm" ? "h-8 w-8" : "h-10 w-10",
          className,
        )}
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const iconSize = size === "sm" ? 16 : 18;

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center rounded-xl border-2 border-bajes-black shadow-brutal-sm transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none dark:border-white/30 dark:shadow-brutal-dark-sm dark:hover:shadow-none",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        isDark ? "bg-bajes-surface-dark-2" : "bg-white",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={iconSize} strokeWidth={2.5} className="text-bajes-yellow" />
      ) : (
        <Moon size={iconSize} strokeWidth={2.5} className="text-bajes-black" />
      )}
    </button>
  );
}

export { ThemeToggle };
