"use client";

import { useState, useMemo } from "react";
import { HistoricalRate, LoanInput, LoanResult } from "@/lib/types";
import { calculateLoanScenario } from "@/lib/calculations";
import { LoanControls } from "@/components/LoanControls";
import { ResultsTable } from "@/components/ResultsTable";
import { useDebounce } from "@/hooks/use-debounce";
import { CostChart } from "@/components/CostChart";

// Extend the result type to include the year for the table
type YearResult = LoanResult & { year: number; originalRate: number };

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

  // Perform calculations for all years when inputs or rates change
  const results: YearResult[] = useMemo(() => {
    return rates.map((record) => {
      const calculation = calculateLoanScenario({
        ...debouncedParams,
        rate: record.rate,
      });

      return {
        ...calculation,
        year: record.year,
        originalRate: record.rate,
      };
    });
  }, [rates, debouncedParams]);

  // Helper to update state cleanly
  const handleParamChange = (updates: Partial<LoanInput>) => {
    setParams((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <LoanControls values={params} onChange={handleParamChange} />

      {/* Cost Chart */}
      <div className={isCalculating ? "opacity-50 transition-opacity" : "transition-opacity"}>
        <CostChart data={results} />
      </div>

      {/* Results Table */}
      <ResultsTable data={results} isAdjusted={debouncedParams.bnmAdjustment} isLoading={isCalculating} />
    </div>
  );
}
