import { type CategoryType, type TransactionType, type PeriodType } from "./enums.js";

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserDTO {
  id: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  authProvider: string;
  currencyCode: string;
  isGuest: boolean;
  createdAt: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface CategoryDTO {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  isDefault: boolean;
  sortOrder: number;
}

// ─── Transaction ─────────────────────────────────────────────────────────────

export interface TransactionDTO {
  id: string;
  categoryId: string;
  category: CategoryDTO;
  amountCents: number;
  type: TransactionType;
  note: string | null;
  transactionDate: string;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Budget ──────────────────────────────────────────────────────────────────

export interface BudgetDTO {
  id: string;
  categoryId: string;
  amountCents: number;
  periodType: PeriodType;
  periodYear: number;
  periodMonth: number | null;
  periodWeek: number | null;
  notifyAt: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetWithSpentDTO extends BudgetDTO {
  category: CategoryDTO;
  spentCents: number;
  remainingCents: number;
  percentage: number;
  isOverBudget: boolean;
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface SessionDTO {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  expiresAt: string;
}
