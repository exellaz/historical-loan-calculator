# Malaysia Historical Loan Calculator

A financial analytics platform that combines macroeconomic trend analysis with a historical loan simulation. This application aggregates real-time economic data from the World Bank API to provide context for personal financing decisions in the Malaysian market.

<div align="center">
  <p>Real-time trends for GDP, Inflation, and Unemployment.</p>
  <img src="https://github.com/user-attachments/assets/cf57676b-b35c-4a66-951c-dd24b5d40604" alt="Indicators Dashboard" width="100%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />

  <br/><br/>

  <p>Interactive visualizations of loan performance over time.</p>
  <img src="https://github.com/user-attachments/assets/d498e5ba-b1d7-4f71-85de-e947a61c2a3b" alt="Loan Dashboard" width="100%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />

  <br/><br/>

  <p>Control panel for adjusting loan parameters.</p>
  <img src="https://github.com/user-attachments/assets/4ddeeeb2-7889-4102-91be-30f73eb97bbe" alt="Config Panel" width="100%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
</div>

## Key Features

* **Historical Context:** Simulates loan performance against historical interest rates.
* **Complex Amortization:** Calculates monthly repayments, total interest, and effective interest rates (EIR).
* **Real-time Data:** Fetches live economic indicators (GDP, Inflation/CPI, Unemployment, Lending Rates) via the World Bank API.
* **Trend Visualization:** Interactive area charts showing historical trends.
* **Export:** One-click CSV export for external analysis.

## Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS & Shadcn/ui
* **Visualization:** Recharts
* **Icons:** Lucide React
* **Data Source:** World Bank Open Data API

## Getting Started

### Prerequisites
* Node.js 24+
* npm or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/exellaz/historical-loan-calculator.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.
