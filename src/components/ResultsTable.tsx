"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatRate } from "@/lib/utils";
import { LoanResult } from "@/lib/types";
import { memo } from "react";
import { Loader2 } from "lucide-react";

// Combine the calculation result with the year context
type TableRowData = LoanResult & {
  year: number;
  originalRate: number;
};

interface ResultsTableProps {
  data: TableRowData[];
  isAdjusted: boolean; // To control the UI for the rate column
  isLoading?: boolean;
}

const ResultsTableComponent = ({ data, isAdjusted, isLoading }: ResultsTableProps) => {
  if (data.length === 0) {
    return <div className="text-center p-8 text-slate-500">No data available.</div>;
  }

  return (
    <div className="border rounded-md overflow-hidden bg-white shadow-sm relative">

      {/* THE OVERLAY: Only shows when loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded shadow-lg text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="text-sm font-medium">Recalculating...</span>
          </div>
        </div>
      )}
      {/* Scrollable Container for the 47-year list */}
      <div className="max-h-150 overflow-auto relative">
        <Table>
          <TableHeader className="bg-slate-50 sticky top-0 z-10">
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead className="text-right">Interest Rate</TableHead>
              <TableHead className="text-right">Monthly Repayment</TableHead>
              <TableHead className="text-right">Principal</TableHead>
              <TableHead className="text-right">Total Interest</TableHead>
              <TableHead className="text-right font-bold text-slate-900">
                Total Cost
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.year} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">
                  {row.year}
                </TableCell>

                {/* Rate Column */}
                <TableCell className="text-right font-medium">
                  <div className="flex flex-col justify-center">
                    {isAdjusted && row.originalRate !== row.effectiveRate ? (
                      <>
                        <span className="text-xs text-slate-400 line-through">
                          {formatRate(row.originalRate)}
                        </span>
                        <span className="text-emerald-600 font-semibold">
                          {formatRate(row.effectiveRate)}
                        </span>
                      </>
                    ) : (
                      <span>{formatRate(row.originalRate)}</span>
                    )}
                  </div>
                </TableCell>

                {/* Monthly Payment */}
                <TableCell className="text-right font-medium">
                  {formatCurrency(row.monthlyPayment)}
                </TableCell>

                {/* Principal */}
                <TableCell className="text-right font-medium text-slate-500">
                  {formatCurrency(row.principal)}
                </TableCell>

                {/* Total Interest */}
                <TableCell className="text-right font-medium text-slate-500">
                  {formatCurrency(row.totalInterest)}
                </TableCell>

                {/* Total Cost */}
                <TableCell className="text-right font-bold text-slate-900 bg-slate-50/30">
                  {formatCurrency(row.totalCost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const ResultsTable = memo(ResultsTableComponent);
