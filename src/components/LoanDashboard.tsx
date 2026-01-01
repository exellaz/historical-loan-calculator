"use client";

import { useState, useMemo } from "react";
import { HistoricalRate, LoanInput, LoanResult } from "@/lib/types";
import { calculateLoanScenario } from "@/lib/calculations";
import { LoanControls } from "@/components/LoanControls";

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

  // Perform calculations for all years when inputs or rates change
  const results: YearResult[] = useMemo(() => {
    return rates.map((record) => {
      const calculation = calculateLoanScenario({
        ...params,
        rate: record.rate,
      });

      return {
        ...calculation,
        year: record.year,
        originalRate: record.rate,
      };
    });
  }, [rates, params]);

  // Helper to update state cleanly
  const handleParamChange = (updates: Partial<LoanInput>) => {
    setParams((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <LoanControls values={params} onChange={handleParamChange} />

      {/* TODO: Add charts for visualization */}
      <div className="p-4 border border-dashed rounded bg-slate-50 text-center text-slate-500">
        Chart will go here
      </div>

      {/* Results Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3">Year</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Monthly (RM)</th>
              <th className="p-3">Total Cost (RM)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.year} className="border-b last:border-0 hover:bg-slate-50">
                <td className="p-3 font-medium">{r.year}</td>
                <td className="p-3">
                  {r.effectiveRate.toFixed(2)}%
                  {params.bnmAdjustment && (
                     <span className="text-xs text-slate-400 ml-1 line-through">
                       {r.originalRate.toFixed(2)}%
                     </span>
                  )}
                </td>
                <td className="p-3">{r.monthlyPayment.toFixed(2)}</td>
                <td className="p-3">{r.totalCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
