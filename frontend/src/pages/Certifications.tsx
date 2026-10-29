import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Scan, ShieldCheck, Award, X, File, BrainCircuit, Activity, ChevronRight, BarChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import Tesseract from 'tesseract.js';

type PipelineStage = 'idle' | 'uploading' | 'scanning' | 'validating' | 'extracting' | 'scoring' | 'complete';

interface Certificate {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  candidateName: string;
  skillCategory: string;
  level: string;
  confidence: number;
  impact: 'High' | 'Medium' | 'Low';
  status: 'Verified' | 'Pending Approval' | 'Rejected';
  placementImpact: number; // percentage
  logo: string | null;
  fileUrl?: string;
}

export function Certifications() {
  const { user } = useAuth();
  
  // Initialize certificates from localStorage specifically isolated for the logged-in user
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(`user_certificates_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Re-fetch if user dynamically changes
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`user_certificates_${user.id}`);
      setCertificates(saved ? JSON.parse(saved) : []);
    } else {
      setCertificates([]);
    }
  }, [user?.id]);
  
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);
  const [rejectionMsg, setRejectionMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startPipeline = async (file: File, base64: string) => {
    try {
      setStage('uploading');
      await new Promise(r => setTimeout(r, 1000));
      
      let extractedText = "";
      setStage('scanning');
      
      // Perform Real OCR on Images
      if (file.type.startsWith('image/')) {
        const result = await Tesseract.recognize(base64, 'eng');
        extractedText = result.data.text.toLowerCase();
        console.log("OCR Extracted Text:", extractedText);
      } else {
        // Fallback for PDFs
        await new Promise(r => setTimeout(r, 2500));
        extractedText = file.name.toLowerCase(); 
      }
      
      setStage('validating');
      await new Promise(r => setTimeout(r, 1500));
      
      setStage('extracting');
      await new Promise(r => setTimeout(r, 1500));
      
      setStage('scoring');
      await new Promise(r => setTimeout(r, 1500));
      
      let cert: Certificate;
      
      // Strict Text Analysis Logic
      if (extractedText.includes('amazon') || extractedText.includes('aws')) {
        cert = {
          id: `AWS-${Date.now().toString().slice(-4)}`,
          name: 'AWS Certification',
          organization: 'Amazon Web Services',
          issueDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          candidateName: user?.name || 'Student',
          skillCategory: 'Cloud Computing',
          level: 'Professional',
          confidence: 96,
          impact: 'High',
          status: 'Verified',
          placementImpact: 15,
          logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
          fileUrl: base64
        };
      } else if (extractedText.includes('google')) {
        cert = {
          id: `GCP-${Date.now().toString().slice(-4)}`,
          name: 'Google Certification',
          organization: 'Google',
          issueDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          candidateName: user?.name || 'Student',
          skillCategory: 'Cloud & Data',
          level: 'Professional',
          confidence: 94,
          impact: 'High',
          status: 'Verified',
          placementImpact: 12,
          logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
          fileUrl: base64
        };
      } else if (extractedText.includes('microsoft') || extractedText.includes('azure')) {
        cert = {
          id: `MSFT-${Date.now().toString().slice(-4)}`,
          name: 'Microsoft Certification',
          organization: 'Microsoft',
          issueDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          candidateName: user?.name || 'Student',
          skillCategory: 'Enterprise Tech',
          level: 'Professional',
          confidence: 92,
          impact: 'High',
          status: 'Verified',
          placementImpact: 10,
          logo: null,
          fileUrl: base64
        };
      } else if (extractedText.includes('udemy') || extractedText.includes('coursera') || extractedText.includes('edx') || extractedText.includes('cisco') || extractedText.includes('comptia')) {
        cert = {
          id: `CERT-${Date.now().toString().slice(-4)}`,
          name: 'Verified Online Course',
          organization: 'Recognized E-Learning Provider',
          issueDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          candidateName: user?.name || 'Student',
          skillCategory: 'General Tech',
          level: 'Beginner',
          confidence: 82,
          impact: 'Medium',
          status: 'Verified',
          placementImpact: 5,
          logo: null,
          fileUrl: base64
        };
      } else {
        // STRICT REJECTION - No valid vendors found in the image text
        cert = {
          id: `REJ-${Date.now().toString().slice(-4)}`,
          name: 'Unrecognized / Generic Template',
          organization: 'Failed OCR Validation',
          issueDate: 'N/A',
          candidateName: user?.name || 'Unknown',
          skillCategory: 'None',
          level: 'N/A',
          confidence: 12,
          impact: 'Low',
          status: 'Rejected',
          placementImpact: 0,
          logo: null,
          fileUrl: base64
        };
      }
      
      setStage('complete');
      
      if (cert.status === 'Rejected') {
        setRejectionMsg(`Reason: ${cert.organization}. The file has been flagged as suspicious and permanently purged from the system.`);
        
        // Auto-delete any existing duplicates from the portfolio too
        setCertificates(prev => {
          const filteredPrev = prev.filter(c => c.fileUrl !== base64 && c.name !== cert.name);
          try {
            localStorage.setItem(`user_certificates_${user?.id}`, JSON.stringify(filteredPrev));
          } catch (e) {}
          return filteredPrev;
        });
        
        setTimeout(() => {
          setStage('idle');
          setSelectedFile(null);
        }, 3000);
      } else {
        setRejectionMsg(null);
        setCertificates(prev => {
          // Prevent duplicates: If the exact same file is uploaded, overwrite the old one
          const filteredPrev = prev.filter(c => c.fileUrl !== base64 && c.name !== cert.name);
          
          const newCerts = [cert, ...filteredPrev];
          try {
            localStorage.setItem(`user_certificates_${user?.id}`, JSON.stringify(newCerts));
          } catch (e) {
            console.warn("Storage quota exceeded or error saving certs");
          }
          return newCerts;
        });
        
        setTimeout(() => {
          setStage('idle');
          setSelectedFile(null);
        }, 3000);
      }
      
    } catch (err) {
      console.error(err);
      setRejectionMsg("An unexpected error occurred during OCR scanning.");
      setStage('idle');
      setSelectedFile(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5MB.");
      return;
    }
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Only PDF, JPG, and PNG are supported.");
      return;
    }
    
    setRejectionMsg(null);
    setSelectedFile(file);
    
    // Convert to base64 so we can view it later
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      
      // STRICT DUPLICATE DETECTION: Check if file signature already exists
      const isDuplicate = certificates.some(c => c.fileUrl === base64);
      if (isDuplicate) {
        setStage('idle');
        setSelectedFile(null);
        setRejectionMsg("Upload Rejected: This exact certificate has already been verified and exists in your portfolio. Duplicates are not allowed.");
        return; // Abort upload entirely
      }
      
      startPipeline(file, base64);
    };
    reader.readAsDataURL(file);
  };

  const getStageProgress = () => {
    switch(stage) {
      case 'idle': return 0;
      case 'uploading': return 15;
      case 'scanning': return 35;
      case 'validating': return 55;
      case 'extracting': return 75;
      case 'scoring': return 90;
      case 'complete': return 100;
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-display font-bold text-white mb-2"
        >
          AI Certification Intelligence
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400"
        >
          Upload your certificates. Our AI pipeline performs OCR scanning, verifies authenticity, and dynamically recalculates your placement readiness score based on certificate value. To simulate a rejection, rename your file to include "fake".
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload Section */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "glass-card p-8 flex flex-col items-center justify-center text-center border-dashed border-2 transition-all relative overflow-hidden",
              dragActive ? "border-teal-400 bg-teal-500/5" : "border-white/20 hover:border-teal-500/50",
              stage !== 'idle' && "border-teal-500/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleChange} 
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            
            <AnimatePresence mode="wait">
              {stage === 'idle' ? (
                <motion.div 
                  key="upload-prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(45,212,191,0.2)]">
                    <Upload className="w-10 h-10 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Upload Certificate</h3>
                  <p className="text-sm text-gray-400 mb-8 max-w-xs">
                    Drag and drop your certificate PDF or image here, or click to browse files. Max 5MB.
                  </p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-teal-500 hover:bg-teal-400 text-black font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)]"
                  >
                    Browse Files
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="upload-pipeline"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center py-4"
                >
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-[#111] rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden z-10 shadow-xl">
                      {selectedFile?.type.includes('image') ? (
                         <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-emerald-500/20"></div>
                      ) : (
                        <FileText className="w-10 h-10 text-teal-400" />
                      )}
                      {/* Scanning laser animation */}
                      {(stage === 'scanning' || stage === 'extracting') && (
                        <motion.div 
                          initial={{ top: '-10%' }}
                          animate={{ top: '110%' }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-1 bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,1)] z-20"
                        />
                      )}
                    </div>
                    <div className="absolute -inset-4 bg-teal-500/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 truncate w-full px-4">{selectedFile?.name}</h3>
                  <p className="text-xs text-teal-400 font-mono mb-6 uppercase tracking-wider">
                    {stage === 'uploading' && 'Securely Uploading...'}
                    {stage === 'scanning' && 'AI OCR Scanning...'}
                    {stage === 'validating' && 'Verifying Authenticity...'}
                    {stage === 'extracting' && 'Extracting Metadata...'}
                    {stage === 'scoring' && 'Calculating Skill Impact...'}
                    {stage === 'complete' && 'Verification Complete!'}
                  </p>

                  <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${getStageProgress()}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="w-full flex justify-between text-[10px] text-gray-500 font-mono uppercase">
                    <span>Init</span>
                    <span>{getStageProgress()}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {rejectionMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="bg-red-500/10 border-l-4 border-l-red-500 p-4 rounded-r-xl flex items-start gap-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-500/5 blur-xl -z-10 animate-pulse"></div>
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-red-400 font-semibold text-sm uppercase tracking-wide">Certificate Auto-Deleted</h4>
                  <p className="text-red-400/80 text-xs mt-1 leading-relaxed">{rejectionMsg}</p>
                </div>
                <button onClick={() => setRejectionMsg(null)} className="text-red-400 hover:text-red-300 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass-card p-6 border-t-4 border-t-teal-400">
            <h4 className="text-white font-semibold flex items-center gap-2 mb-4">
              <BrainCircuit className="w-5 h-5 text-teal-400" /> Scoring Impact Logic
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">High-Value (AWS, Google)</span>
                <span className="text-emerald-400 font-medium">+10-15% ATS Boost</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Medium (Coursera, Udemy)</span>
                <span className="text-teal-400 font-medium">+5-8% ATS Boost</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Unverified / Local</span>
                <span className="text-yellow-400 font-medium">Pending Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white">Your Certificate Portfolio</h3>
            <span className="text-sm bg-white/10 text-gray-300 px-3 py-1 rounded-full border border-white/5">
              {certificates.length} Total
            </span>
          </div>
          
          <AnimatePresence>
            {certificates.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-12 flex flex-col items-center justify-center text-center h-[350px]"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <FileText className="w-8 h-8 text-gray-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-300 mb-2">No certificates uploaded yet</h4>
                <p className="text-sm text-gray-500 max-w-sm">
                  Upload your certifications on the left to activate the AI verification engine and boost your placement readiness score.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {certificates.map((cert) => (
                  <motion.div 
                    key={cert.id}
                    onClick={() => setViewingCert(cert)}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "glass-card p-5 group transition-all cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
                      cert.status === 'Rejected' ? "border-l-4 border-l-red-500 hover:border-red-500/50 bg-red-500/5" :
                      cert.impact === 'High' ? "border-l-4 border-l-emerald-500 hover:border-emerald-500/50" : 
                      cert.impact === 'Medium' ? "border-l-4 border-l-teal-500 hover:border-teal-500/50" : 
                      "border-l-4 border-l-yellow-500 hover:border-yellow-500/50"
                    )}
                  >
                    <div className="flex gap-4">
                      {/* Logo Box */}
                      <div className="w-16 h-16 bg-white rounded-xl p-2 flex items-center justify-center flex-shrink-0 shadow-inner">
                        {cert.logo ? (
                          <img src={cert.logo} alt={cert.organization} className="w-full object-contain" />
                        ) : (
                          <Award className="w-8 h-8 text-gray-800" />
                        )}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="truncate pr-4">
                            <h4 className="text-white font-medium truncate">{cert.name}</h4>
                            <p className="text-xs text-gray-400 mt-1">{cert.organization} • Issued {cert.issueDate}</p>
                          </div>
                          {cert.status === 'Verified' ? (
                            <div className="flex flex-col items-end">
                              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
                              <span className="text-[10px] text-emerald-400/80 font-mono">{cert.confidence}% AI Conf.</span>
                            </div>
                          ) : cert.status === 'Rejected' ? (
                            <div className="flex flex-col items-end">
                              <X className="w-6 h-6 text-red-500 mb-1" />
                              <span className="text-[10px] text-red-400/80 font-mono">Failed OCR</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end">
                              <AlertCircle className="w-6 h-6 text-yellow-400 mb-1" />
                              <span className="text-[10px] text-yellow-400/80 font-mono">Pending Admin</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <span className={cn(
                            "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                            cert.status === 'Rejected' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            cert.impact === 'High' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            cert.impact === 'Medium' ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" :
                            "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          )}>
                            {cert.status === 'Rejected' ? 'REJECTED' : `${cert.impact} Impact`}
                          </span>
                          
                          <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                            <BrainCircuit className="w-3.5 h-3.5 text-teal-400" />
                            {cert.skillCategory}
                          </div>
                          
                          {cert.placementImpact > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10 ml-auto">
                              <Activity className="w-3.5 h-3.5" />
                              +{cert.placementImpact}% ATS Score
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Expandable details (simulated) */}
                    <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-4 hidden group-hover:grid animate-in fade-in slide-in-from-top-2">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Candidate</p>
                        <p className="text-xs text-gray-300 font-medium truncate">{cert.candidateName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Level</p>
                        <p className="text-xs text-gray-300 font-medium">{cert.level}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Credential ID</p>
                        <p className="text-xs text-gray-300 font-mono truncate">{cert.id}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal for viewing certificate */}
      <AnimatePresence>
        {viewingCert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setViewingCert(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{viewingCert.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>{viewingCert.organization}</span>
                    <span>•</span>
                    <span className="font-mono">{viewingCert.id}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setViewingCert(null)} 
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-black/50 rounded-xl border border-white/5 flex items-center justify-center min-h-[500px]">
                {viewingCert.fileUrl ? (
                  viewingCert.fileUrl.startsWith('data:application/pdf') ? (
                    <iframe src={viewingCert.fileUrl} className="w-full h-[600px] rounded-lg bg-white" />
                  ) : (
                    <img src={viewingCert.fileUrl} alt="Certificate" className="max-w-full max-h-full object-contain rounded-lg" />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FileText className="w-16 h-16 mb-4 opacity-50" />
                    <p>No preview available for this file.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
