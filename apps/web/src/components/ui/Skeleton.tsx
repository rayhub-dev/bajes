"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps): React.ReactElement {
  return (
    <div
      className={cn("animate-pulse rounded-xl border-2 border-gray-300 bg-gray-200", className)}
    />
  );
}

function CardSkeleton(): React.ReactElement {
  return (
    <div className="border-3 space-y-3 rounded-2xl border-gray-300 p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

function ChartSkeleton(): React.ReactElement {
  return (
    <div className="border-3 rounded-2xl border-gray-300 p-5">
      <Skeleton className="mb-4 h-4 w-32" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

function ListItemSkeleton(): React.ReactElement {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-5 w-20" />
    </div>
  );
}

export { Skeleton, CardSkeleton, ChartSkeleton, ListItemSkeleton };
