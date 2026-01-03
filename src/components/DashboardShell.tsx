"use client";

import { useState } from "react";
import { HistoricalRate } from "@/lib/types";
import { MacroIndicator } from "@/lib/types";
import { IndicatorsDashbaord } from "@/components/IndicatorsDashboard";
import LoanDashboard from "@/components/LoanDashboard";

interface DashboardShellProps {
  rates: HistoricalRate[];
  indicators: MacroIndicator[];
}

export function DashboardShell({ rates, indicators }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState<"calculator" | "indicators">("calculator");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">

      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Historical Loan Calculator</h1>
        <p className="text-slate-500 mt-2">Analyze historical economic data and simulate loan scenarios.</p>
      </div>

      {/* Tab Switcher */}
      <div className="mb-8">
        <div className="inline-grid grid-cols-2 bg-slate-200/50 p-1 rounded-lg w-full max-w-md">
          <button
              onClick={() => setActiveTab("calculator")}
              className={`
              text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-200
              ${activeTab === "calculator"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }
              `}
          >
            Loan Calculator
          </button>
          <button
            onClick={() => setActiveTab("indicators")}
            className={`
              text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-200
              ${activeTab === "indicators"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }
            `}
          >
            Economic Overview
          </button>
        </div>
      </div>

      <div className={activeTab === "indicators" ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
        <IndicatorsDashbaord data={indicators} />
      </div>

      <div className={activeTab === "calculator" ? "block animate-in fade-in slide-in-from-bottom-4 duration-500" : "hidden"}>
        <LoanDashboard rates={rates} />
      </div>

    </div>
  );
}
