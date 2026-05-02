"use client";

import { useState } from "react";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import { ConnectionStatus } from "./ConnectionStatus";
import { ToastContainer } from "../ui/Toast";
import { TransactionForm } from "../features/TransactionForm/TransactionForm";

interface AppShellProps {
  children: React.ReactNode;
}

function AppShell({ children }: AppShellProps): React.ReactElement {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bajes-bg dark:bg-bajes-bg-dark">
      <ConnectionStatus />
      <ToastContainer />

      {/* Desktop Sidebar — hidden on mobile, visible on lg+ */}
      <Sidebar onAddClick={() => setIsFormOpen(true)} />

      {/* Main content: offset by sidebar width on lg+ */}
      <main className="pt-safe pb-20 lg:pb-6 lg:pl-64">{children}</main>

      {/* Bottom Navigation — visible on mobile, hidden on lg+ */}
      <BottomNav onAddClick={() => setIsFormOpen(true)} />

      {/* Transaction Form Bottom Sheet */}
      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}

export { AppShell };
