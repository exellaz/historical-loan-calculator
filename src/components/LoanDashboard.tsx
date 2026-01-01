"use client";

import { useState, useMemo } from "react";
import { LoanControls } from "@/components/LoanControls";
import { ResultsTable } from "@/components/ResultsTable";
import { CostChart } from "@/components/CostChart";
import { Slider } from "@/components/ui/slider";
import { MetricCard } from "@/components/MetricCard";
import { useDebounce } from "@/hooks/use-debounce";
import { HistoricalRate, LoanInput } from "@/lib/types";
import { calculateLoanScenario } from "@/lib/calculations";
import { formatRate } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

export default function LoanDashboard({ rates }: { rates: HistoricalRate[] }) {
  // User Inputs
  const [params, setParams] = useState<Omit<LoanInput, "rate">>({
    amount: 10000,
    feeValue: 0,
    feeType: "flat",
    feeTreatment: "upfront",
    bnmAdjustment: false,
  });

  const debouncedParams = useDebounce(params, 500);

  const isCalculating = params !== debouncedParams;

  const minDataYear = rates[0].year;
  const maxDataYear = rates[rates.length - 1].year;
  const [sliderRange, setSliderRange] = useState([minDataYear, maxDataYear]);
  const debouncedRange = useDebounce(sliderRange, 200);

  // Perform calculations for all years when inputs or rates change
  const results = useMemo(() => {
    // Filter first
    const filteredRates = rates.filter(
      (r) => r.year >= debouncedRange[0] && r.year <= debouncedRange[1]
    );

    // Then calculate
    return filteredRates.map((record) => {
      const calculation = calculateLoanScenario({
         ...debouncedParams,
         rate: record.rate
      });

      return { ...calculation, year: record.year, originalRate: record.rate };
    });
  }, [rates, debouncedParams, debouncedRange]);

  // Helper to update state cleanly
  const handleParamChange = (updates: Partial<LoanInput>) => {
    setParams((prev) => ({ ...prev, ...updates }));
  };

  const metrics = useMemo(() => {
    if (results.length === 0) return null;

    // Find Min and Max
    let min = results[0];
    let max = results[0];
    let sum = 0;

    results.forEach(r => {
      if (r.totalCost < min.totalCost) min = r;
      if (r.totalCost > max.totalCost) max = r;
      sum += r.totalCost;
    });

    return {
      min,
      max,
      avg: sum / results.length
    };
  }, [results]);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <LoanControls values={params} onChange={handleParamChange} />

      {/* Cost Chart */}
      <div className={isCalculating ? "opacity-50 transition-opacity" : "transition-opacity"}>
        {/* Timeframe Selector */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-900">Timeframe Filter</h3>
            <div className="flex items-center gap-2">
            {sliderRange !== debouncedRange && (
              <span className="text-xs text-blue-600 animate-pulse">Syncing...</span>
            )}
            </div>
          </div>

          <Slider
            defaultValue={[minDataYear, maxDataYear]}
            min={minDataYear}
            max={maxDataYear}
            step={1}
            value={sliderRange}
            onValueChange={setSliderRange} // Updates state instantly when dragging
            className="py-4"
          />
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="Lowest Cost"
              value={formatCurrency(metrics?.min.totalCost || 0)}
              subtext={`Occurred in ${metrics?.min.year} (${formatRate(metrics?.min.effectiveRate || 0)})`}
            />
            <MetricCard
              label="Average Cost"
              value={formatCurrency(metrics?.avg || 0)}
              subtext={`Across selected ${results.length} years`}
            />
            <MetricCard
              label="Highest Cost"
              value={formatCurrency(metrics?.max.totalCost || 0)}
              subtext={`Occurred in ${metrics?.max.year} (${formatRate(metrics?.max.effectiveRate || 0)})`}
            />
          </div>

          <div className="flex justify-between text-xs text-slate-400 px-1">
            <span>{minDataYear}</span>
            <span>{maxDataYear}</span>
          </div>
        </div>
        <CostChart data={results} />
      </div>

      {/* Results Table */}
      <ResultsTable data={results} isAdjusted={debouncedParams.bnmAdjustment} isLoading={isCalculating} />
    </div>
  );
}
