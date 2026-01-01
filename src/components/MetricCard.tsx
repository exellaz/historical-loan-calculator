"use client";

export function MetricCard({ label, value, subtext }: { label: string, value: string, subtext?: string }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
}
