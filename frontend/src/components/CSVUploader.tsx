import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileSpreadsheet, AlertTriangle, Sparkles, FileText } from 'lucide-react';
import { parseCSVFile, isValidCSVFile } from '../utils/csvParser';
import type { CSVParseResult } from '../types/dataset';

interface CSVUploaderProps {
  onUploadStart: (fileName: string) => void;
  onUploadSuccess: (result: CSVParseResult) => void;
  onUploadError: (errorMessage: string) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({
  onUploadStart,
  onUploadSuccess,
  onUploadError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Ripple Effect on Button Click
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    fileInputRef.current?.click();
  };

  const processFile = async (file: File) => {
    setErrorMessage(null);

    // Validate file type extension
    if (!isValidCSVFile(file)) {
      const err = 'Please upload a valid CSV file.';
      setErrorMessage(err);
      onUploadError(err);
      return;
    }

    if (file.size === 0) {
      const err = 'CSV file is empty.';
      setErrorMessage(err);
      onUploadError(err);
      return;
    }

    onUploadStart(file.name);
    try {
      const result = await parseCSVFile(file);
      if (result.success) {
        onUploadSuccess(result);
      } else {
        const err = result.error || 'Unable to parse CSV.';
        setErrorMessage(err);
        onUploadError(err);
      }
    } catch {
      const err = 'Unable to parse CSV.';
      setErrorMessage(err);
      onUploadError(err);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // reset input value so re-uploading same file triggers change
    if (e.target) e.target.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Centered Upload Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`glass-card p-8 md:p-10 text-center relative overflow-hidden transition-all duration-300 ${
          isDragging 
            ? 'border-teal-400/80 bg-teal-500/[0.08] shadow-[0_0_40px_rgba(45,212,191,0.25)] scale-[1.01]' 
            : 'hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Large Upload Icon */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center group">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-teal-400/20 group-hover:scale-110 transition-transform duration-300 border border-white/10" />
          <motion.div
            animate={isDragging ? { y: [-4, 4, -4] } : {}}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-16 h-16 rounded-2xl bg-[#0d0d12]/90 border border-white/10 flex items-center justify-center shadow-xl relative z-10"
          >
            {isDragging ? (
              <FileSpreadsheet className="w-9 h-9 text-teal-400" />
            ) : (
              <UploadCloud className="w-9 h-9 text-indigo-400 group-hover:text-teal-400 transition-colors" />
            )}
          </motion.div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-2xl font-bold font-display tracking-tight text-white mb-2">
          Upload Dataset
        </h2>
        <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
          Upload any CSV dataset for analysis. Supports dynamic header detection & instant preview.
        </p>

        {/* Drag & Drop Visual Box */}
        <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 mb-6 bg-black/20 hover:border-teal-500/50 transition-colors">
          <p className="text-sm font-medium text-gray-300 mb-1 flex items-center justify-center gap-2">
            <span>📂</span> Drag & Drop CSV here
          </p>
          <p className="text-xs text-gray-500">or use the upload button below</p>
        </div>

        {/* Large Upload Button with Gradient & Ripple */}
        <button
          type="button"
          onClick={handleButtonClick}
          className="relative overflow-hidden px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 mx-auto group"
        >
          {/* Ripple Effect elements */}
          {ripples.map(r => (
            <span
              key={r.id}
              className="absolute bg-white/40 rounded-full animate-ping pointer-events-none"
              style={{
                left: r.x - 25,
                top: r.y - 25,
                width: 50,
                height: 50,
              }}
            />
          ))}
          <UploadCloud className="w-5 h-5 text-teal-300 group-hover:scale-110 transition-transform" />
          <span>Upload CSV</span>
        </button>

        {/* Accepted File Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500 font-mono">
          <FileText className="w-3.5 h-3.5 text-gray-400" />
          <span>Only <strong className="text-teal-400 font-semibold">.csv</strong> files accepted</span>
        </div>

        {/* Error Alert Display */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3 text-left"
            >
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-200">Upload Validation Error</h4>
                <p className="text-xs text-red-300/90 mt-0.5">{errorMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Empty State Illustration Placeholder */}
      <div className="mt-8 text-center p-6 border border-white/5 rounded-2xl bg-white/[0.01]">
        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
          <Sparkles className="w-5 h-5" />
        </div>
        <p className="text-xs text-gray-500 font-medium">No dataset uploaded yet.</p>
        <p className="text-[11px] text-gray-600 mt-1">Select a CSV file or try one of the sample datasets below.</p>
      </div>
    </div>
  );
};
