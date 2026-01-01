import { LoanInput, LoanResult } from "@/lib/types";

const NUM_OF_MONTHS = 12;
const BNM_ADJUSTMENT = 2.75;

/**
 * Calculates the monthly payment for a loan.
 * Formula: P = (Pv*R) / [1 - (1 + R)^(-n)]
 */
function calculatePMT(principal: number, annualRatePct: number, months: number): number {
  if (annualRatePct <= 0) return principal / months;

  const monthlyRate = annualRatePct / 100 / NUM_OF_MONTHS;
  return (
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
  );
}

/**
 * The main calculation engine for a single scenario.
 */
export function calculateLoanScenario(input: LoanInput): LoanResult {
  const { amount, rate, feeType, feeValue, feeTreatment, bnmAdjustment } = input;

  let effectiveRate = bnmAdjustment ? rate - BNM_ADJUSTMENT : rate;
  effectiveRate = Math.max(0, effectiveRate);

  const feeAmount = feeType === 'percentage'
    ? amount * (feeValue / 100)
    : feeValue;

  // If "Financed", add fee to loan amount. If "Upfront", loan amount stays same.
  const principal = feeTreatment === 'financed'
    ? amount + feeAmount
    : amount;

  const termMonths = 12; // Fixed 12 months term
  const monthlyPayment = calculatePMT(principal, effectiveRate, termMonths);
  const totalLoanRepayment = monthlyPayment * termMonths;

  const totalCost = feeTreatment === 'upfront'
    ? totalLoanRepayment + feeAmount
    : totalLoanRepayment;

  return {
    monthlyPayment,
    principal,
    totalInterest: totalLoanRepayment - principal,
    totalCost,
    effectiveRate
  };
}
