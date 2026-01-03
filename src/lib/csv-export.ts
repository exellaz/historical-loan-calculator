import { LoanResult } from "./types";

type CSVRow = LoanResult & {
  year: number;
  originalRate: number;
};

export function downloadLoanCSV(data: CSVRow[], filename = "loan-scenario.csv") {
  if (!data || data.length === 0) {
    console.warn("No data available to export.");
    return;
  }

  const headers = [
    "Year",
    "Original Interest Rate (%)",
    "Effective Interest Rate (%)",
    "Principal (RM)",
    "Monthly Repayment (RM)",
    "Total Interest (RM)",
    "Total Cost (RM)"
  ];

  const csvRows = data.map((row) => {
    return [
      row.year,
      row.originalRate.toFixed(2),
      row.effectiveRate.toFixed(2),
      row.principal.toFixed(2),
      row.monthlyPayment.toFixed(2),
      row.totalInterest.toFixed(2),
      row.totalCost.toFixed(2),
    ].join(",");
  });

  const csvString = [headers.join(","), ...csvRows].join("\n");

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
