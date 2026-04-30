export const CategoryType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;
export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

export const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const PeriodType = {
  MONTHLY: "MONTHLY",
  WEEKLY: "WEEKLY",
} as const;
export type PeriodType = (typeof PeriodType)[keyof typeof PeriodType];

export const SyncStatus = {
  PENDING: "pending",
  SYNCED: "synced",
  FAILED: "failed",
} as const;
export type SyncStatus = (typeof SyncStatus)[keyof typeof SyncStatus];
