import { HistoricalRate, WorldBankItem, MacroIndicator } from "@/lib/types";

const WB_API_URL = "https://api.worldbank.org/v2/country/MY/indicator/FR.INR.LEND";

/**
 * Fetches historical interest rate data from the World Bank API.
 * Normalizes and filters the data to include only valid entries from 1975 up to 2022.
 * @returns An array of HistoricalRate objects.
 */
export async function getInterestRates(): Promise<HistoricalRate[]> {
  const res = await fetch(`${WB_API_URL}?format=json&per_page=100&date=1975:2022`, {
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

/**
 * Fetches macro-economic data for Malaysia from the World Bank API.
 * Normalizes, filters, and formats the data for the Macro Dashboard.
 * @returns An array of MacroIndicator objects.
 */
export async function getIndicatorData(): Promise<MacroIndicator[]> {
  const startYear = 1975;
  const endYear = 2022;
  const INDICATORS = {
    gdp: {
      code: "NY.GDP.MKTP.KD.ZG",
      label: "GDP Growth",
      unit: "%",
      desc: "Annual percentage growth rate of GDP.",
    },
    inflation: {
      code: "FP.CPI.TOTL.ZG",
      label: "Inflation (CPI)",
      unit: "%",
      desc: "Annual percentage change in cost of consumer goods.",
    },
    unemployment: {
      code: "SL.UEM.TOTL.ZS",
      label: "Unemployment",
      unit: "%",
      desc: "% of total labor force looking for work.",
    },
    lendingRate: {
      code: "FR.INR.LEND",
      label: "Avg Lending Rate",
      unit: "%",
      desc: "Bank rate that usually meets the short- and medium-term financing needs.",
    },
  };

  const urls = Object.values(INDICATORS).map(
    (ind) =>
      `https://api.worldbank.org/v2/country/MY/indicator/${ind.code}?format=json&date=${startYear}:${endYear}&per_page=100`
  );

  try {
    const responses = await Promise.all(
      urls.map((url) =>
        fetch(url, {
          next: { revalidate: 86400 },
        })
      )
    );

    for (const res of responses) {
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.statusText}`);
      }
    }

    const rawDataList = await Promise.all(responses.map((res) => res.json()));

    return Object.values(INDICATORS).map((ind, index) => {
      const rawRecords: WorldBankItem[] = rawDataList[index][1];

      if (!rawRecords) {
        console.warn(`No records found for indicator: ${ind.code}`);
        return {
          code: ind.code,
          label: ind.label,
          unit: ind.unit,
          description: ind.desc,
          currentValue: 0,
          history: [],
        };
      }

      // Normalize and filter rawData
      const history = rawRecords
        .filter((item) => item.value !== null && item.date)
        .map((item) => ({
          year: parseInt(item.date, 10),
          value: Number(item.value?.toFixed(2)),
        }))
        .sort((a, b) => a.year - b.year);

      const latest = history[history.length - 1];

      return {
        code: ind.code,
        label: ind.label,
        unit: ind.unit,
        description: ind.desc,
        currentValue: latest ? latest.value : 0,
        history,
      };
    });
  } catch (error) {
    console.error("World Bank API Error:", error);
    return [];
  }
}

