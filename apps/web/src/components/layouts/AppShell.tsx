"use client";

import { useState } from "react";
import { BottomNav } from "./BottomNav";
import { ConnectionStatus } from "./ConnectionStatus";
import { ToastContainer } from "../ui/Toast";
import { TransactionForm } from "../features/TransactionForm/TransactionForm";

interface AppShellProps {
  children: React.ReactNode;
}

function AppShell({ children }: AppShellProps): React.ReactElement {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bajes-bg">
      <ConnectionStatus />
      <ToastContainer />

      {/* Main content with bottom padding for nav */}
      <main className="pt-safe pb-20">{children}</main>

      {/* Bottom Navigation */}
      <BottomNav onAddClick={() => setIsFormOpen(true)} />

      {/* Transaction Form Bottom Sheet */}
      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}

export { AppShell };
