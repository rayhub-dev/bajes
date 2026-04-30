"use client";

import { Card } from "@/components/ui/Card";
import { BudgetItem } from "./BudgetItem";

interface BudgetData {
  id: string;
  categoryId: string;
  categoryIcon: string;
  categoryName: string;
  categoryColor: string;
  budgetCents: number;
  spentCents: number;
}

const MOCK_BUDGETS: BudgetData[] = [
  {
    id: "1",
    categoryId: "1",
    categoryIcon: "🍜",
    categoryName: "Makanan & Minuman",
    categoryColor: "#FF6B6B",
    budgetCents: 1500000,
    spentCents: 850000,
  },
  {
    id: "2",
    categoryId: "2",
    categoryIcon: "🚗",
    categoryName: "Transportasi",
    categoryColor: "#4ECDC4",
    budgetCents: 500000,
    spentCents: 420000,
  },
  {
    id: "3",
    categoryId: "3",
    categoryIcon: "🛍️",
    categoryName: "Belanja",
    categoryColor: "#45B7D1",
    budgetCents: 300000,
    spentCents: 350000,
  },
  {
    id: "4",
    categoryId: "4",
    categoryIcon: "📱",
    categoryName: "Tagihan",
    categoryColor: "#96CEB4",
    budgetCents: 200000,
    spentCents: 50000,
  },
  {
    id: "5",
    categoryId: "5",
    categoryIcon: "🎮",
    categoryName: "Hiburan",
    categoryColor: "#FFEAA7",
    budgetCents: 0,
    spentCents: 54000,
  },
];

interface BudgetListProps {
  budgets?: BudgetData[];
  onItemTap?: (budgetId: string) => void;
}

function BudgetList({ budgets = MOCK_BUDGETS, onItemTap }: BudgetListProps): React.ReactElement {
  return (
    <Card noPadding>
      <div className="divide-y divide-gray-100 px-4">
        {budgets.map((budget) => (
          <BudgetItem
            key={budget.id}
            categoryIcon={budget.categoryIcon}
            categoryName={budget.categoryName}
            categoryColor={budget.categoryColor}
            budgetCents={budget.budgetCents}
            spentCents={budget.spentCents}
            onTap={() => onItemTap?.(budget.id)}
          />
        ))}
      </div>
    </Card>
  );
}

export { BudgetList, type BudgetData };
