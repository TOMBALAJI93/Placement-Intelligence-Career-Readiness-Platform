import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GaugeProps {
  value: number;
  label: string;
  color?: string;
  delay?: number;
}

function AnimatedPercent({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500; // 1.5s
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress * (2 - progress); // easeOut
      const current = Math.floor(eased * end);

      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplay(value);
      }
    };

    requestAnimationFrame(update);
  }, [value]);

  return <>{display}%</>;
}

export function GaugeCard({ value, label, color = "stroke-teal-400", delay = 0 }: GaugeProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  // Determine glow shadow colors
  const glowStyle = color.includes("indigo") 
    ? "drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
    : color.includes("purple") 
    ? "drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
    : "drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-card p-6 flex flex-col items-center justify-center relative bg-card/40 backdrop-blur-xl border border-white/[0.06] shadow-xl"
    >
      <div className="relative flex items-center justify-center">
        {/* Neon light source under the gauge */}
        <div className="absolute w-28 h-28 bg-white/[0.01] rounded-full blur-xl pointer-events-none" />

        <svg className="transform -rotate-90 w-40 h-40">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-white/[0.05]"
          />
          {/* Progress circle with premium neon drop-shadow */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: delay + 0.1 }}
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeLinecap="round"
            style={{ strokeDasharray: circumference }}
            className={cn(color, glowStyle)}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3.5xl font-display font-extrabold text-white tracking-tighter">
            <AnimatedPercent value={value} />
          </span>
        </div>
      </div>
      <h3 className="mt-4 text-gray-300 font-semibold tracking-tight text-sm text-center">{label}</h3>
    </motion.div>
  );
}
