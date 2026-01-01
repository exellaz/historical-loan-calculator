import { HistoricalRate, WorldBankItem } from "@/lib/types";

const WB_API_URL = "https://api.worldbank.org/v2/country/MY/indicator/FR.INR.LEND";

export async function getInterestRates(): Promise<HistoricalRate[]> {
  const res = await fetch(`${WB_API_URL}?format=json&per_page=100`, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.statusText}`);
  }

  const data = await res.json();
  const rawData: WorldBankItem[] = data[1];
  if (!rawData) {
    return [];
  }

  // Normalize and filter rawData
  const normalized: HistoricalRate[] = rawData
    .filter((item) => item.value !== null && item.date)
    .map((item) => ({
      year: parseInt(item.date, 10),
      rate: Number(item.value?.toFixed(2)),
    }))
    .filter((item) => item.year <= 2022) // Filter data up to 2022
    .sort((a, b) => a.year - b.year);

  return normalized;
}
