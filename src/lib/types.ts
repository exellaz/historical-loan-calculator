export interface HistoricalRate {
  year: number;
  rate: number;
}

export interface WorldBankItem {
  indicator: {
    id: string;
    value: string;
  };
  country: {
    id: string;
    value: string;
  };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export interface LoanInput {
  amount: number;                       // Loan Amount (RM)
  rate: number;                         // Annual Interest Rate (%)
  feeType: 'flat' | 'percentage';       // Type of Fee
  feeValue: number;                     // The value entered (e.g. 100 or 1.5)
  feeTreatment: 'financed' | 'upfront'; // How the fee is applied
  bnmAdjustment: boolean;               // Toggle for BNM adjustment
}

export interface LoanResult {
  monthlyPayment: number; // Monthly payment amount
  principal: number;      // The amount borrowed
  totalInterest: number;  // Just the interest portion
  totalCost: number;      // Total amount paid over 12 months
  effectiveRate: number;  // The rate actually used (after BNM adjustment)
}
