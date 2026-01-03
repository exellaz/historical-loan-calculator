import { getInterestRates, getIndicatorData } from "@/lib/api";
import { DashboardShell } from "@/components/DashboardShell";

export default async function Home() {
  const [rates, indicators] = await Promise.all([
    getInterestRates(),
    getIndicatorData()
  ]);

  return (
    <main className="min-h-screen bg-slate-50/50">
       <DashboardShell rates={rates} indicators={indicators} />
    </main>
  );
}
