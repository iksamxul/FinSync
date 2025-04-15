'use client';

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStreak } from "@/hooks/useStreak";

import {
  LayoutDashboard,
  Wallet,
  Flame,
  User2,
  Bot,
  ClipboardCheck,
  Activity,
} from "lucide-react";

const Sidebar = () => {
  const { currentStreak, longestStreak, isLoading: isStreakLoading } = useStreak();

  return (
    <aside className="border-r border-border bg-background backdrop-blur lg:block hidden">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Wallet className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">FinSync</span>
      </div>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 p-3 border border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Flame className={`h-5 w-5 text-orange-500 ${currentStreak > 0 ? 'animate-pulse' : ''}`} />
              {currentStreak > 0 && (
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Current Streak</span>
              {isStreakLoading ? (
                <span className="text-xs font-semibold text-muted-foreground">Loading...</span>
              ) : (
                <span className={`font-bold ${currentStreak > 0 ? 'text-orange-500' : 'text-foreground'}`}>
                  {currentStreak > 0 ? `${currentStreak} Day${currentStreak !== 1 ? 's' : ''}` : 'None'}
                </span>
              )}
            </div>
          </div>
          {!isStreakLoading && (
            <span className="text-xs text-muted-foreground">Best: {longestStreak}</span>
          )}
        </div>
      </div>
      <nav className="flex flex-col px-4 space-y-1 flex-1">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/chat">
            <Bot className="h-4 w-4" />
            Ask Fin
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/questionnaire">
            <ClipboardCheck className="h-4 w-4" />
            Questionnaire
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/activity">
            <Activity className="h-4 w-4" />
            Activity
          </Link>
        </Button>
      </nav>
      <div className="mt-auto px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 border border-border">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center">
              <User2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">John Doe</span>
            <span className="text-xs text-muted-foreground">Pro Member</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
