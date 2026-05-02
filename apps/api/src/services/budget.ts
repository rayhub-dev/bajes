import type { BudgetWithSpentDTO } from "@bajes/types";
import type { CreateBudgetInput } from "@bajes/schemas";
import { BudgetRepository } from "../repositories/budget.js";

type NotFoundError = Error & { statusCode: number };

function createNotFoundError(message: string): NotFoundError {
  const error = new Error(message) as NotFoundError;
  error.statusCode = 404;
  return error;
}

export class BudgetService {
  constructor(private readonly repository = new BudgetRepository()) {}

  async list(userId: string, year: number, month: number): Promise<BudgetWithSpentDTO[]> {
    return this.repository.findMany(userId, year, month);
  }

  async upsert(userId: string, input: CreateBudgetInput): Promise<BudgetWithSpentDTO> {
    return this.repository.upsert(userId, input);
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = await this.repository.findById(id, userId);
    if (!existing) throw createNotFoundError("Budget not found");

    await this.repository.delete(id, userId);
  }
}
