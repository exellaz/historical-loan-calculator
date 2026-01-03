"use client";

import { LoanInput, LoanResult } from "@/lib/types";
import { CostChart } from "./CostChart";
import { ResultsTable } from "./ResultsTable";
import { MetricCard } from "@/components/MetricCard";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";
import { Edit3, ChevronRight, Download } from "lucide-react";
import { downloadLoanCSV } from "@/lib/csv-export";
import { Button } from "./ui/button";

interface AnalysisPanelProps {
  isVisible: boolean;
  params: Omit<LoanInput, "rate">;
  effectivePrincipal: number;
  sliderRange: number[];
  onSliderChange: (val: number[]) => void;
  minYear: number;
  maxYear: number;
  isSyncing: boolean;
  isCalculating: boolean;
  results: (LoanResult & { year: number; originalRate: number })[];
  metrics: {
    min: { totalCost: number; year: number };
    max: { totalCost: number; year: number };
    avg: number;
  } | null;
  onConfigureClick: () => void;
}

export function AnalysisPanel({
  isVisible,
  params,
  effectivePrincipal,
  sliderRange,
  onSliderChange,
  minYear,
  maxYear,
  isSyncing,
  isCalculating,
  results,
  metrics,
  onConfigureClick,
}: AnalysisPanelProps) {
  const handleExport = () => {
    const filename = `loan-scenario-${params.amount}.csv`;
    downloadLoanCSV(results, filename);
  };

  return (
    <div
      className={`transition-opacity duration-300 ${
        isVisible ? "block opacity-100" : "hidden opacity-0"
      }`}
    >
      {/* Sticky Summary Bar */}
      <div className="sticky top-4 z-40 px-4 mb-6">
        <div
          onClick={onConfigureClick}
          className="bg-slate-900 text-white rounded-full shadow-lg p-1 pr-4 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-transform active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full">
              <Edit3 className="w-4 h-4 text-blue-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-none">
                {formatCurrency(effectivePrincipal)} (Principal)
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                {sliderRange[0]}-{sliderRange[1]} •{" "}
                {params.bnmAdjustment ? "BNM Adjusted" : "Standard Rate"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-blue-300">
            Configure <ChevronRight className="w-4 h-10" />
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-5xl mx-auto space-y-6 px-4 pb-4">
        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="Lowest Cost"
              value={formatCurrency(metrics.min.totalCost)}
              subtext={`Best year: ${metrics.min.year}`}
            />
            <MetricCard
              label="Average Cost"
              value={formatCurrency(metrics.avg)}
              subtext={`Avg. Interest: ${formatCurrency(
                metrics.avg - params.amount
              )}`}
            />
            <MetricCard
              label="Highest Cost"
              value={formatCurrency(metrics.max.totalCost)}
              subtext={`Worst year: ${metrics.max.year}`}
            />
          </div>
        )}

        {/* Timeframe Slider Card */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
          <div className="flex justify-between items-end">
            <label className="text-sm font-medium text-slate-900">
              Analysis Period
            </label>
            <div className="flex items-center gap-2">
              {isSyncing && (
                <span className="text-[10px] uppercase font-bold text-blue-600 animate-pulse">
                  Syncing...
                </span>
              )}
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded">
                {sliderRange[0]} - {sliderRange[1]}
              </span>
            </div>
          </div>

          <Slider
            defaultValue={[minYear, maxYear]}
            min={minYear}
            max={maxYear}
            step={1}
            value={sliderRange}
            onValueChange={onSliderChange}
            className="py-4"
          />
        </div>

        {/* Chart Card */}
        <div className={isCalculating ? "opacity-50 transition-opacity min-h-100" : "transition-opacity min-h-100"}>
          <CostChart data={results} />
        </div>

        {/* Table Card */}
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-8 text-xs gap-2 bg-white hover:bg-slate-50"
          >
            <Download className="w-3 h-3" />
            <span>Export CSV</span>
          </Button>

          <ResultsTable
            data={results}
            isAdjusted={params.bnmAdjustment}
            isLoading={isCalculating}
          />
        </div>
      </div>
    </div>
  );
}
