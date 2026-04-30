import { z } from "zod";

export const createTransactionSchema = z.object({
  categoryId: z.string().cuid(),
  amountEncrypted: z.string().startsWith("enc:v1:"),
  amountCents: z.number().int().positive().max(999_999_999),
  type: z.enum(["INCOME", "EXPENSE"]),
  note: z.string().trim().max(200).optional(),
  transactionDate: z.string().datetime(),
  clientId: z.string().uuid(),
});

export const updateTransactionSchema = z.object({
  categoryId: z.string().cuid().optional(),
  amountEncrypted: z.string().startsWith("enc:v1:").optional(),
  amountCents: z.number().int().positive().max(999_999_999).optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  note: z.string().trim().max(200).optional(),
  transactionDate: z.string().datetime().optional(),
});

export const transactionFiltersSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categoryId: z.string().cuid().optional(),
  type: z.enum(["INCOME", "EXPENSE", "ALL"]).default("ALL"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionFilters = z.infer<typeof transactionFiltersSchema>;
