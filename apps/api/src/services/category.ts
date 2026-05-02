import type { CategoryDTO } from "@bajes/types";
import { CategoryRepository } from "../repositories/category.js";

type GetCategoriesParams = {
  userId?: string;
  includeDefaults?: boolean;
};

export class CategoryService {
  constructor(private readonly repository = new CategoryRepository()) {}

  async getCategories(params: GetCategoriesParams): Promise<CategoryDTO[]> {
    const userId = params.userId?.trim();
    const includeDefaults = params.includeDefaults ?? true;

    return this.repository.list({
      userId: userId && userId.length > 0 ? userId : undefined,
      includeDefaults,
    });
  }
}
