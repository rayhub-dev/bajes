import { db, type LocalTransaction } from "@/lib/db";
import { batchSyncTransactions, fetchTransactions } from "@/lib/api/transactions";
import { SyncStatus } from "@bajes/types";
import type { CreateTransactionInput } from "@bajes/schemas";
import { useUiStore } from "@/store/ui";

export async function syncPendingTransactions(): Promise<{
  synced: number;
  failed: number;
}> {
  const uiStore = useUiStore.getState();
  if (uiStore.isSyncing) return { synced: 0, failed: 0 };

  uiStore.setSyncing(true);
  let synced = 0;
  let failed = 0;

  try {
    const pending = await db.transactions.where("syncStatus").equals(SyncStatus.PENDING).toArray();

    if (pending.length === 0) return { synced: 0, failed: 0 };

    // Batch in groups of 50 (server limit)
    const batches: LocalTransaction[][] = [];
    for (let i = 0; i < pending.length; i += 50) {
      batches.push(pending.slice(i, i + 50));
    }

    for (const batch of batches) {
      try {
        const inputs: CreateTransactionInput[] = batch.map((tx) => ({
          categoryId: tx.categoryId,
          amountEncrypted: "enc:v1:placeholder", // real encryption TBD
          amountCents: tx.amountCents,
          type: tx.type,
          note: tx.note ?? undefined,
          transactionDate: tx.transactionDate,
          clientId: tx.clientId ?? crypto.randomUUID(),
        }));

        const results = await batchSyncTransactions(inputs);
        synced += results.length;

        const syncedIds = batch.slice(0, results.length).map((tx) => tx.id);
        await db.transactions
          .where("id")
          .anyOf(syncedIds)
          .modify({ syncStatus: SyncStatus.SYNCED });
      } catch {
        failed += batch.length;
        const failedIds = batch.map((tx) => tx.id);
        await db.transactions
          .where("id")
          .anyOf(failedIds)
          .modify({ syncStatus: SyncStatus.FAILED });
      }
    }
  } finally {
    uiStore.setSyncing(false);
  }

  return { synced, failed };
}

export async function pullTransactionsFromServer(userId: string): Promise<number> {
  const response = await fetchTransactions({ page: 1, pageSize: 100 });
  const serverTransactions = response.data;

  let stored = 0;
  for (const tx of serverTransactions) {
    const existing = await db.transactions.get(tx.id);
    if (!existing) {
      await db.transactions.put({
        id: tx.id,
        userId,
        categoryId: tx.categoryId,
        amountCents: tx.amountCents,
        type: tx.type,
        note: tx.note,
        transactionDate: tx.transactionDate,
        clientId: tx.clientId,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
        syncStatus: SyncStatus.SYNCED,
      });
      stored++;
    }
  }

  return stored;
}
