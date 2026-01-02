"use client";

import { LoanInput } from "@/lib/types";
import { LoanControls } from "./LoanControls";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

interface ConfigurationPanelProps {
  isVisible: boolean;
  params: Omit<LoanInput, "rate">;
  onParamChange: (updates: Partial<LoanInput>) => void;
  onClose: () => void;
  showCloseButton: boolean;
}

export function ConfigurationPanel({
  isVisible,
  params,
  onParamChange,
  onClose,
  showCloseButton,
}: ConfigurationPanelProps) {
  return (
    <div
      className={`
        fixed inset-0 z-50 bg-white overflow-y-auto
        transition-transform duration-500 ease-in-out
        ${isVisible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div className="max-w-2xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Configure Loan</h2>
            <p className="text-xs text-slate-500">
              Adjust parameters and timeframe
            </p>
          </div>
          {/* Close button */}
          {showCloseButton && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5 text-slate-500" />
            </Button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-6 space-y-8">
          <LoanControls values={params} onChange={onParamChange} />
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 p-6 bg-white border-t mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Button
            size="lg"
            className="w-full text-base font-bold h-12 bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/20"
            onClick={onClose}
          >
            <Check className="w-5 h-5 mr-2" />
            Generate Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
