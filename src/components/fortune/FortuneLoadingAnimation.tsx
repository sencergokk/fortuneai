"use client";

import React from "react";
import { motion } from "framer-motion";
import { Moon, Stars, Sparkles, SparkleIcon, Wand, GemIcon, Coffee, CloudMoon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FortuneLoadingAnimationProps {
  type?: "tarot" | "coffee" | "dream";
  message?: string;
}

export function FortuneLoadingAnimation({
  type = "tarot",
  message = "Falınız hazırlanıyor...",
}: FortuneLoadingAnimationProps) {
  // Colors based on fortune-telling type
  const colors = {
    tarot: {
      primary: "from-purple-300 to-violet-500",
      secondary: "from-indigo-300 to-purple-400",
      accent: "purple-400",
      text: "text-purple-800 dark:text-purple-200",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-800",
    },
    coffee: {
      primary: "from-amber-300 to-orange-500",
      secondary: "from-amber-200 to-amber-400",
      accent: "amber-400",
      text: "text-amber-800 dark:text-amber-200",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
    },
    dream: {
      primary: "from-indigo-300 to-blue-500",
      secondary: "from-indigo-200 to-blue-400",
      accent: "indigo-400",
      text: "text-indigo-800 dark:text-indigo-200",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      border: "border-indigo-200 dark:border-indigo-800",
    },
  };

  const color = colors[type];

  // Icon for each fortune-telling type
  const FortuneIcon = () => {
    switch (type) {
      case "tarot":
        return <Wand className="w-8 h-8 text-white" />;
      case "coffee":
        return (
          <div className="relative">
            <GemIcon className="w-8 h-8 text-white" />
            <motion.div 
              className="absolute inset-0 rounded-full bg-white/20"
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.1, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
            />
          </div>
        );
      case "dream":
        return (
          <div className="relative">
            <Moon className="w-8 h-8 text-white" />
            <motion.div 
              className="absolute top-1 right-2 w-2 h-2 rounded-full bg-white/70"
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />
          </div>
        );
      default:
        return <SparkleIcon className="w-8 h-8 text-white" />;
    }
  };

  return (
    <div className={cn(
      "relative mx-auto max-w-md rounded-lg p-8",
      "border-2 shadow-lg overflow-hidden",
      color.border,
      color.bg
    )}>
      {/* Pulsing background effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute inset-0 bg-repeat opacity-10" 
             style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIvPjwvZz48L3N2Zz4=')" }} />
      </div>
      
      {/* Dynamic background elements based on fortune type */}
      {type === "tarot" && (
        <motion.div 
          className="absolute top-2 right-10 opacity-10 pointer-events-none select-none"
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        >
          <Wand className="h-16 w-16 text-purple-400 dark:text-purple-600" />
        </motion.div>
      )}
      
      {type === "coffee" && (
        <motion.div 
          className="absolute bottom-4 right-4 opacity-10 pointer-events-none select-none"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <Coffee className="h-20 w-20 text-amber-400 dark:text-amber-600" />
        </motion.div>
      )}
      
      {type === "dream" && (
        <motion.div 
          className="absolute top-6 left-6 opacity-10 pointer-events-none select-none"
          animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <CloudMoon className="h-16 w-16 text-indigo-400 dark:text-indigo-600" />
        </motion.div>
      )}
      
      <div className="absolute top-0 right-0 opacity-20 pointer-events-none select-none">
        <Stars className="h-24 w-24 text-gray-300 dark:text-gray-600 rotate-12 translate-x-6 -translate-y-2" />
      </div>
      
      <div className="absolute bottom-0 left-0 opacity-10 pointer-events-none select-none">
        <Moon className="h-20 w-20 text-gray-300 dark:text-gray-600 -translate-x-2 translate-y-2" />
      </div>
      
      {/* Fortune teller animation */}
      <div className="flex flex-col items-center justify-center text-center z-10 relative py-4">
        <motion.div 
          className="relative mb-8"
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 2, 0, -2, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            ease: "easeInOut"
          }}
        >
          {/* Glowing effect behind the circle */}
          <motion.div 
            className={cn(
              "absolute -inset-4 rounded-full opacity-30 blur-md",
              `bg-${color.accent}`
            )}
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
          />
          
          <div className={cn(
            "relative h-20 w-20 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg",
            color.primary
          )}>
            <FortuneIcon />
          </div>
          
          {/* Animated stars/sparkles around the fortune teller */}
          <motion.div 
            className="absolute -top-4 -right-2"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: 0.5
            }}
          >
            <Sparkles className={cn("w-6 h-6 text-" + color.accent)} />
          </motion.div>
          
          <motion.div 
            className="absolute top-2 -left-3"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: 1
            }}
          >
            <Sparkles className={cn("w-5 h-5 text-" + color.accent)} />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-2 left-2"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: 1.5
            }}
          >
            <Sparkles className={cn("w-4 h-4 text-" + color.accent)} />
          </motion.div>
        </motion.div>
        
        <div className="space-y-3">
          <h3 className={cn("text-xl font-semibold", color.text)}>
            Fal Bakılıyor
          </h3>
          
          <div className="flex items-center justify-center space-x-1">
            <motion.div 
              className={cn("h-2 w-2 rounded-full bg-" + color.accent)}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: 0
              }}
            />
            <motion.div 
              className={cn("h-2 w-2 rounded-full bg-" + color.accent)}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: 0.3
              }}
            />
            <motion.div 
              className={cn("h-2 w-2 rounded-full bg-" + color.accent)}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: 0.6
              }}
            />
          </div>
          
          <motion.p 
            className={cn(
              "py-2 px-6 rounded-md bg-white/10 dark:bg-black/10 backdrop-blur-sm",
              "border border-white/10 dark:border-white/5 shadow-sm", 
              "text-sm font-medium max-w-[280px] mx-auto"
            )}
            animate={{ 
              boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 8px rgba(255,255,255,0.2)", "0 0 0 rgba(0,0,0,0)"]
            }}
            transition={{
              repeat: Infinity,
              duration: 3
            }}
          >
            {message}
          </motion.p>
        </div>
      </div>
    </div>
  );
} 