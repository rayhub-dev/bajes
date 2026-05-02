import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBudgets, upsertBudget, deleteBudget } from "@/lib/api/budgets";
import type { CreateBudgetInput } from "@bajes/schemas";
import { useAuthStore } from "@/store/auth";

export const BUDGETS_KEY = "budgets";

export function useBudgets(year: number, month: number) {
  const { isAuthenticated, isInitializing } = useAuthStore();
  return useQuery({
    queryKey: [BUDGETS_KEY, year, month],
    queryFn: () => fetchBudgets(year, month),
    enabled: isAuthenticated && !isInitializing,
    retry: false,
  });
}

export function useUpsertBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBudgetInput) => upsertBudget(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY] });
    },
  });
}
