import { getInterestRates } from "@/lib/api";
import { calculateLoanScenario } from "@/lib/calculations";

export default async function Home() {
  const rates = await getInterestRates();

  const testScenario = calculateLoanScenario({
    amount: 10000,
    rate: 10.0,
    feeType: 'flat',
    feeValue: 0,
    feeTreatment: 'upfront',
    bnmAdjustment: false
  });

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Loan Calculator</h1>

      {/* Show the fetched interest rates */}
      <pre className="bg-slate-100 p-4 rounded-md overflow-auto h-64">
        {JSON.stringify(rates, null, 2)}
      </pre>
      {/* Show the test scenario calculation */}
      <pre className="bg-slate-100 p-4 rounded-md overflow-auto mt-6">
        {JSON.stringify(testScenario, null, 2)}
      </pre>

    </main>
  );
}
