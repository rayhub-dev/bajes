import type { TransactionDTO, PaginationMeta } from "@bajes/types";
import type {
  CreateTransactionInput,
  TransactionFilters,
  UpdateTransactionInput,
} from "@bajes/schemas";
import { TransactionRepository } from "../repositories/transaction.js";

type NotFoundError = Error & { statusCode: number };

function createNotFoundError(message: string): NotFoundError {
  const error = new Error(message) as NotFoundError;
  error.statusCode = 404;
  return error;
}

export class TransactionService {
  constructor(private readonly repository = new TransactionRepository()) {}

  async list(
    userId: string,
    filters: TransactionFilters,
  ): Promise<{ data: TransactionDTO[]; pagination: PaginationMeta }> {
    const { data, total } = await this.repository.findMany(userId, filters);

    return {
      data,
      pagination: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.ceil(total / filters.pageSize),
      },
    };
  }

  async create(userId: string, input: CreateTransactionInput): Promise<TransactionDTO> {
    const existing = await this.repository.findByClientId(input.clientId, userId);
    if (existing) return existing;

    return this.repository.create(userId, input);
  }

  async update(id: string, userId: string, input: UpdateTransactionInput): Promise<TransactionDTO> {
    const existing = await this.repository.findById(id, userId);
    if (!existing) throw createNotFoundError("Transaction not found");

    return this.repository.update(id, userId, input);
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = await this.repository.findById(id, userId);
    if (!existing) throw createNotFoundError("Transaction not found");

    await this.repository.softDelete(id, userId);
  }

  async batchSync(userId: string, operations: CreateTransactionInput[]): Promise<TransactionDTO[]> {
    return this.repository.batchCreate(userId, operations);
  }
}
