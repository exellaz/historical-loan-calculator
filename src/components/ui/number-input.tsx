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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2, // Allow decimals if needed
      useGrouping: true,        // Enable commas
    }).format(num);
  };

  const [displayValue, setDisplayValue] = React.useState(formatNumber(value));

  // Sync with parent changes (e.g., if you reset the form from the parent)
  React.useEffect(() => {
    const cleanString = displayValue.replace(/,/g, "");
    // Only update if the parent value is significantly different from what we show
    // This prevents the cursor from jumping when you type "1.0"
    const numericDisplay = cleanString === "" ? 0 : parseFloat(cleanString);
    if (numericDisplay !== value) {
      setDisplayValue(formatNumber(value));
    }
  }, [value, displayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Regex: Allow digits, commas and a single optional decimal point
    if (!/^[\d,]*\.?\d*$/.test(inputValue)) return;

    if (inputValue.length > 1 && inputValue.startsWith("0") && inputValue[1] !== ".") {
       inputValue = inputValue.substring(1);
    }
    setDisplayValue(inputValue);

    const cleanString = inputValue.replace(/,/g, "");
    if (cleanString === "" || cleanString === ".") {
      onValueChange(0);
    } else {
      const parsed = parseFloat(cleanString);
      if (!isNaN(parsed)) {
        onValueChange(parsed);
      }
    }
  };

  const handleFocus = () => {
    const rawValue = displayValue.replace(/,/g, "");
    if (rawValue === "0") {
        setDisplayValue("");
    } else {
        setDisplayValue(rawValue);
    }
  };

  const handleBlur = () => {
    if (displayValue === "" || displayValue === ".") {
      setDisplayValue("0");
      onValueChange(0);
    } else {
      const cleanString = displayValue.replace(/,/g, "");
      const parsed = parseFloat(cleanString);
      setDisplayValue(formatNumber(parsed));
    }
  };

  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
    />
  );
}
