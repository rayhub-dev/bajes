"use client";

import { Card } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrencyCompact } from "@/lib/utils/currency";

interface DailyTotal {
  date: string;
  day: number;
  totalExpenseCents: number;
}

// Generate mock data for 30 days
const MOCK_DAILY: DailyTotal[] = Array.from({ length: 30 }, (_, i) => ({
  date: `2026-04-${String(i + 1).padStart(2, "0")}`,
  day: i + 1,
  totalExpenseCents: Math.floor(Math.random() * 200000) + 10000,
}));

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps): React.ReactElement | null {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="rounded-lg border-2 border-bajes-black bg-white px-3 py-2 shadow-brutal-sm">
      <p className="text-[10px] font-bold uppercase text-gray-500">Tanggal {label}</p>
      <p className="font-display text-sm font-bold">{formatCurrencyCompact(payload[0].value)}</p>
    </div>
  );
}

interface DailyExpenseChartProps {
  data?: DailyTotal[];
}

function DailyExpenseChart({ data = MOCK_DAILY }: DailyExpenseChartProps): React.ReactElement {
  return (
    <Card>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
        Pengeluaran Harian
      </p>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "#000", strokeWidth: 2 }}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatCurrencyCompact(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="totalExpenseCents"
              fill="#FF6B6B"
              radius={[4, 4, 0, 0]}
              stroke="#000"
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export { DailyExpenseChart };
