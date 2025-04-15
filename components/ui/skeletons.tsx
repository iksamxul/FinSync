import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for the leaderboard loading state
export const LeaderboardSkeleton = () => (
  <div className="p-4 bg-card rounded-lg shadow border space-y-4">
    <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-5 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-11/12" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-10/12" />
    <Skeleton className="h-4 w-full" />
  </div>
);

// Skeleton for the tip card loading state
export const TipSkeleton = () => (
  <div className="flex items-start space-x-3 p-4 bg-card rounded-lg shadow border">
    <Skeleton className="h-5 w-5 rounded-full mt-1" />
    <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
    </div>
  </div>
); 