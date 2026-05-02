import { apiClient } from "./client";
import type {
  TransactionDTO,
  CategoryDTO,
  ApiSuccessResponse,
  PaginatedResponse,
} from "@bajes/types";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
} from "@bajes/schemas";

export async function fetchTransactions(
  filters: Partial<TransactionFilters>,
): Promise<PaginatedResponse<TransactionDTO>> {
  const { data } = await apiClient.get<PaginatedResponse<TransactionDTO>>("/v1/transactions", {
    params: filters,
  });
  return data;
}

export async function createTransaction(input: CreateTransactionInput): Promise<TransactionDTO> {
  const { data } = await apiClient.post<ApiSuccessResponse<TransactionDTO>>(
    "/v1/transactions",
    input,
  );
  return data.data;
}

export async function updateTransaction(
  id: string,
  input: Partial<UpdateTransactionInput>,
): Promise<TransactionDTO> {
  const { data } = await apiClient.put<ApiSuccessResponse<TransactionDTO>>(
    `/v1/transactions/${id}`,
    input,
  );
  return data.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await apiClient.delete(`/v1/transactions/${id}`);
}

export async function batchSyncTransactions(
  inputs: CreateTransactionInput[],
): Promise<TransactionDTO[]> {
  const { data } = await apiClient.post<ApiSuccessResponse<TransactionDTO[]>>(
    "/v1/transactions/batch",
    inputs,
  );
  return data.data;
}

export async function fetchCategories(): Promise<CategoryDTO[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<CategoryDTO[]>>("/v1/categories", {
    params: { includeDefaults: "true" },
  });
  return data.data;
}
