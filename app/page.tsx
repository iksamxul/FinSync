'use client';

import { MessageSquareQuote } from "lucide-react";
import { Leaderboard } from "@/components/leaderboard";
import { Questionnaire } from "@/components/questionnaire";
import { setupQuestions, getTodaysDailyQuestion, Question } from "@/data/dummyQuestions";
import { getLeaderboardData, getDailyTip } from "@/lib/api/mock";
import type { LeaderboardEntry } from "@/data/dummyLeaderboard";
import type { Tip } from "@/data/dummyTips";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LeaderboardSkeleton, TipSkeleton } from "@/components/ui/skeletons";
import { toast } from "sonner";

const SETUP_ANSWERS_KEY = 'finSyncSetupAnswers';

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 15,
    },
  },
};

export default function Page() {
  const currentUserId = "user-current";

  // --- Questionnaire State ---
  const [answeredSetupIds, setAnsweredSetupIds] = useState<Set<string>>(new Set());
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);
  const todaysDailyQuestion = React.useMemo(() => getTodaysDailyQuestion(), []);
  const [showDailyQuestion, setShowDailyQuestion] = useState(true);

  // --- Daily Tip State ---
  const [todaysTip, setTodaysTip] = useState<Tip | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(true);

  // --- Leaderboard State ---
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  // Load data on mount
  useEffect(() => {
    // Load setup answers
    const loadSetupAnswers = () => {
        const storedAnswers = localStorage.getItem(SETUP_ANSWERS_KEY);
        if (storedAnswers) {
          try {
            const parsedIds = JSON.parse(storedAnswers);
            if (Array.isArray(parsedIds)) {
              setAnsweredSetupIds(new Set(parsedIds));
            }
          } catch (e) {
            console.error("Failed to parse setup answers from localStorage", e);
          }
        }
        setIsLoadingAnswers(false);
    };

    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
      try {
        setIsLoadingLeaderboard(true);
        const data = await getLeaderboardData();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };

    // Fetch daily tip
    const fetchDailyTip = async () => {
        try {
            setIsLoadingTip(true);
            const tipData = await getDailyTip();
            setTodaysTip(tipData);
        } catch (error) {
            console.error("Failed to fetch daily tip:", error);
        } finally {
            setIsLoadingTip(false);
        }
    };
    
    // Run all fetches
    loadSetupAnswers();
    fetchLeaderboard();
    fetchDailyTip();

  }, []);

  // Find the first unanswered setup question
  const nextSetupQuestion = React.useMemo(() => {
    if (isLoadingAnswers) return null;
    return setupQuestions.find(q => !answeredSetupIds.has(q.id)) || null;
  }, [answeredSetupIds, isLoadingAnswers]);

  // Handler for submitting/skipping setup questions
  const handleSetupAnswer = (questionId: string, answer?: string | number) => {
    console.log(`Setup Answered: ${questionId}`, answer);
    const newAnsweredIds = new Set(answeredSetupIds);
    newAnsweredIds.add(questionId);
    setAnsweredSetupIds(newAnsweredIds);
    localStorage.setItem(SETUP_ANSWERS_KEY, JSON.stringify(Array.from(newAnsweredIds)));
    toast.success("Progress saved!");
  };

  // Handler for the daily buzz question
  const handleDailyAnswer = (questionId: string, answer?: string | number) => {
     console.log(`Daily Buzz Answered: ${questionId}`, answer);
     setShowDailyQuestion(false);
     toast.success("Thanks for sharing!");
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <main className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            {/* Setup Questionnaire */}
            {!isLoadingAnswers && nextSetupQuestion && (
              <Questionnaire
                key={nextSetupQuestion.id}
                question={nextSetupQuestion}
                onSubmit={handleSetupAnswer}
                onSkip={handleSetupAnswer}
                title="Welcome! Let's get set up" />
            )}

            {/* Daily Buzz */}
            {!isLoadingAnswers && !nextSetupQuestion && showDailyQuestion && (
               <Questionnaire
                key={todaysDailyQuestion.id}
                question={todaysDailyQuestion}
                onSubmit={handleDailyAnswer}
                onSkip={handleDailyAnswer}
                title="Daily Buzz" />
            )}

            {/* Daily Tip Card - Conditionally render Skeleton or Card */}
            {!isLoadingAnswers && !nextSetupQuestion && (
              isLoadingTip ? (
                <TipSkeleton />
              ) : todaysTip && (
                <motion.div
                    className="flex items-start space-x-3 p-4 bg-card rounded-lg shadow border hover:shadow-md hover:border-border/80 transition-all duration-200"
                    variants={gridItemVariants}
                    initial="hidden"
                    animate="visible"
                 >
                    <MessageSquareQuote className="text-blue-500 h-5 w-5 flex-shrink-0 mt-1" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Daily Financial Tip</span>
                        <span className="text-xs text-muted-foreground">{todaysTip.text}</span>
                    </div>
                </motion.div>
              )
            )}

            {/* Leaderboard Section - Conditionally render Skeleton or Leaderboard */}
             <div className="transition-all duration-200 hover:shadow-md">
                {isLoadingLeaderboard ? (
                    <LeaderboardSkeleton />
                ) : (
                    <Leaderboard
                        currentUserId={currentUserId}
                        data={leaderboardData}
                    />
                )}
             </div>
        </main>
    </div>
  );
}
