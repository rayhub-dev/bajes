"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, ArrowLeftRight, Wallet, BarChart3, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuthStore } from "@/store/auth";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", icon: <LayoutDashboard size={20} strokeWidth={2.5} />, label: "Dashboard" },
  {
    href: "/transactions",
    icon: <ArrowLeftRight size={20} strokeWidth={2.5} />,
    label: "Transaksi",
  },
  { href: "/budget", icon: <Wallet size={20} strokeWidth={2.5} />, label: "Bajes" },
  { href: "/report", icon: <BarChart3 size={20} strokeWidth={2.5} />, label: "Laporan" },
];

interface SidebarProps {
  onAddClick?: () => void;
}

function Sidebar({ onAddClick }: SidebarProps): React.ReactElement {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  const displayName =
    isAuthenticated && user ? (user.displayName ?? user.email.split("@")[0] ?? "User") : "Guest";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r-4 border-bajes-black bg-white dark:border-white/20 dark:bg-bajes-surface-dark lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b-4 border-bajes-black px-6 py-5 dark:border-white/20">
        <div className="border-3 flex h-10 w-10 items-center justify-center rounded-xl border-bajes-black bg-bajes-yellow font-display text-lg font-bold shadow-brutal-sm dark:border-white/20 dark:shadow-brutal-dark-sm">
          B
        </div>
        <span className="font-display text-xl font-bold uppercase tracking-wide">Bajes</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 font-sans text-sm font-semibold transition-all",
                isActive
                  ? "border-2 border-bajes-black bg-bajes-yellow shadow-brutal-sm dark:border-white/20 dark:shadow-brutal-dark-sm"
                  : "border-2 border-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        {/* Add Transaction Button */}
        <button
          onClick={onAddClick}
          className="border-3 mt-4 flex w-full items-center gap-3 rounded-xl border-bajes-black bg-bajes-yellow px-4 py-3 font-display text-sm font-bold uppercase tracking-wide shadow-brutal transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover active:translate-x-[4px] active:translate-y-[4px] active:shadow-none dark:border-white/20 dark:shadow-brutal-dark dark:hover:shadow-brutal-dark-hover"
        >
          <Plus size={20} strokeWidth={3} />
          Tambah Transaksi
        </button>
      </nav>

      {/* Footer */}
      <div className="border-t-4 border-bajes-black px-4 py-4 dark:border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-bajes-black bg-bajes-pink text-sm font-bold dark:border-white/20">
              {user?.photoUrl ? (
                <Image
                  src={user.photoUrl}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                avatarLetter
              )}
            </div>
            <span className="text-xs font-bold">{displayName}</span>
          </div>
          <ThemeToggle size="sm" />
        </div>
      </div>
    </aside>
  );
}

export { Sidebar };
