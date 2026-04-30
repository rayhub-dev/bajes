"use client";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({
  icon = "🫠",
  title,
  description,
  action,
  className,
}: EmptyStateProps): React.ReactElement {
  return (
    <div
      className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}
    >
      <span className="mb-4 text-5xl">{icon}</span>
      <h3 className="mb-2 font-display text-lg font-bold uppercase">{title}</h3>
      <p className="mb-6 max-w-xs font-sans text-sm text-gray-500">{description}</p>
      {action}
    </div>
  );
}

export { EmptyState, type EmptyStateProps };
