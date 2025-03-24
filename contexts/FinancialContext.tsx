"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  FinancialProfile,
  Transaction,
  MonthlyStats,
} from "@/lib/financial-data";
import { getTransactions, getFinancialProfile } from "@/lib/financial-service";

interface FinancialContextType {
  profile: FinancialProfile | null;
  isLoading: boolean;
  error: Error | null;
}

const FinancialContext = createContext<FinancialContextType>({
  profile: null,
  isLoading: true,
  error: null,
});

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        console.log("Fetching financial data...");
        const transactions = await getTransactions();
        console.log("Transactions:", transactions);

        const profileData = await getFinancialProfile("user123");
        console.log("Profile:", profileData);

        if (!profileData) {
          throw new Error("Profile not found");
        }

        const monthlyStats = calculateMonthlyStats(transactions);
        console.log("Monthly stats:", monthlyStats);

        setProfile({
          userId: profileData.user_id || "user123",
          name: profileData.name || "User",
          monthlyIncome: profileData.monthly_income || 0,
          savingsGoal: profileData.savings_goal || 0,
          totalBalance: profileData.total_balance || 0,
          transactions: transactions || [],
          monthlyStats: monthlyStats,
        });
      } catch (e) {
        console.error("Error loading financial data:", e);
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <FinancialContext.Provider value={{ profile, isLoading, error }}>
      {children}
    </FinancialContext.Provider>
  );
}

export const useFinancial = () => useContext(FinancialContext);

// Helper function to calculate monthly stats
function calculateMonthlyStats(transactions: Transaction[]): MonthlyStats[] {
  const monthlyData: {
    [key: string]: { earnings: number; spendings: number };
  } = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthKey = date.toLocaleString("default", { month: "short" });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { earnings: 0, spendings: 0 };
    }

    if (transaction.type === "income") {
      monthlyData[monthKey].earnings += transaction.amount;
    } else {
      monthlyData[monthKey].spendings += transaction.amount;
    }
  });

  return Object.entries(monthlyData).map(([date, data]) => ({
    date,
    earnings: data.earnings,
    spendings: data.spendings,
  }));
}
