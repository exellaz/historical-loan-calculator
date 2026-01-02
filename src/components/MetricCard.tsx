"use client";

function getFontSize(textLength: number) {
  if (textLength > 16) return "text-lg";  // Smallest for huge numbers
  if (textLength > 12) return "text-xl";  // Medium for large numbers
  return "text-2xl";                      // Default for standard numbers
}

export function MetricCard({ label, value, subtext }: { label: string, value: string, subtext?: string }) {
  const sizeClass = getFontSize(value.length);
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
      <p className={`${sizeClass} font-bold text-slate-900 mt-1 transition-all duration-300`}>{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
}
