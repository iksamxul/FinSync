import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricsCard } from "@/components/metrics-card";
import { StatsChart } from "@/components/stats-chart";
import { VaultTable } from "@/components/vault-table";
import Sidebar from "@/components/sidebar";

export default function Page() {
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="relative">
          <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
          <main className="px-8 lg:px-20 pt-12">
            <div className="mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Overview
              </h1>
              <p className="text-gray-400 mt-2">Aug 13, 2023 - Aug 18, 2023</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <MetricsCard
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800"
                title="Your Balance"
                value="$74,892"
                change={{
                  value: "$1,340",
                  percentage: "-2.1%",
                  isPositive: false,
                }}
              />
              <MetricsCard
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800"
                title="Your Deposits"
                value="$54,892"
                change={{
                  value: "$1,340",
                  percentage: "+13.2%",
                  isPositive: true,
                }}
              />
              <MetricsCard
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800"
                title="Accrued Yield"
                value="$20,892"
                change={{
                  value: "$1,340",
                  percentage: "+1.2%",
                  isPositive: true,
                }}
              />
            </div>

            <div className="mt-8 rounded-2xl bg-gray-900/50 p-6 backdrop-blur-sm border border-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold  text-white">
                  General Statistics
                </h2>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    Today
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    Last week
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    Last month
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    Last 6 month
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    Year
                  </Button>
                </div>
              </div>
              <StatsChart />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
