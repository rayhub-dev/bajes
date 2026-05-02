import type { PrismaClient } from "@prisma/client";
import type { CategoryDTO } from "@bajes/types";
import { BaseRepository } from "./base.js";
import { prisma } from "../lib/prisma.js";

type ListCategoriesParams = {
  userId?: string;
  includeDefaults: boolean;
};

function toCategoryDTO(category: {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryDTO["type"];
  isDefault: boolean;
  sortOrder: number;
}): CategoryDTO {
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

export class CategoryRepository extends BaseRepository {
  constructor(db: PrismaClient = prisma) {
    super(db);
  }

  async list(params: ListCategoriesParams): Promise<CategoryDTO[]> {
    const { userId, includeDefaults } = params;

    if (!includeDefaults && !userId) {
      return [];
    }

    const categories = await this.db.category.findMany({
      where: {
        OR: [...(includeDefaults ? [{ isDefault: true }] : []), ...(userId ? [{ userId }] : [])],
      },
      orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
        type: true,
        isDefault: true,
        sortOrder: true,
      },
    });

    return categories.map(toCategoryDTO);
  }
}
