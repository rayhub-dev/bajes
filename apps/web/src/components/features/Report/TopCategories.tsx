"use client";

import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils/currency";

interface TopCategory {
  name: string;
  icon: string;
  color: string;
  totalCents: number;
  percentage: number;
}

const MOCK_TOP: TopCategory[] = [
  { name: "Makanan & Minuman", icon: "🍜", color: "#FF6B6B", totalCents: 850000, percentage: 35 },
  { name: "Transportasi", icon: "🚗", color: "#4ECDC4", totalCents: 500000, percentage: 21 },
  { name: "Belanja", icon: "🛍️", color: "#45B7D1", totalCents: 400000, percentage: 17 },
];

interface TopCategoriesProps {
  categories?: TopCategory[];
}

function TopCategories({ categories = MOCK_TOP }: TopCategoriesProps): React.ReactElement {
  return (
    <Card>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
        Top 3 Pengeluaran
      </p>

      <div className="space-y-3">
        {categories.map((cat, i) => (
          <div key={cat.name}>
            <div className="mb-1.5 flex items-center gap-3">
              <span className="text-lg">{cat.icon}</span>
              <span className="flex-1 text-sm font-semibold">{cat.name}</span>
              <span className="font-display text-sm font-bold">
                {formatCurrency(cat.totalCents)}
              </span>
            </div>
            {/* Horizontal bar */}
            <div className="h-3 w-full overflow-hidden rounded-full border-2 border-bajes-black bg-gray-200">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
              />
            </div>
            <p className="mt-0.5 text-right text-[10px] font-bold text-gray-500">
              {cat.percentage}% dari total
            </p>
            {i < categories.length - 1 && <div className="mt-2 h-px bg-gray-100" />}
          </div>
        ))}
      </div>
    </Card>
  );
}

export { TopCategories };
