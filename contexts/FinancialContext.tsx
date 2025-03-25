"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  ProfileError,
  type Profile,
} from "@/lib/services/profiles";
import type { MonthlyStats, Transaction } from "@/lib/financial-data";

interface FinancialProfile {
  userId: string;
  name: string;
  monthlyIncome: number;
  savingsGoal: number;
  totalBalance: number;
  transactions: Transaction[];
  monthlyStats: MonthlyStats[];
}

interface FinancialContextType {
  profile: FinancialProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: {
    monthlyIncome: number;
    savingsGoal: number;
  }) => Promise<void>;
}

const FinancialContext = createContext<FinancialContextType>({
  profile: null,
  isLoading: true,
  error: null,
  updateProfile: async () => {},
});

function calculateMonthlyStats(transactions: Transaction[]): MonthlyStats[] {
  const monthlyData: Record<string, { earnings: number; spendings: number }> =
    {};

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

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FinancialProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profileData = await getProfile("user123");

      setProfile({
        userId: profileData.user_id,
        name: profileData.name,
        monthlyIncome: profileData.monthly_income,
        savingsGoal: profileData.savings_goal,
        totalBalance: profileData.total_balance,
        transactions: profileData.transactions || [],
        monthlyStats: calculateMonthlyStats(profileData.transactions || []),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
      console.error("Profile load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (updates: {
    monthlyIncome: number;
    savingsGoal: number;
  }) => {
    try {
      if (!profile) throw new Error("No profile loaded");

      setError(null);
      console.log("Updating with:", updates);
      const updated = await updateProfile(profile.userId, {
        monthly_income: updates.monthlyIncome,
        savings_goal: updates.savingsGoal,
      });

      // Reload the full profile to get fresh data
      await loadProfile();
    } catch (err) {
      const message =
        err instanceof ProfileError ? err.message : "Failed to update profile";
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <FinancialContext.Provider
      value={{
        profile,
        isLoading,
        error,
        updateProfile: handleUpdateProfile,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export const useFinancial = () => useContext(FinancialContext);
