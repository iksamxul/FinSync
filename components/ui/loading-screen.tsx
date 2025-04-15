'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Container variants for staggering children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: (
    i = 1 // Default value for staggerChildren delay factor
  ) => ({
    opacity: 1,
    transition: { staggerChildren: 0.1 * i, delayChildren: 0.04 * i },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: 'easeInOut' }
  }
};

// Child variants for each letter
const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 12, stiffness: 100 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

export function LoadingScreen({ onLoaded }: { onLoaded: () => void }) {
  const [showLoading, setShowLoading] = useState(true);
  const text = "FinSync";

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setShowLoading(false);
      // Call onLoaded slightly after animation starts for smoother transition
      setTimeout(onLoaded, 300); // Adjust timing based on exit animation
    }, 2500); // Increased total time slightly for letter animation

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {showLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background text-foreground"
          variants={containerVariants} // Use container variant for overall fade
          initial="visible" // Start visible
          exit="exit"      // Apply exit animation
          style={{ pointerEvents: showLoading ? 'auto' : 'none' }}
        >
          <motion.div
            className="flex overflow-hidden font-display text-4xl md:text-6xl font-bold tracking-tight"
            variants={containerVariants} // Apply stagger here
            initial="hidden"
            animate="visible"
            aria-label={text}
          >
            {text.split('').map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                variants={letterVariants}
                className="inline-block whitespace-pre" // Use whitespace-pre for spaces if needed
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
