'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useStreak } from '@/hooks/useStreak';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  LayoutDashboard,
  Wallet, // Maybe replace with a general settings icon later?
  Flame,
  User2,
  Bot,
  ClipboardCheck,
  Activity,
} from 'lucide-react';

const USER_NAME_KEY = 'finSyncUserName';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, label, icon, isActive }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href} className="relative">
          <motion.div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
            whileHover={{ scale: 1.15, y: -5, backgroundColor: 'rgba(var(--primary-rgb), 0.15)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {icon}
          </motion.div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={10}>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const StreakDisplay = () => {
  const { currentStreak, isLoading } = useStreak();

  // Variants for number animation (pulse effect on update)
  const numberVariants = {
    initial: { opacity: 0, scale: 0.8 }, // Start slightly smaller and faded
    animate: {
        opacity: 1,
        scale: [1, 1.3, 1], // Pulse effect: normal -> bigger -> normal
        transition: {
            type: 'spring',
            duration: 0.4,
            bounce: 0.4
        }
     },
    exit: {
        opacity: 0,
        scale: 0.8, // Exit smaller
        transition: {
            duration: 0.2
        }
    },
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative flex h-12 w-12 cursor-default items-center justify-center rounded-full bg-gradient-to-tr from-orange-500/10 to-red-500/10 border border-orange-500/20 overflow-hidden">
            <Flame className={`h-6 w-6 ${currentStreak > 0 ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'}`} />
            {currentStreak > 0 && (
               <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange-500 border-2 border-background animate-ping" />
            )}
             <AnimatePresence mode="wait">
                 {!isLoading && currentStreak > 0 && (
                     <motion.span
                         key={currentStreak}
                         variants={numberVariants} // Use updated variants
                         initial="initial"
                         animate="animate"
                         exit="exit"
                         className="absolute bottom-1 right-1 text-[10px] font-bold text-orange-600 bg-background/70 rounded-full px-1 backdrop-blur-sm"
                       >
                           {currentStreak}
                     </motion.span>
                 )}
             </AnimatePresence>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={10}>
          <p>{isLoading ? "Loading..." : `${currentStreak} Day Streak`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ProfileAvatar = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem(USER_NAME_KEY);
    if (storedName) {
      setUserName(storedName);
    } else {
      // Prompt only runs client-side
      const name = window.prompt("What's your name? (Visible only to you in this browser)");
      if (name) {
        localStorage.setItem(USER_NAME_KEY, name);
        setUserName(name);
      } else {
        // Set a default if prompt is cancelled or empty
        setUserName("User"); 
        localStorage.setItem(USER_NAME_KEY, "User");
      }
    }
  }, []);

  const getInitials = (name: string | null): string => {
      if (!name) return '?';
      const names = name.split(' ');
      if (names.length === 1) return names[0][0]?.toUpperCase() || '?';
      return (names[0][0]?.toUpperCase() || '') + (names[names.length - 1][0]?.toUpperCase() || '');
  }

   return (
     <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
             <Link href="/profile" className="relative">
                  <motion.div
                   className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/60 to-primary border border-primary/30 overflow-hidden text-primary-foreground font-semibold text-lg"
                   whileHover={{ scale: 1.15, y: -5 }}
                   whileTap={{ scale: 0.95 }}
                   transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                      {/* Display initials as fallback */} 
                      {userName ? getInitials(userName) : <User2 className="h-6 w-6" />}
                      
                      {/* Online indicator - maybe tie to activity? */}
                      <div className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                  </motion.div>
             </Link>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={10}>
          <p>{userName || 'Profile'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function FloatingNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={24} /> },
    { href: "/chat", label: "Ask Fin", icon: <Bot size={24} /> },
    { href: "/questionnaire", label: "Questionnaire", icon: <ClipboardCheck size={24} /> },
    { href: "/activity", label: "Activity", icon: <Activity size={24} /> },
  ];

  return (
    <motion.nav
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
        {/* Adjust padding, background, shadow, rounded corners */}
      <div className="flex items-center gap-3 rounded-full bg-background/75 p-3 shadow-xl backdrop-blur-lg border border-border/20">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} isActive={pathname === item.href} />
        ))}

        <div className="h-8 w-px bg-border/50 mx-1"></div> {/* Separator */} 

        <StreakDisplay />
        <ProfileAvatar />
        <ThemeToggle />
      </div>
    </motion.nav>
  );
} 