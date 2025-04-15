'use client';

import { useState, useEffect, useCallback } from 'react';

const STREAK_STORAGE_KEY = 'finSyncStreakData';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string | null; // Store date as ISO string YYYY-MM-DD
}

// Helper function to get today's date as YYYY-MM-DD string
const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper function to calculate the difference in days between two date strings
const daysDifference = (dateStr1: string, dateStr2: string): number => {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  // Discard time and timezone information for accurate day difference
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data from Local Storage
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STREAK_STORAGE_KEY);
      if (storedData) {
        const parsedData: StreakData = JSON.parse(storedData);
        // Basic validation
        if (parsedData && typeof parsedData.currentStreak === 'number' && typeof parsedData.longestStreak === 'number') {
           setStreakData(parsedData);
        }
      } else {
        // Initialize if nothing is stored
        setStreakData({ currentStreak: 0, longestStreak: 0, lastLoginDate: null });
      }
    } catch (error) {
      console.error("Failed to load or parse streak data from localStorage:", error);
      // Set default state in case of error
      setStreakData({ currentStreak: 0, longestStreak: 0, lastLoginDate: null });
    }
    setIsInitialized(true);
  }, []);

  // Persist data to Local Storage whenever it changes
  useEffect(() => {
    if (isInitialized) { // Only save after initial load
        try {
            localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakData));
        } catch (error) {
            console.error("Failed to save streak data to localStorage:", error);
        }
    }
  }, [streakData, isInitialized]);

  // Function to call when user performs the 'activity' (e.g., app load)
  const recordActivity = useCallback(() => {
    if (!isInitialized) return; // Don't run before initialization

    const today = getTodayDateString();
    const lastLogin = streakData.lastLoginDate;

    if (lastLogin === today) {
      // Already recorded activity today
      return;
    }

    let updatedStreak: StreakData;

    if (lastLogin) {
      const diff = daysDifference(lastLogin, today);

      if (diff === 1) {
        // Consecutive day
        const newCurrentStreak = streakData.currentStreak + 1;
        updatedStreak = {
          currentStreak: newCurrentStreak,
          longestStreak: Math.max(streakData.longestStreak, newCurrentStreak),
          lastLoginDate: today,
        };
      } else if (diff > 1) {
        // Streak broken
        updatedStreak = {
          currentStreak: 1, // Start new streak
          longestStreak: streakData.longestStreak,
          lastLoginDate: today,
        };
      } else {
        // Edge case: date is same or in the past (shouldn't happen with check above, but safe)
         updatedStreak = { ...streakData }; // No change
      }
    } else {
      // First login ever (or after clearing storage)
      updatedStreak = {
        currentStreak: 1,
        longestStreak: Math.max(streakData.longestStreak, 1),
        lastLoginDate: today,
      };
    }

    setStreakData(updatedStreak);

  }, [streakData, isInitialized]);

  // Record activity automatically once when the hook is mounted (and initialized)
  useEffect(() => {
    if (isInitialized) {
      recordActivity();
    }
  }, [isInitialized, recordActivity]);

  return {
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      isLoading: !isInitialized, // Flag to indicate if data has been loaded
  };
} 