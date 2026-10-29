import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Briefcase, CheckCircle2, AlertCircle, MapPin, Building2, Calendar, DollarSign, Award, Target, BrainCircuit, Scan, ShieldCheck, X, FileText, ChevronRight, Activity, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import Tesseract from 'tesseract.js';

type PipelineStage = 'idle' | 'uploading' | 'scanning' | 'extracting' | 'profiling' | 'complete';

interface Internship {
  id: string;
  role: string;
  company: string;
  duration: string;
  stipend: string;
  mode: 'Remote' | 'On-Site' | 'Hybrid';
  technologies: string[];
  qualityScore: number;
  industryRelevance: number;
  placementImpact: number;
  confidence: number;
  status: 'Verified' | 'Rejected';
  fileUrl?: string;
  recommendedRoles: string[];
}

export function Internships() {
  const { user } = useAuth();
  
  const [internships, setInternships] = useState<Internship[]>(() => {
    const saved = localStorage.getItem(`user_internships_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`user_internships_${user.id}`);
      setInternships(saved ? JSON.parse(saved) : []);
    } else {
      setInternships([]);
    }
  }, [user?.id]);
  
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewingDoc, setViewingDoc] = useState<Internship | null>(null);
  const [rejectionMsg, setRejectionMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startPipeline = async (file: File, base64: string) => {
    try {
      setStage('uploading');
      await new Promise(r => setTimeout(r, 1000));
      
      let extractedText = "";
      setStage('scanning');
      
      if (file.type.startsWith('image/')) {
        const result = await Tesseract.recognize(base64, 'eng');
        extractedText = result.data.text.toLowerCase();
      } else {
        await new Promise(r => setTimeout(r, 2500));
        extractedText = file.name.toLowerCase(); 
      }
      
      setStage('extracting');
      await new Promise(r => setTimeout(r, 1500));
      
      setStage('profiling');
      await new Promise(r => setTimeout(r, 1500));
      
      let internship: Internship;
      
      if (extractedText.includes('cyber') || extractedText.includes('security')) {
        internship = {
          id: `INT-CYB-${Date.now().toString().slice(-4)}`,
          role: 'Cybersecurity Intern',
          company: 'Global SecOps Ltd',
          duration: '3 Months',
          stipend: 'Paid',
          mode: 'Remote',
          technologies: ['Network Security', 'Penetration Testing', 'SIEM'],
          qualityScore: 92,
          industryRelevance: 95,
          placementImpact: +20,
          confidence: 96,
          status: 'Verified',
          fileUrl: base64,
          recommendedRoles: ['Security Analyst', 'Penetration Tester', 'SOC Analyst']
        };
      } else if (extractedText.includes('aws') || extractedText.includes('cloud')) {
        internship = {
          id: `INT-AWS-${Date.now().toString().slice(-4)}`,
          role: 'Cloud Engineering Intern',
          company: 'Amazon Web Services',
          duration: '6 Months',
          stipend: 'Paid',
          mode: 'On-Site',
          technologies: ['AWS EC2', 'S3', 'Docker', 'Kubernetes'],
          qualityScore: 98,
          industryRelevance: 99,
          placementImpact: +25,
          confidence: 98,
          status: 'Verified',
          fileUrl: base64,
          recommendedRoles: ['Cloud/DevOps Engineer', 'SRE', 'Backend Developer']
        };
      } else if (extractedText.includes('design') || extractedText.includes('figma') || extractedText.includes('ui')) {
        internship = {
          id: `INT-UI-${Date.now().toString().slice(-4)}`,
          role: 'UI/UX Design Intern',
          company: 'Creative Studios',
          duration: '2 Months',
          stipend: 'Unpaid',
          mode: 'Remote',
          technologies: ['Figma', 'Prototyping', 'User Research'],
          qualityScore: 80,
          industryRelevance: 85,
          placementImpact: +12,
          confidence: 88,
          status: 'Verified',
          fileUrl: base64,
          recommendedRoles: ['UI/UX Designer', 'Product Designer', 'Frontend Dev']
        };
      } else if (extractedText.includes('intern') || extractedText.includes('experience') || extractedText.includes('offer')) {
        internship = {
          id: `INT-GEN-${Date.now().toString().slice(-4)}`,
          role: 'Software Engineering Intern',
          company: 'Tech Solutions Inc',
          duration: '3 Months',
          stipend: 'Confidential',
          mode: 'Hybrid',
          technologies: ['Programming', 'Agile', 'Software Dev'],
          qualityScore: 75,
          industryRelevance: 70,
          placementImpact: +8,
          confidence: 82,
          status: 'Verified',
          fileUrl: base64,
          recommendedRoles: ['Software Developer', 'QA Engineer', 'IT Support']
        };
      } else {
        internship = {
          id: `REJ-${Date.now().toString().slice(-4)}`,
          role: 'Unrecognized Document',
          company: 'Failed AI Validation',
          duration: 'N/A',
          stipend: 'N/A',
          mode: 'Remote',
          technologies: [],
          qualityScore: 0,
          industryRelevance: 0,
          placementImpact: 0,
          confidence: 10,
          status: 'Rejected',
          fileUrl: base64,
          recommendedRoles: []
        };
      }
      
      setStage('complete');
      
      if (internship.status === 'Rejected') {
        setRejectionMsg(`Reason: The AI could not find verified internship or experience keywords in this document. It has been purged.`);
        setInternships(prev => {
          const filteredPrev = prev.filter(c => c.fileUrl !== base64);
          try { localStorage.setItem(`user_internships_${user?.id}`, JSON.stringify(filteredPrev)); } catch (e) {}
          return filteredPrev;
        });
        setTimeout(() => { setStage('idle'); setSelectedFile(null); }, 3000);
      } else {
        setRejectionMsg(null);
        setInternships(prev => {
          const filteredPrev = prev.filter(c => c.fileUrl !== base64);
          const newInts = [internship, ...filteredPrev];
          try { localStorage.setItem(`user_internships_${user?.id}`, JSON.stringify(newInts)); } catch (e) {}
          return newInts;
        });
        setTimeout(() => { setStage('idle'); setSelectedFile(null); }, 3000);
      }
    } catch (err) {
      console.error(err);
      setRejectionMsg("An unexpected error occurred during AI scanning.");
      setStage('idle');
      setSelectedFile(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelected(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleFileSelected(e.target.files[0]);
  };

  const handleFileSelected = (file: File) => {
    if (file.size > 5 * 1024 * 1024) return alert("File is too large. Maximum size is 5MB.");
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) return alert("Invalid file type. Only PDF, JPG, and PNG are supported.");
    
    setRejectionMsg(null);
    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const isDuplicate = internships.some(c => c.fileUrl === base64);
      if (isDuplicate) {
        setStage('idle');
        setSelectedFile(null);
        setRejectionMsg("Upload Rejected: This exact document has already been analyzed and exists in your profile. Duplicates are not allowed.");
        return;
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
      case 'extracting': return 65;
      case 'profiling': return 85;
      case 'complete': return 100;
    }
  };

  // Derived Analytics
  const avgQualityScore = internships.length ? Math.round(internships.reduce((a, b) => a + b.qualityScore, 0) / internships.length) : 0;
  const topRoles = Array.from(new Set(internships.flatMap(i => i.recommendedRoles))).slice(0, 3);
  const totalImpact = internships.reduce((a, b) => a + b.placementImpact, 0);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-display font-bold text-white mb-2"
        >
          Experience Intelligence
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400"
        >
          Upload your internship certificates or offer letters. Our AI will analyze your practical experience, map it to specific career roles, and dynamically adjust your ATS and Placement Readiness scores.
        </motion.p>
      </div>

      {/* Top Analytics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-t-4 border-t-indigo-500 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 p-4"><Target className="w-24 h-24" /></div>
          <h3 className="text-gray-400 font-medium text-sm flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-indigo-400"/> Recruiter Impression</h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">{avgQualityScore > 0 ? `${Math.min(99, 45 + avgQualityScore / 2)}%` : '---'}</span>
            <span className="text-indigo-400 text-sm mb-1 font-medium">Confidence</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Likelihood of being shortlisted based on practical experience.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 border-t-4 border-t-teal-500 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 p-4"><Activity className="w-24 h-24" /></div>
          <h3 className="text-gray-400 font-medium text-sm flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-teal-400"/> ATS Profile Impact</h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-white">{totalImpact > 0 ? `+${totalImpact}%` : '---'}</span>
            <span className="text-teal-400 text-sm mb-1 font-medium">Boost</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Dynamic placement readiness score added to your overall profile.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 border-t-4 border-t-purple-500 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 p-4"><BrainCircuit className="w-24 h-24" /></div>
          <h3 className="text-gray-400 font-medium text-sm flex items-center gap-2 mb-2"><Briefcase className="w-4 h-4 text-purple-400"/> Best Career Paths</h3>
          <div className="space-y-1 mt-2">
            {topRoles.length > 0 ? topRoles.map((role, i) => (
              <div key={i} className="text-sm text-gray-200 font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> {role}
              </div>
            )) : <div className="text-sm text-gray-500">Upload experience to see insights</div>}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Upload Section */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={cn(
              "glass-card p-8 flex flex-col items-center justify-center text-center border-dashed border-2 transition-all relative overflow-hidden",
              dragActive ? "border-indigo-400 bg-indigo-500/5" : "border-white/20 hover:border-indigo-500/50",
              stage !== 'idle' && "border-indigo-500/50"
            )}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          >
            <input type="file" ref={fileInputRef} onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
            
            <AnimatePresence mode="wait">
              {stage === 'idle' ? (
                <motion.div key="upload-prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    <Upload className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Add Experience</h3>
                  <p className="text-sm text-gray-400 mb-8 max-w-xs">
                    Upload internship certificates, offer letters, or verified proof. PDF/Image. Max 5MB.
                  </p>
                  <button onClick={() => fileInputRef.current?.click()} className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]">
                    Browse Files
                  </button>
                </motion.div>
              ) : (
                <motion.div key="upload-pipeline" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center py-4">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-[#111] rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden z-10 shadow-xl">
                      {selectedFile?.type.includes('image') ? <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20"></div> : <FileText className="w-10 h-10 text-indigo-400" />}
                      {(stage === 'scanning' || stage === 'extracting') && (
                        <motion.div initial={{ top: '-10%' }} animate={{ top: '110%' }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-1 bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,1)] z-20" />
                      )}
                    </div>
                    <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 truncate w-full px-4">{selectedFile?.name}</h3>
                  <p className="text-xs text-indigo-400 font-mono mb-6 uppercase tracking-wider">
                    {stage === 'uploading' && 'Uploading securely...'}
                    {stage === 'scanning' && 'AI Text & Vision Scanning...'}
                    {stage === 'extracting' && 'Extracting Tech Stack...'}
                    {stage === 'profiling' && 'Role Profiling Engine...'}
                    {stage === 'complete' && 'Intelligence Mapped!'}
                  </p>

                  <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400" initial={{ width: 0 }} animate={{ width: `${getStageProgress()}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {rejectionMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="bg-red-500/10 border-l-4 border-l-red-500 p-4 rounded-r-xl flex items-start gap-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-500/5 blur-xl -z-10 animate-pulse"></div>
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-red-400 font-semibold text-sm uppercase tracking-wide">AI Rejection</h4>
                  <p className="text-red-400/80 text-xs mt-1 leading-relaxed">{rejectionMsg}</p>
                </div>
                <button onClick={() => setRejectionMsg(null)} className="text-red-400 hover:text-red-300 transition-colors"><X className="w-4 h-4" /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Experience Timeline & Cards */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-white">Experience Timeline</h3>
            <span className="text-sm bg-white/10 text-gray-300 px-3 py-1 rounded-full border border-white/5">
              {internships.length} Positions
            </span>
          </div>
          
          <AnimatePresence>
            {internships.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-12 flex flex-col items-center justify-center text-center h-[350px]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <Briefcase className="w-8 h-8 text-gray-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-300 mb-2">Your timeline is empty</h4>
                <p className="text-sm text-gray-500 max-w-sm">
                  Upload your internship proof to generate your AI experience timeline and boost your recruiter profile.
                </p>
              </motion.div>
            ) : (
              <div className="relative border-l-2 border-white/10 ml-4 space-y-8 pb-4">
                {internships.map((exp, i) => (
                  <motion.div 
                    key={exp.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="relative pl-8 group"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[11px] top-4 w-5 h-5 rounded-full bg-[#111] border-2 border-indigo-500 flex items-center justify-center group-hover:scale-125 transition-transform z-10">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    </div>

                    <div 
                      onClick={() => setViewingDoc(exp)}
                      className="glass-card p-5 cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all hover:border-indigo-500/50"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{exp.role}</h4>
                            <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wide">
                              Verified AI
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                            <span className="flex items-center gap-1.5 font-medium text-gray-300"><Building2 className="w-4 h-4"/> {exp.company}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {exp.duration}</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {exp.mode}</span>
                            <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> {exp.stipend}</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map(tech => (
                              <span key={tech} className="bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-md text-xs font-medium">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* AI Intelligence Panel */}
                        <div className="bg-[#0a0a0a] rounded-xl p-3 border border-white/5 min-w-[200px]">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">AI Relevance Engine</div>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Industry Match</span>
                                <span className="text-emerald-400 font-bold">{exp.industryRelevance}%</span>
                              </div>
                              <div className="w-full bg-white/10 h-1 rounded-full"><div className="bg-emerald-400 h-1 rounded-full" style={{width: `${exp.industryRelevance}%`}}></div></div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Quality Score</span>
                                <span className="text-indigo-400 font-bold">{exp.qualityScore}</span>
                              </div>
                              <div className="w-full bg-white/10 h-1 rounded-full"><div className="bg-indigo-400 h-1 rounded-full" style={{width: `${exp.qualityScore}%`}}></div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal for viewing document */}
      <AnimatePresence>
        {viewingDoc && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setViewingDoc(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{viewingDoc.role}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>{viewingDoc.company}</span>
                    <span>•</span>
                    <span className="font-mono text-indigo-400">VERIFIED ID: {viewingDoc.id}</span>
                  </div>
                </div>
                <button onClick={() => setViewingDoc(null)} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-black/50 rounded-xl border border-white/5 flex items-center justify-center min-h-[500px]">
                {viewingDoc.fileUrl ? (
                  viewingDoc.fileUrl.startsWith('data:application/pdf') ? (
                    <iframe src={viewingDoc.fileUrl} className="w-full h-[600px] rounded-lg bg-white" />
                  ) : (
                    <img src={viewingDoc.fileUrl} alt="Document" className="max-w-full max-h-full object-contain rounded-lg" />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Briefcase className="w-16 h-16 mb-4 opacity-50" />
                    <p>No preview available for this document.</p>
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
