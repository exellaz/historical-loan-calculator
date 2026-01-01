"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface NumberInputProps extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> {
  value: number;
  onValueChange: (val: number) => void;
}

export function NumberInput({
  value,
  onValueChange,
  className,
  ...props
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = React.useState(value.toString());

  // Sync with parent changes (e.g., if you reset the form from the parent)
  React.useEffect(() => {
    // Only update if the parent value is significantly different from what we show
    // This prevents the cursor from jumping when you type "1.0"
    if (Number(displayValue) !== value && displayValue !== value.toString() + ".") {
      setDisplayValue(value.toString());
    }
  }, [value, displayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Regex: Allow digits and a single optional decimal point
    if (!/^\d*\.?\d*$/.test(inputValue)) return;

    // UX: Remove leading zero unless it's "0." or just "0"
    let cleanValue = inputValue;
    if (cleanValue.length > 1 && cleanValue.startsWith("0") && cleanValue[1] !== ".") {
      cleanValue = cleanValue.substring(1);
    }

    setDisplayValue(cleanValue);

    // Pass valid number to parent, or 0 if empty
    if (cleanValue === "") {
      onValueChange(0);
    } else {
      const parsed = parseFloat(cleanValue);
      if (!isNaN(parsed)) onValueChange(parsed);
    }
  };

  const handleBlur = () => {
    if (displayValue === "" || displayValue === ".") {
      setDisplayValue("0");
      onValueChange(0);
    }
  };

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
}
