'use client';

import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { FinancialProvider } from "@/contexts/FinancialContext";
import { Toaster } from "sonner";
import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { FloatingNavbar } from "@/components/floating-navbar";
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinSync",
  description: "Your personal finance dashboard",
  generator: "v0.dev",
};

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -8,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} pb-24`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          {isLoading ? (
            <LoadingScreen onLoaded={handleLoadingComplete} />
          ) : (
             <FinancialProvider>
                  <AnimatePresence mode="wait">
                      <motion.div
                          key={pathname}
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                      >
                           {children}
                      </motion.div>
                   </AnimatePresence>
               <FloatingNavbar />
             </FinancialProvider>
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
