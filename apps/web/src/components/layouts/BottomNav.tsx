"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, ArrowLeftRight, Wallet, BarChart3, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", icon: <LayoutDashboard size={22} strokeWidth={2.5} />, label: "Home" },
  {
    href: "/transactions",
    icon: <ArrowLeftRight size={22} strokeWidth={2.5} />,
    label: "Transaksi",
  },
  { href: "#add", icon: <Plus size={26} strokeWidth={3} />, label: "Tambah" },
  { href: "/budget", icon: <Wallet size={22} strokeWidth={2.5} />, label: "Bajes" },
  { href: "/report", icon: <BarChart3 size={22} strokeWidth={2.5} />, label: "Laporan" },
];

interface BottomNavProps {
  onAddClick?: () => void;
}

function BottomNav({ onAddClick }: BottomNavProps): React.ReactElement {
  const pathname = usePathname();

  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-40 border-t-4 border-bajes-black bg-white dark:border-white/20 dark:bg-bajes-surface-dark lg:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const isAdd = item.href === "#add";
          const isActive = !isAdd && pathname === item.href;

          if (isAdd) {
            return (
              <button
                key={item.href}
                onClick={onAddClick}
                className="-mt-7 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-bajes-black bg-bajes-yellow shadow-brutal transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none dark:border-white/20 dark:shadow-brutal-dark"
              >
                {item.icon}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1 transition-colors",
                isActive ? "text-bajes-black dark:text-white" : "text-gray-400 dark:text-gray-500",
              )}
            >
              {item.icon}
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isActive && "text-bajes-black dark:text-white",
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="h-1.5 w-1.5 rounded-full border border-bajes-black bg-bajes-yellow dark:border-white/30" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { BottomNav };
