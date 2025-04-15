'use client'

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  // Ensure we have a resolved theme, defaulting to light if system preference isn't resolved yet
  const [mounted, setMounted] = React.useState(false)
  const resolvedTheme = theme === 'system' ? 'light' : theme // Simplified for toggle logic

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  // Variants for icon animation
  const iconVariants = {
    initial: { rotate: -90, opacity: 0, scale: 0.6 },
    animate: {
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
    exit: {
      rotate: 90,
      opacity: 0,
      scale: 0.6,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
  }

  // Prevent rendering button until theme is mounted to avoid hydration mismatch
  if (!mounted) {
     // Render a placeholder or null during mount
    return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50" />
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={toggleTheme}
            className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-muted/50 text-muted-foreground hover:bg-muted/80 transition-colors"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <AnimatePresence initial={false} mode="wait">
              {resolvedTheme === "dark" ? (
                <motion.div
                  key="moon"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Moon className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Sun className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={10}>
          <p>Switch to {resolvedTheme === "dark" ? "light" : "dark"} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 