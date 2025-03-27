"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Sabit pozisyonlar için seed array
const seedPositions = [
  { top: 10, left: 20 },
  { top: 30, left: 5 },
  { top: 70, left: 80 },
  { top: 90, left: 90 },
  { top: 5, left: 95 },
  { top: 15, left: 55 },
  { top: 75, left: 5 },
  { top: 25, left: 45 },
  { top: 4, left: 98 },
  { top: 70, left: 15 },
  { top: 63, left: 25 },
  { top: 95, left: 95 }
];

// Falcılık temalı animasyonlu elementler
export const FloatingElements = () => {
  const [elements, setElements] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const newElements = seedPositions.map((pos, i) => {
      // Client-side'da random değerler üret (render sırasında değil)
      const fontSize = Math.random() * 14 + 10;
      const duration = Math.random() * 3 + 4;
      const delay = Math.random() * 5;
      const symbol = i % 4 === 0 ? "✨" : i % 4 === 1 ? "🔮" : i % 4 === 2 ? "⭐" : "🌙";
      
      return (
        <motion.div
          key={i}
          className="absolute text-primary/30 dark:text-primary/20"
          style={{
            top: `${pos.top}%`,
            left: `${pos.left}%`,
            fontSize: `${fontSize}px`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        >
          {symbol}
        </motion.div>
      );
    });
    
    setElements(newElements);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements}
    </div>
  );
};

// Işıldayan arka plan efekti
export const GlowingEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-fuchsia-500/10 blur-3xl top-1/4 -left-1/4 animate-float-slow"></div>
      <div className="absolute w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-3xl bottom-1/4 -right-1/4 animate-float-slow animation-delay-3000"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-pink-500/10 blur-3xl top-3/4 left-1/3 animate-float-slow animation-delay-6000"></div>
    </div>
  );
}; 