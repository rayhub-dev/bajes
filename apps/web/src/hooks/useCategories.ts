import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api/transactions";
import { useAuthStore } from "@/store/auth";

export const CATEGORIES_KEY = "categories";

export function useCategories() {
  const { isAuthenticated, isInitializing } = useAuthStore();
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated && !isInitializing,
    retry: false,
  });
}
