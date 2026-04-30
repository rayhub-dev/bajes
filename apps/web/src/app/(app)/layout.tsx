"use client";

import { AppShell } from "@/components/layouts/AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return <AppShell>{children}</AppShell>;
}
