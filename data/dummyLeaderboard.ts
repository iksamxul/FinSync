// data/dummyLeaderboard.ts
export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number; // Using 'score' as a generic term, could be streak, points, etc.
}

// Sample data - replace or expand as needed
export const dummyLeaderboardData: LeaderboardEntry[] = [
  { id: 'user1', name: 'Alice', score: 150 },
  { id: 'user2', name: 'Bob', score: 120 },
  { id: 'user-current', name: 'Charlie (You)', score: 135 }, // Example "current" user
  { id: 'user4', name: 'Diana', score: 95 },
  { id: 'user5', name: 'Ethan', score: 180 },
  { id: 'user6', name: 'Fiona', score: 110 },
  { id: 'user7', name: 'George', score: 200 },
]; 