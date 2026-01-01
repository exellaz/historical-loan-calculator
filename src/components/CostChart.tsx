"use client";

import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { LoanResult } from "@/lib/types";

type ChartData = LoanResult & { year: number };

interface CostChartProps {
  data: ChartData[];
}

const formatCompactNumber = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(number);
};

function CostChartComponent({ data }: CostChartProps) {
  if (!data || data.length === 0) return null;

  const totalCostSum = data.reduce((acc, curr) => acc + curr.totalCost, 0);
  const averageCost = totalCostSum / data.length;

  // This ensures the line doesn't touch the very top or bottom of the chart area
  const minVal = Math.min(...data.map(d => d.totalCost));
  const maxVal = Math.max(...data.map(d => d.totalCost));
  const buffer = (maxVal - minVal) * 0.1; // Add 10% padding

  return (
    <div className="h-87.5 w-full p-4 pt-6 border rounded-lg bg-white shadow-sm">
      <div className="mb-4 px-2 flex justify-between items-center">
        <h3 className="text-sm font-medium text-slate-900">
          Historical Total Cost Trend
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="block w-2 h-2 rounded-full bg-slate-900"></span>
            <span className="text-slate-500">Your Loan Cost</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="block w-2 h-0.5 border-t border-dashed border-red-500"></span>
            <span className="text-slate-500">Historical Avg</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatCompactNumber}
            width={45}
            domain={[minVal - buffer, maxVal + buffer]}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
            }}
            itemStyle={{ fontSize: "12px", color: "#0f172a", fontWeight: 600 }}
            labelStyle={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}
            formatter={(value: number | undefined) => [formatCurrency(value ?? 0), "Total Cost"]}
            labelFormatter={(label) => `Year: ${label}`}
          />

          <Line
            type="monotone"
            dataKey="totalCost"
            stroke="#0f172a"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6, fill: "#0f172a" }}
            animationDuration={1000}
          />

          <ReferenceLine
            y={averageCost}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export const CostChart = memo(CostChartComponent);
