"use client";

import { Card } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils/currency";

interface CategoryExpense {
  name: string;
  icon: string;
  color: string;
  totalCents: number;
  percentage: number;
}

interface ExpenseDonutChartProps {
  categories: CategoryExpense[];
}

// Mock data
const MOCK_DATA: CategoryExpense[] = [
  { name: "Makanan", icon: "🍜", color: "#FF6B6B", totalCents: 850000, percentage: 35 },
  { name: "Transport", icon: "🚗", color: "#4ECDC4", totalCents: 500000, percentage: 21 },
  { name: "Belanja", icon: "🛍️", color: "#45B7D1", totalCents: 400000, percentage: 17 },
  { name: "Tagihan", icon: "📱", color: "#96CEB4", totalCents: 350000, percentage: 14 },
  { name: "Lainnya", icon: "📦", color: "#DDD", totalCents: 300000, percentage: 13 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CategoryExpense }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps): React.ReactElement | null {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border-2 border-bajes-black bg-white px-3 py-2 shadow-brutal-sm">
      <p className="text-xs font-bold">
        {data.icon} {data.name}
      </p>
      <p className="font-display text-sm font-bold">{formatCurrency(data.totalCents)}</p>
      <p className="text-[10px] font-semibold text-gray-500">{data.percentage}%</p>
    </div>
  );
}

function ExpenseDonutChart({ categories = MOCK_DATA }: ExpenseDonutChartProps): React.ReactElement {
  return (
    <Card>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
        Top Pengeluaran
      </p>

      <div className="flex items-center gap-4">
        {/* Chart */}
        <div className="h-36 w-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={3}
                dataKey="totalCents"
                stroke="#000"
                strokeWidth={2}
              >
                {categories.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 flex-shrink-0 rounded-sm border border-bajes-black"
                style={{ backgroundColor: cat.color }}
              />
              <span className="flex-1 truncate text-xs font-semibold">
                {cat.icon} {cat.name}
              </span>
              <span className="text-[10px] font-bold text-gray-500">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export { ExpenseDonutChart };
