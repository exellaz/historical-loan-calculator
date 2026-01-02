"use client";

import { useState, useMemo, useCallback } from "react";
import { HistoricalRate, LoanInput } from "@/lib/types";
import { calculateLoanScenario } from "@/lib/calculations";
import { useDebounce } from "@/hooks/use-debounce";
import { ConfigurationPanel } from "@/components/ConfigurationPanel";
import { AnalysisPanel } from "@/components/AnalysisPanel";

export default function LoanDashboard({ rates }: { rates: HistoricalRate[] }) {
  const minDataYear = rates[0].year;
  const maxDataYear = rates[rates.length - 1].year;

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
