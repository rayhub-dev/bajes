import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/api/transactions";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
} from "@bajes/schemas";
import { useAuthStore } from "@/store/auth";

export const TRANSACTIONS_KEY = "transactions";

export function useTransactions(filters: Partial<TransactionFilters>) {
  const { isAuthenticated, isInitializing } = useAuthStore();
  return useQuery({
    queryKey: [TRANSACTIONS_KEY, filters],
    queryFn: () => fetchTransactions(filters),
    enabled: isAuthenticated && !isInitializing,
    retry: false,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTransactionInput) => createTransaction(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<UpdateTransactionInput> }) =>
      updateTransaction(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
    },
  });
}
