"use client";

import Sidebar from "@/components/sidebar";
import { MetricsCard } from "@/components/metrics-card";
import { StatsChart } from "@/components/stats-chart";
import { VaultTable } from "@/components/vault-table";
import { useFinancial } from "@/contexts/FinancialContext";
import { analyzeSpending } from "@/lib/financial-data";
import { useEffect, useState } from "react";

export default function Page() {
  const { profile, isLoading } = useFinancial();
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      const spendingAnalysis = analyzeSpending(profile);
      setAnalysis(spendingAnalysis);
    }
  }, [profile]);

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>No data available</div>;

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
                title="Monthly Spending"
                value={
                  analysis ? `$${analysis.totalSpent.toFixed(2)}` : "Loading..."
                }
                change={{
                  value: analysis
                    ? `${analysis.percentOfIncome.toFixed(1)}% of income`
                    : "",
                  percentage: "",
                  isPositive: false,
                }}
              />
              <MetricsCard
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800"
                title="Savings Status"
                value={
                  analysis
                    ? `$${analysis.remainingIncome.toFixed(2)}`
                    : "Loading..."
                }
                change={{
                  value: `Goal: $${profile.savingsGoal}`,
                  percentage: analysis
                    ? analysis.onTrackForSavings
                      ? "On Track"
                      : "Off Track"
                    : "",
                  isPositive: analysis ? analysis.onTrackForSavings : false,
                }}
              />
              <MetricsCard
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800"
                title="Total Balance"
                value={`$${profile.totalBalance.toFixed(2)}`}
                change={{
                  value: "Available Balance",
                  percentage: "Total Assets",
                  isPositive: true,
                }}
              />
            </div>

            <div className="mt-8 rounded-2xl bg-gray-900/50 p-6 backdrop-blur-sm border border-gray-800">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Visualise Spending
                </h2>
              </div>
              <StatsChart />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
