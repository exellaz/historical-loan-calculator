"use client";

import { MacroIndicator } from "@/lib/types";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { useMemo } from "react";
import { HistoryItem } from "@/lib/types";


// Returns 'positive' (Green) or 'negative' (Red) based on the indicator type and trend.
function getIndicatorSentiment(code: string, currentValue: number, previousValue: number) {
  const isRising = currentValue > previousValue;

  // Indicators where Rising = Bad (Inflation, Unemployment)
  if (code.includes("CPI") || code.includes("UEM")) {
    return isRising ? "negative" : "positive";
  }

  // Indicators where Rising = Good (GDP)
  return isRising ? "positive" : "negative";
}

function useMergedData(
  indicatorHistory: HistoryItem[], rateHistory: HistoryItem[]
) {
  return useMemo(() => {
    return indicatorHistory.map((item) => {
      const rateItem = rateHistory.find((r) => r.year === item.year);
      return {
        year: item.year,
        value: item.value,
        rate: rateItem ? rateItem.value : null,
      };
    });
  }, [indicatorHistory, rateHistory]);
}

function MacroCard({
  data,
  rateData
}: {
  data: MacroIndicator;
  rateData: MacroIndicator
}) {
  const mergedData = useMergedData(data.history, rateData.history);

  // Determine Trend based on last 2 years
  const history = data.history;
  const current = history[history.length - 1]?.value || 0;
  const previous = history[history.length - 2]?.value || 0;
  const sentiment = getIndicatorSentiment(data.code, current, previous);

  // Green (Success) vs Red (Destructive)
  const themeColor = sentiment === "positive" ? "#10b981" : "#f43f5e"; // Emerald-500 vs Rose-500
  const strokeColor = sentiment === "positive" ? "#059669" : "#e11d48"; // Emerald-600 vs Rose-600

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col h-87.5">

      {/* Card Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            {data.label}
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-slate-900">
              {data.currentValue}
              <span className="text-base font-normal text-slate-400 ml-1">{data.unit}</span>
            </span>

            {/* Trend Badge */}
            <div className={`
              flex items-center text-xs font-bold px-1.5 py-0.5 rounded
              ${sentiment === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}
            `}>
              {current > previous ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(current - previous).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="group relative">
           <Info className="w-4 h-4 text-slate-300 hover:text-slate-500 cursor-help" />
           <div className="absolute right-0 top-6 w-56 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none leading-relaxed">
             {data.description}
           </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-0 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mergedData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${data.code}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColor} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="year" tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} minTickGap={30}/>
            <YAxis tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} domain={['auto', 'auto']}/>

            <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '12px', padding: 0 }}
            />

            <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: '11px' }}/>

            {/* Primary Indicator Area (Sentiment Colored) */}
            <Area
                name={data.label}
                type="monotone"
                dataKey="value"
                stroke={strokeColor}
                fill={`url(#color-${data.code})`}
                strokeWidth={2}
            />

            {/* Benchmark Line (Interest Rate) */}
            <Line
                name="Interest Rate"
                type="monotone"
                dataKey="rate"
                stroke="#1e293b"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="4 4"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function IndicatorsDashbaord({ data }: { data: MacroIndicator[] }) {
  if (!data || data.length === 0) return null;

  const lendingRateData = data.find(d => d.code === "FR.INR.LEND");
  const otherIndicators = data.filter(d => d.code !== "FR.INR.LEND");

  if (!lendingRateData) return <div>Data Error: Lending Rate missing</div>;

  return (
    <div className="space-y-6">

       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Economic Overview</h2>
            <p className="text-sm text-slate-500 mt-1">
              Key market indicators affecting the cost of borrowing in Malaysia.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
             <div className="flex items-center gap-1.5">
               <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Positive Trend
             </div>
             <div className="flex items-center gap-1.5">
               <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Negative Trend
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {otherIndicators.map((indicator) => (
           <MacroCard
             key={indicator.code}
             data={indicator}
             rateData={lendingRateData}
           />
         ))}
       </div>
    </div>
  );
}
