import React from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Rows3, Columns3, HardDrive, Clock, AlertCircle, Copy, Cpu } from 'lucide-react';
import type { DatasetMeta } from '../types/dataset';

interface DatasetSummaryProps {
  meta: DatasetMeta;
}

export const DatasetSummary: React.FC<DatasetSummaryProps> = ({ meta }) => {
  const cards = [
    {
      label: 'Dataset',
      value: meta.fileName,
      subtext: 'Parsed CSV file',
      icon: FileSpreadsheet,
      color: 'from-blue-500/20 to-teal-500/20',
      textColor: 'text-teal-300',
      borderColor: 'border-teal-500/30',
    },
    {
      label: 'Total Rows',
      value: meta.rowCount.toLocaleString(),
      subtext: 'Records count',
      icon: Rows3,
      color: 'from-indigo-500/20 to-blue-500/20',
      textColor: 'text-indigo-300',
      borderColor: 'border-indigo-500/30',
    },
    {
      label: 'Columns',
      value: meta.columnCount.toString(),
      subtext: 'Detected attributes',
      icon: Columns3,
      color: 'from-purple-500/20 to-indigo-500/20',
      textColor: 'text-purple-300',
      borderColor: 'border-purple-500/30',
    },
    {
      label: 'File Size',
      value: meta.fileSizeFormatted,
      subtext: `${meta.fileSize.toLocaleString()} bytes`,
      icon: HardDrive,
      color: 'from-teal-500/20 to-emerald-500/20',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-500/30',
    },
    {
      label: 'Missing Values',
      value: meta.missingValuesCount.toLocaleString(),
      subtext: meta.missingValuesCount === 0 ? 'Complete Dataset' : 'Cells with missing data',
      icon: AlertCircle,
      color: meta.missingValuesCount === 0 ? 'from-emerald-500/20 to-teal-500/20' : 'from-amber-500/20 to-orange-500/20',
      textColor: meta.missingValuesCount === 0 ? 'text-emerald-400' : 'text-amber-400',
      borderColor: meta.missingValuesCount === 0 ? 'border-emerald-500/30' : 'border-amber-500/30',
    },
    {
      label: 'Duplicate Rows',
      value: meta.duplicateRowsCount.toLocaleString(),
      subtext: meta.duplicateRowsCount === 0 ? 'No duplicates' : 'Identical row entries',
      icon: Copy,
      color: meta.duplicateRowsCount === 0 ? 'from-indigo-500/20 to-teal-500/20' : 'from-rose-500/20 to-pink-500/20',
      textColor: meta.duplicateRowsCount === 0 ? 'text-teal-300' : 'text-rose-400',
      borderColor: meta.duplicateRowsCount === 0 ? 'border-teal-500/30' : 'border-rose-500/30',
    },
    {
      label: 'Memory Size',
      value: meta.estimatedMemory,
      subtext: 'JS RAM memory',
      icon: Cpu,
      color: 'from-cyan-500/20 to-blue-500/20',
      textColor: 'text-cyan-300',
      borderColor: 'border-cyan-500/30',
    },
    {
      label: 'Uploaded',
      value: meta.uploadTime,
      subtext: 'Parsing timestamp',
      icon: Clock,
      color: 'from-purple-500/20 to-pink-500/20',
      textColor: 'text-pink-300',
      borderColor: 'border-pink-500/30',
    },
  ];

  return (
    <div className="w-full mb-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`glass-card p-3.5 relative overflow-hidden border hover:scale-[1.02] transition-all duration-300 ${card.borderColor}`}
            >
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${card.color} rounded-bl-full pointer-events-none opacity-60`} />

              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`p-1 rounded-lg bg-white/5 ${card.textColor}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className={`font-display text-base font-bold truncate ${card.textColor}`} title={String(card.value)}>
                {card.value}
              </div>

              <div className="text-[10px] text-gray-500 mt-1 truncate">
                {card.subtext}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
