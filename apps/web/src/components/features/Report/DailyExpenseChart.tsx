"use client";

import { Card } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrencyCompact } from "@/lib/utils/currency";

interface DailyTotal {
  date: string;
  day: number;
  totalExpenseCents: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps): React.ReactElement | null {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="rounded-lg border-2 border-bajes-black bg-white px-3 py-2 shadow-brutal-sm dark:border-white/20 dark:bg-bajes-surface-dark dark:shadow-brutal-dark-sm">
      <p className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">
        Tanggal {label}
      </p>
      <p className="font-display text-sm font-bold">{formatCurrencyCompact(payload[0].value)}</p>
    </div>
  );
}

interface DailyExpenseChartProps {
  data?: DailyTotal[];
}

function DailyExpenseChart({ data = [] }: DailyExpenseChartProps): React.ReactElement {
  return (
    <Card>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Pengeluaran Harian
      </p>

      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
          Belum ada data pengeluaran harian
        </p>
      ) : (
        <div className="h-48 min-h-[1px] min-w-[1px] md:h-64">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-gray-200 dark:text-white/10"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: "currentColor", strokeWidth: 2 }}
                className="text-bajes-black dark:text-white/60"
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => formatCurrencyCompact(v)}
                className="text-gray-500 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="totalExpenseCents"
                fill="#FF6B6B"
                radius={[4, 4, 0, 0]}
                stroke="currentColor"
                strokeWidth={1}
                className="text-bajes-black dark:text-white/20"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}

export { DailyExpenseChart };
