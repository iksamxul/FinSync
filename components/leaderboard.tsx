'use client'; // Use client for potential interactivity later

import React from 'react';
import { dummyLeaderboardData, LeaderboardEntry } from '@/data/dummyLeaderboard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion

interface LeaderboardProps {
  currentUserId?: string; // Optional ID to highlight the current user
  data?: LeaderboardEntry[]; // Optional: allow passing data directly
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Stagger delay between rows
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export function Leaderboard({ currentUserId, data = dummyLeaderboardData }: LeaderboardProps) {
  // Sort data by score descending
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => b.score - a.score);
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Leaderboard</CardTitle>
        <Trophy className="h-5 w-5 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {/* Add motion to header row too? Optional, maybe simpler without */}
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          {/* Wrap TableBody with motion component */}
          <motion.tbody
             variants={containerVariants}
             initial="hidden"
             animate="visible"
           >
            {sortedData.map((entry, index) => (
              {/* Wrap TableRow with motion component */}
              <motion.tr
                key={entry.id}
                variants={rowVariants}
                // Use custom prop if needed for more complex conditions
                // custom={index} 
                className={entry.id === currentUserId ? 'bg-muted/50 font-semibold' : ''}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell className="text-right">{entry.score}</TableCell>
              </motion.tr>
            ))}
          </motion.tbody>
        </Table>
      </CardContent>
    </Card>
  );
} 