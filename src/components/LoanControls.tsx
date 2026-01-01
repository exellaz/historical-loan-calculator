"use client";

import React from "react";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LoanInput } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LoanControlsProps {
  values: Omit<LoanInput, "rate">;
  onChange: (updates: Partial<LoanInput>) => void;
}

export function LoanControls({ values, onChange }: LoanControlsProps) {
  return (
    <div className="grid gap-6 p-6 border rounded-lg shadow-sm bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Loan Amount (RM)</Label>
          <NumberInput
            id="amount"
            value={values.amount}
            onValueChange={(val) => onChange({ amount: val })}
          />
        </div>

        {/* Origination Fee */}
        <div className="space-y-2">
          <Label htmlFor="fee">Origination Fee</Label>
          <div className="flex gap-2">
            <NumberInput
              id="fee"
              value={values.feeValue}
              onValueChange={(val) => onChange({ feeValue: val })}
              className="flex-1"
            />
            <select
              className="border rounded px-2 text-sm"
              value={values.feeType}
              onChange={(e) =>
                onChange({ feeType: e.target.value as "flat" | "percentage" })
              }
            >
              <option value="flat">RM</option>
              <option value="percentage">%</option>
            </select>
          </div>
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
