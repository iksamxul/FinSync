import { dummyLeaderboardData, LeaderboardEntry } from "@/data/dummyLeaderboard";
import { getTodaysFinancialTip, Tip } from "@/data/dummyTips"; // Import tip logic

// Simulates fetching leaderboard data from an API
export const getLeaderboardData = async (): Promise<LeaderboardEntry[]> => {
  console.log("Mock API: Fetching leaderboard data...");

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600)); // 600ms delay

  console.log("Mock API: Leaderboard data fetched.");
  // In a real API, you'd fetch from your backend here
  // For now, return the dummy data
  return Promise.resolve(dummyLeaderboardData);
};

// Simulates fetching the daily financial tip
export const getDailyTip = async (): Promise<Tip> => {
    console.log("Mock API: Fetching daily tip...");
    // Simulate slightly shorter delay for variety
    await new Promise(resolve => setTimeout(resolve, 400)); 
    const tip = getTodaysFinancialTip(); // Get the actual tip based on date
    console.log("Mock API: Daily tip fetched.", tip);
    return Promise.resolve(tip);
}

// We can add more mock API functions here later (e.g., for questions) 