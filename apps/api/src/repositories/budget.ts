import type { PrismaClient, Budget, Category } from "@prisma/client";
import type { BudgetWithSpentDTO, CategoryDTO } from "@bajes/types";
import type { CreateBudgetInput } from "@bajes/schemas";
import { BaseRepository } from "./base.js";
import { prisma } from "../lib/prisma.js";

type BudgetWithCategory = Budget & { category: Category };

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

function toBudgetWithSpentDTO(budget: BudgetWithCategory, spentCents: number): BudgetWithSpentDTO {
  const remainingCents = budget.amountCents - spentCents;
  const percentage =
    budget.amountCents > 0 ? Math.round((spentCents / budget.amountCents) * 100) : 0;

  return {
    id: budget.id,
    categoryId: budget.categoryId,
    category: toCategoryDTO(budget.category),
    amountCents: budget.amountCents,
    periodType: budget.periodType,
    periodYear: budget.periodYear,
    periodMonth: budget.periodMonth,
    periodWeek: budget.periodWeek,
    notifyAt: budget.notifyAt,
    spentCents,
    remainingCents,
    percentage,
    isOverBudget: spentCents > budget.amountCents,
    createdAt: budget.createdAt.toISOString(),
    updatedAt: budget.updatedAt.toISOString(),
  };
}

export class BudgetRepository extends BaseRepository {
  constructor(db: PrismaClient = prisma) {
    super(db);
  }

  async findMany(userId: string, year: number, month: number): Promise<BudgetWithSpentDTO[]> {
    const budgets = await this.db.budget.findMany({
      where: {
        userId,
        periodType: "MONTHLY",
        periodYear: year,
        periodMonth: month,
      },
      include: { category: true },
      orderBy: { createdAt: "asc" },
    });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const spentAggregations = await Promise.all(
      budgets.map((budget) =>
        this.db.transaction.aggregate({
          where: {
            userId,
            categoryId: budget.categoryId,
            type: "EXPENSE",
            deletedAt: null,
            transactionDate: { gte: startDate, lte: endDate },
          },
          _sum: { amountCents: true },
        }),
      ),
    );

    return budgets.map((budget, i) => {
      const spentCents = spentAggregations[i]?._sum.amountCents ?? 0;
      return toBudgetWithSpentDTO(budget, spentCents);
    });
  }

  async findById(id: string, userId: string): Promise<BudgetWithCategory | null> {
    return this.db.budget.findFirst({
      where: { id, userId },
      include: { category: true },
    });
  }

  async upsert(userId: string, input: CreateBudgetInput): Promise<BudgetWithSpentDTO> {
    // Find existing budget for this user+category+period combination
    const existing = await this.db.budget.findFirst({
      where: {
        userId,
        categoryId: input.categoryId,
        periodType: input.periodType,
        periodYear: input.periodYear,
        periodMonth: input.periodMonth,
        periodWeek: null,
      },
    });

    let budget: BudgetWithCategory;

    if (existing) {
      budget = await this.db.budget.update({
        where: { id: existing.id },
        data: {
          amountCents: input.amountCents,
          notifyAt: input.notifyAt,
        },
        include: { category: true },
      });
    } else {
      budget = await this.db.budget.create({
        data: {
          userId,
          categoryId: input.categoryId,
          amountCents: input.amountCents,
          periodType: input.periodType,
          periodYear: input.periodYear,
          periodMonth: input.periodMonth,
          notifyAt: input.notifyAt,
        },
        include: { category: true },
      });
    }

    const startDate = new Date(input.periodYear, input.periodMonth - 1, 1);
    const endDate = new Date(input.periodYear, input.periodMonth, 0, 23, 59, 59, 999);

    const spent = await this.db.transaction.aggregate({
      where: {
        userId,
        categoryId: input.categoryId,
        type: "EXPENSE",
        deletedAt: null,
        transactionDate: { gte: startDate, lte: endDate },
      },
      _sum: { amountCents: true },
    });

    const spentCents = spent._sum.amountCents ?? 0;
    return toBudgetWithSpentDTO(budget, spentCents);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.db.budget.delete({
      where: { id, userId },
    });
  }
}
