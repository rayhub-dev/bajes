import { z } from "zod";

export const createBudgetSchema = z.object({
  categoryId: z.string().cuid(),
  amountCents: z.number().int().positive().max(999_999_999),
  periodType: z.enum(["MONTHLY"]), // MVP: hanya MONTHLY
  periodYear: z.number().int().min(2020).max(2100),
  periodMonth: z.number().int().min(1).max(12),
  notifyAt: z.number().int().min(1).max(100).default(80),
});

export const updateBudgetSchema = z.object({
  amountCents: z.number().int().positive().max(999_999_999).optional(),
  notifyAt: z.number().int().min(1).max(100).optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
