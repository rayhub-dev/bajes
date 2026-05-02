import type { PrismaClient, Category, Transaction } from "@prisma/client";
import type { CategoryDTO, TransactionDTO } from "@bajes/types";
import type {
  CreateTransactionInput,
  TransactionFilters,
  UpdateTransactionInput,
} from "@bajes/schemas";
import { BaseRepository } from "./base.js";
import { prisma } from "../lib/prisma.js";

type TransactionWithCategory = Transaction & { category: Category };

function toCategoryDTO(category: Category): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    icon: category.icon,
    color: category.color,
    type: category.type,
    isDefault: category.isDefault,
    sortOrder: category.sortOrder,
  };
}

function toTransactionDTO(tx: TransactionWithCategory): TransactionDTO {
  return {
    id: tx.id,
    categoryId: tx.categoryId,
    category: toCategoryDTO(tx.category),
    amountCents: tx.amountCents,
    type: tx.type,
    note: tx.note,
    transactionDate: tx.transactionDate.toISOString(),
    clientId: tx.clientId,
    createdAt: tx.createdAt.toISOString(),
    updatedAt: tx.updatedAt.toISOString(),
  };
}

export class TransactionRepository extends BaseRepository {
  constructor(db: PrismaClient = prisma) {
    super(db);
  }

  async findMany(
    userId: string,
    filters: TransactionFilters,
  ): Promise<{ data: TransactionDTO[]; total: number }> {
    const { startDate, endDate, categoryId, type, page, pageSize } = filters;

    const where = {
      userId,
      deletedAt: null,
      ...(categoryId && { categoryId }),
      ...(type !== "ALL" && { type }),
      ...(startDate || endDate
        ? {
            transactionDate: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    const [transactions, total] = await Promise.all([
      this.db.transaction.findMany({
        where,
        include: { category: true },
        orderBy: { transactionDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.db.transaction.count({ where }),
    ]);

    return {
      data: transactions.map(toTransactionDTO),
      total,
    };
  }

  async findById(id: string, userId: string): Promise<TransactionDTO | null> {
    const tx = await this.db.transaction.findFirst({
      where: { id, userId, deletedAt: null },
      include: { category: true },
    });

    return tx ? toTransactionDTO(tx) : null;
  }

  async findByClientId(clientId: string, userId: string): Promise<TransactionDTO | null> {
    const tx = await this.db.transaction.findFirst({
      where: { clientId, userId, deletedAt: null },
      include: { category: true },
    });

    return tx ? toTransactionDTO(tx) : null;
  }

  async create(userId: string, input: CreateTransactionInput): Promise<TransactionDTO> {
    const tx = await this.db.transaction.create({
      data: {
        userId,
        categoryId: input.categoryId,
        amountEncrypted: input.amountEncrypted,
        amountCents: input.amountCents,
        type: input.type,
        note: input.note ?? null,
        transactionDate: new Date(input.transactionDate),
        clientId: input.clientId,
        syncedAt: new Date(),
      },
      include: { category: true },
    });

    return toTransactionDTO(tx);
  }

  async update(id: string, userId: string, input: UpdateTransactionInput): Promise<TransactionDTO> {
    const tx = await this.db.transaction.update({
      where: { id, userId },
      data: {
        ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
        ...(input.amountEncrypted !== undefined && { amountEncrypted: input.amountEncrypted }),
        ...(input.amountCents !== undefined && { amountCents: input.amountCents }),
        ...(input.type !== undefined && { type: input.type }),
        ...(input.note !== undefined && { note: input.note }),
        ...(input.transactionDate !== undefined && {
          transactionDate: new Date(input.transactionDate),
        }),
      },
      include: { category: true },
    });

    return toTransactionDTO(tx);
  }

  async softDelete(id: string, userId: string): Promise<void> {
    await this.db.transaction.update({
      where: { id, userId },
      data: { deletedAt: new Date() },
    });
  }

  async batchCreate(userId: string, inputs: CreateTransactionInput[]): Promise<TransactionDTO[]> {
    if (inputs.length === 0) return [];

    const clientIds = inputs.map((i) => i.clientId);
    const existing = await this.db.transaction.findMany({
      where: { userId, clientId: { in: clientIds } },
      select: { clientId: true },
    });

    const existingClientIds = new Set(existing.map((e) => e.clientId));
    const newInputs = inputs.filter((i) => !existingClientIds.has(i.clientId));

    if (newInputs.length === 0) return [];

    const created = await Promise.all(newInputs.map((input) => this.create(userId, input)));

    return created;
  }
}
