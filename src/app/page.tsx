import { getInterestRates } from "@/lib/api";
import LoanDashboard from "@/components/LoanDashboard";

export default async function Home() {
  const rates = await getInterestRates();

  return (
    <main className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Malcan Loan Calculator</h1>
        <p className="text-slate-500 mt-2">
          Historical lending analysis based on World Bank data (1975-2022).
        </p>
      </div>

      {/* Pass the server-fetched data to the client component */}
      <LoanDashboard rates={rates} />
    </main>
  );
}
