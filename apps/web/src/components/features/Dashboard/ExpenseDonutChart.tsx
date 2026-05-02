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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CategoryExpense }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps): React.ReactElement | null {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border-2 border-bajes-black bg-white px-3 py-2 shadow-brutal-sm dark:border-white/20 dark:bg-bajes-surface-dark dark:shadow-brutal-dark-sm">
      <p className="text-xs font-bold">
        {data.icon} {data.name}
      </p>
      <p className="font-display text-sm font-bold">{formatCurrency(data.totalCents)}</p>
      <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
        {data.percentage}%
      </p>
    </div>
  );
}

function ExpenseDonutChart({ categories = [] }: ExpenseDonutChartProps): React.ReactElement {
  return (
    <Card>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Top Pengeluaran
      </p>

      {categories.length === 0 ? (
        <p className="py-8 text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
          Belum ada data pengeluaran
        </p>
      ) : (
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
                  stroke="currentColor"
                  strokeWidth={2}
                  className="text-bajes-black dark:text-white/20"
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
                  className="h-3 w-3 flex-shrink-0 rounded-sm border border-bajes-black dark:border-white/20"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="flex-1 truncate text-xs font-semibold">
                  {cat.icon} {cat.name}
                </span>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                  {cat.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export { ExpenseDonutChart };
