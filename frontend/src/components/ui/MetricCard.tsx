import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  trendSuffix?: string; // custom suffix e.g. " pts" — defaults to "%" if omitted
  className?: string;
  delay?: number;
}

function AnimatedValue({ value }: { value: string | number }) {
  const [display, setDisplay] = useState<string | number>(value);

  useEffect(() => {
    const isPercent = typeof value === 'string' && value.endsWith('%');
    const numericStr = isPercent ? (value as string).slice(0, -1) : String(value);
    const numericVal = parseFloat(numericStr);

    if (isNaN(numericVal)) {
      setDisplay(value);
      return;
    }

    const start = 0;
    const end = numericVal;
    const duration = 1200; // 1.2s
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress * (2 - progress); // easeOut
      const current = Math.floor(eased * end);

      setDisplay(isPercent ? `${current}%` : current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplay(value);
      }
    };

    requestAnimationFrame(update);
  }, [value]);

  return <>{display}</>;
}

export function MetricCard({ title, value, icon: Icon, trend, trendLabel, trendSuffix, className, delay = 0 }: MetricCardProps) {
  const suffix = trendSuffix !== undefined ? trendSuffix : '%';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "glass-card glass-card-glow-teal p-6 flex flex-col gap-4 relative group overflow-hidden bg-card/40 backdrop-blur-xl border border-white/[0.06] shadow-xl hover:border-teal-500/20",
        className
      )}
    >
      {/* Decorative gradient background glow on card hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/[0.02] rounded-full blur-2xl group-hover:bg-teal-500/[0.04] transition-all duration-500 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-gray-400 font-medium text-sm tracking-tight">{title}</h3>
        <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.06] group-hover:border-teal-500/20 group-hover:bg-teal-500/5 transition-all duration-300">
          <Icon className="w-4.5 h-4.5 text-teal-400 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      <div className="flex items-end gap-3.5 relative z-10 mt-1">
        <span className="text-4xl font-display font-extrabold text-white tracking-tight">
          <AnimatedValue value={value} />
        </span>
        
        {trend !== undefined && (
          <div className={cn(
            "flex items-center text-xs font-semibold mb-1.5 px-2 py-0.5 rounded-md border",
            trend > 0 
              ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" 
              : "text-red-400 border-red-500/20 bg-red-500/5"
          )}>
            {trend > 0 ? '+' : ''}{trend}{suffix}
            <span className="text-gray-500 font-normal ml-1 font-mono text-[10px]">{trendLabel}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
