import Dexie, { type Table } from "dexie";
import { type PeriodType, type SyncStatus, type TransactionType } from "@bajes/types";

export type LocalSyncStatus = SyncStatus;

export interface LocalTransaction {
  id: string;
  userId: string;
  categoryId: string;
  amountCents: number;
  type: TransactionType;
  note: string | null;
  transactionDate: string;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
  syncStatus: LocalSyncStatus;
}

export interface LocalBudget {
  id: string;
  userId: string;
  categoryId: string;
  amountCents: number;
  periodType: PeriodType;
  periodYear: number;
  periodMonth: number | null;
  periodWeek: number | null;
  notifyAt: number;
  createdAt: string;
  updatedAt: string;
  syncStatus: LocalSyncStatus;
}

class BajesLocalDatabase extends Dexie {
  transactions!: Table<LocalTransaction, string>;
  budgets!: Table<LocalBudget, string>;

  public constructor() {
    super("bajes-local-db");

    this.version(1).stores({
      transactions:
        "id, userId, updatedAt, syncStatus, [userId+updatedAt], [userId+syncStatus], [syncStatus+updatedAt]",
      budgets:
        "id, userId, updatedAt, syncStatus, [userId+updatedAt], [userId+syncStatus], [syncStatus+updatedAt]",
    });
  }
}

export const db = new BajesLocalDatabase();
