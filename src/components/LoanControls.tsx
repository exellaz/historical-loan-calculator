"use client";

import { useMemo } from "react";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LoanInput } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const MAX_LOAN_AMOUNT = 1_000_000_000_000;
const MAX_FEE_PERCENT = 1000;
const MAX_FEE_FLAT = 1_000_000_000_000;

interface LoanControlsProps {
  values: Omit<LoanInput, "rate">;
  onChange: (updates: Partial<LoanInput>) => void;
}

export function LoanControls({ values, onChange }: LoanControlsProps) {
  const effectivePrincipal = useMemo(() => {
    const feeAmount = values.feeType === 'percentage'
      ? values.amount * (values.feeValue / 100)
      : values.feeValue;

    return values.feeTreatment === 'financed'
      ? values.amount + feeAmount
      : values.amount;
  }, [values.amount, values.feeValue, values.feeType, values.feeTreatment]);

  const principalString = formatCurrency(effectivePrincipal);

  // Helper to check if Fee Limit is hit
  const isFeeLimitHit =
    (values.feeType === 'percentage' && values.feeValue >= MAX_FEE_PERCENT) ||
    (values.feeType === 'flat' && values.feeValue >= MAX_FEE_FLAT);

  return (
    <div className="grid gap-6 p-6 border rounded-lg shadow-sm bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Loan Amount (RM)</Label>
          <NumberInput
            id="amount"
            value={values.amount}
            onValueChange={(val) => onChange({ amount: Math.min(val, MAX_LOAN_AMOUNT) })}
          />
          {values.amount >= MAX_LOAN_AMOUNT && (
            <p className="text-[10px] text-red-500 font-medium">
              Max limit reached (RM 1,000,000,000,000)
            </p>
          )}
        </div>
        <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Tenure</Label>
            <div className="flex items-center justify-center h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-2 font-bold text-slate-500 cursor-not-allowed text-center">
                12 Months
            </div>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <Label className="text-slate-700 font-medium">Total Principal</Label>
                {values.feeTreatment === 'financed' && values.feeValue > 0 && (
                    <span className="text-[10px] text-blue-600 font-medium animate-pulse">
                        Includes Financed Fee
                    </span>
                )}
            </div>

            <div
              className="flex items-center h-10 w-full rounded-md border border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-700 cursor-not-allowed overflow-hidden"
              title={principalString}
            >
                <span className="truncate w-full">{principalString}</span>
            </div>
        </div>

        {/* Origination Fee */}
        <div className="space-y-2">
          <Label htmlFor="fee">Origination Fee</Label>
          <div className="flex gap-2">
            <NumberInput
              id="fee"
              value={values.feeValue}
              className="flex-1 h-10"
              onValueChange={(val) => {
                const limit = values.feeType === 'percentage' ? MAX_FEE_PERCENT : MAX_FEE_FLAT;
                onChange({ feeValue: Math.min(val, limit) });
              }}
            />
            <select
              className="h-10 border rounded px-2 text-sm bg-white"
              value={values.feeType}
              aria-label="Origination Fee Type"
              onChange={(e) => {
                const newType = e.target.value as "flat" | "percentage";
                let newValue = values.feeValue;

                if (newType === 'percentage' && newValue > MAX_FEE_PERCENT) {
                    newValue = MAX_FEE_PERCENT;
                }
                if (newType === 'flat' && newValue > MAX_FEE_FLAT) {
                    newValue = MAX_FEE_FLAT;
                }

                onChange({
                    feeType: newType,
                    feeValue: newValue
                });
              }}
            >
              <option value="flat">RM</option>
              <option value="percentage">%</option>
            </select>
          </div>
          {isFeeLimitHit && (
            <p className="text-[10px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
              {values.feeType === 'percentage'
                ? "Max limit reached (1000%)"
                : "Max limit reached (RM 1,000,000,000,000)"}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Fee Treatment */}
        <div className="space-y-2">
          <Label>Fee Treatment</Label>
          <RadioGroup
            value={values.feeTreatment}
            onValueChange={(val) => onChange({ feeTreatment: val as 'upfront' | 'financed' })}
            className="flex flex-row gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upfront" id="r1" />
              <Label htmlFor="r1">Upfront</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="financed" id="r2" />
              <Label htmlFor="r2">Financed</Label>
            </div>
          </RadioGroup>
        </div>

        {/* BNM Toggle */}
        <div className="flex items-center space-x-2 border p-3 rounded bg-slate-50">
          <Switch
            id="bnm-mode"
            checked={values.bnmAdjustment}
            onCheckedChange={(checked) => onChange({ bnmAdjustment: checked })}
          />
          <Label htmlFor="bnm-mode" className="cursor-pointer">
            BNM Adjustment (-2.75%)
          </Label>
        </div>
      </div>
    </div>
  );
}
