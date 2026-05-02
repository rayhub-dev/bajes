import { apiClient } from "./client";
import type { BudgetWithSpentDTO, ApiSuccessResponse } from "@bajes/types";
import type { CreateBudgetInput } from "@bajes/schemas";

export async function fetchBudgets(year: number, month: number): Promise<BudgetWithSpentDTO[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<BudgetWithSpentDTO[]>>("/v1/budgets", {
    params: { year, month },
  });
  return data.data;
}

export async function upsertBudget(input: CreateBudgetInput): Promise<BudgetWithSpentDTO> {
  const { data } = await apiClient.post<ApiSuccessResponse<BudgetWithSpentDTO>>(
    "/v1/budgets",
    input,
  );
  return data.data;
}

export async function deleteBudget(id: string): Promise<void> {
  await apiClient.delete(`/v1/budgets/${id}`);
}
