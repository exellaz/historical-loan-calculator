"use client";

import { useState, useMemo, useCallback } from "react";
import { HistoricalRate, LoanInput } from "@/lib/types";
import { calculateLoanScenario } from "@/lib/calculations";
import { useDebounce } from "@/hooks/use-debounce";
import { ConfigurationPanel } from "@/components/ConfigurationPanel";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { X } from "lucide-react";

export default function LoanDashboard({ rates }: { rates: HistoricalRate[] }) {

  const hasData = rates && rates.length > 0;
  const minDataYear = hasData ? rates[0].year : new Date().getFullYear();
  const maxDataYear = hasData ? rates[rates.length - 1].year : new Date().getFullYear();

  // View Mode State
  const [viewMode, setViewMode] = useState<"config" | "analysis">("config");

  // Draft State (Mutable): Bound to the Inputs. Updates immediately while typing.
  const [draftParams, setDraftParams] = useState<Omit<LoanInput, "rate">>({
    amount: 10000,
    feeValue: 0,
    feeType: "flat",
    feeTreatment: "upfront",
    bnmAdjustment: false,
  });

  // Active State (Committed): Bound to the Table/Chart. Only updates on "Generate".
  const [activeParams, setActiveParams] = useState<Omit<LoanInput, "rate">>(draftParams);

  // Slider State
  const [sliderRange, setSliderRange] = useState([minDataYear, maxDataYear]);
  const debouncedRange = useDebounce(sliderRange, 300);

  // Handle typing in the form (Updates Draft Only)
  const handleDraftChange = useCallback((updates: Partial<LoanInput>) => {
    setDraftParams((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleCommitAndVisualize = useCallback(() => {
    setActiveParams(draftParams);
    setViewMode("analysis");
  }, [draftParams]);

  const isCalculating = sliderRange !== debouncedRange;

  const effectivePrincipal = useMemo(() => {
    const fee =
    activeParams.feeType === "percentage"
    ? activeParams.amount * (activeParams.feeValue / 100)
    : activeParams.feeValue;
    return activeParams.feeTreatment === "financed"
    ? activeParams.amount + fee
    : activeParams.amount;
  }, [activeParams]);

  const results = useMemo(() => {
    const filteredRates = rates.filter(
      (r) => r.year >= debouncedRange[0] && r.year <= debouncedRange[1]
    );

    // Calculate using Active Params
    return filteredRates.map((record) => {
      const calculation = calculateLoanScenario({
        ...activeParams,
        rate: record.rate,
      });
      return { ...calculation, year: record.year, originalRate: record.rate };
    });
  }, [rates, activeParams, debouncedRange]); // Depends on Active

  const metrics = useMemo(() => {
    if (results.length === 0) return null;
    let min = results[0];
    let max = results[0];
    let sum = 0;
    results.forEach((r) => {
      if (r.totalCost < min.totalCost) min = r;
      if (r.totalCost > max.totalCost) max = r;
      sum += r.totalCost;
    });
    return { min, max, avg: sum / results.length };
  }, [results]);

  if (!rates || rates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-4">
        <div className="bg-slate-100 p-4 rounded-full">
           <X className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">No Data Available</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            We couldn&apos;t load the historical interest rates. Please try again later.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen bg-slate-50/50">

      {/* View Panel (Receives Active params) */}
      <AnalysisPanel
        isVisible={viewMode === "analysis"}
        params={activeParams} // Uses Committed Data
        effectivePrincipal={effectivePrincipal}
        sliderRange={sliderRange}
        onSliderChange={setSliderRange}
        minYear={minDataYear}
        maxYear={maxDataYear}
        isSyncing={isCalculating}
        isCalculating={isCalculating}
        results={results}
        metrics={metrics}
        onConfigureClick={() => setViewMode("config")}
      />

      {/* Configuration Panel (Receives Draft params) */}
      <ConfigurationPanel
        isVisible={viewMode === "config"}
        params={draftParams} // Uses Mutable Draft Data
        onParamChange={handleDraftChange}
        onClose={handleCommitAndVisualize} // Both Closing and Generating now trigger the commit
        showCloseButton={results.length > 0}
      />
    </div>
  );
}
