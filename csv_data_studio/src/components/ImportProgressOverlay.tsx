import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Database, CheckCircle2, Cpu, Zap, Lock } from 'lucide-react';

interface ImportProgressOverlayProps {
  tableName: string;
  rowCount: number;
}

export const ImportProgressOverlay: React.FC<ImportProgressOverlayProps> = ({
  tableName,
  rowCount,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(2), 300);
    const t2 = setTimeout(() => setCurrentStep(3), 600);
    const t3 = setTimeout(() => setCurrentStep(4), 900);
    const t4 = setTimeout(() => setCurrentStep(5), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const steps = [
    { id: 1, label: 'Validating CSV Schema & Inferred SQL Types', icon: Cpu },
    { id: 2, label: 'Connecting to Snowflake JDBC (Warehouse: COMPUTE_WH)', icon: Database },
    { id: 3, label: `Generating DDL (CREATE TABLE IF NOT EXISTS ${tableName})`, icon: Zap },
    { id: 4, label: `Streaming Batch Inserts (${rowCount.toLocaleString()} rows)...`, icon: Loader2 },
    { id: 5, label: 'Committing Transaction & Saving Upload Metadata Log', icon: Lock },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#060608]/85 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        className="glass-card max-w-md w-full p-8 text-center border-indigo-500/40 shadow-[0_0_60px_rgba(99,102,241,0.3)] relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Animated Scanner Graphic */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 animate-pulse border border-white/10" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-cyan-400 border-r-indigo-400"
          />
          <Database className="w-8 h-8 text-cyan-400 relative z-10" />
        </div>

        <h3 className="font-display text-xl font-bold text-gradient mb-1">
          Ingesting into Snowflake
        </h3>
        <p className="text-xs text-gray-400 mb-6 font-mono truncate px-4">
          Target Table: <strong className="text-teal-300 font-semibold">{tableName}</strong>
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-6 border border-white/10 p-0.5 relative">
          <motion.div
            initial={{ width: '10%' }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)]"
          />
        </div>

        {/* Steps */}
        <div className="space-y-2 text-left bg-black/40 p-3.5 rounded-xl border border-white/5 text-xs">
          {steps.map(step => {
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-2.5 transition-colors ${
                  isDone 
                    ? 'text-teal-300' 
                    : isCurrent 
                      ? 'text-indigo-300 font-medium' 
                      : 'text-gray-600'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin shrink-0" />
                ) : (
                  <StepIcon className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                )}
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
