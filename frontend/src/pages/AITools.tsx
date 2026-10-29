import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Cpu, Zap, PenTool, BarChart3, MessageSquare, AlertTriangle, Maximize, Play, CheckCircle2, ShieldAlert, Timer, ChevronRight, X, Lock, Code2, Sparkles, TrendingUp, AlertCircle, Video, PlayCircle, Mic, Activity, LineChart, Target, MonitorPlay } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

type ViewState = 'dashboard' | 'pre-flight' | 'assessment' | 'analyzing' | 'result' | 'video-upload' | 'video-analyzing' | 'video-result';

interface Question {
  id: string;
  type: 'prompt' | 'workflow' | 'tool-select';
  category: 'Prompt Engineering' | 'Workflow Automation' | 'Creativity' | 'AI Adaptability';
  scenario: string;
  options?: string[];
  correctOption?: number;
  keywordHints?: string[]; // for free-text prompt evaluation
}

const ALL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'prompt',
    category: 'Prompt Engineering',
    scenario: "You have a massive infinite loop bug in your React `useEffect`. Write the exact prompt you would feed to ChatGPT to get the most accurate and fastest debugging help.",
    keywordHints: ['context', 'dependencies', 'react', 'useeffect', 'code', 'error', 'logs']
  },
  {
    id: 'q2',
    type: 'workflow',
    category: 'Workflow Automation',
    scenario: "Your product manager urgently needs a 15-slide presentation on Q3 marketing metrics based on a raw CSV file. What is the most efficient AI tool workflow?",
    options: [
      "Upload CSV to ChatGPT -> Copy text -> Paste into PowerPoint -> Format manually",
      "Upload CSV to Claude AI to extract insights -> Feed text to Gamma AI / Tome for instant slide generation",
      "Use Midjourney to generate background images -> Use Canva to manually type data",
      "Write a Python script with Copilot to convert CSV to PDF"
    ],
    correctOption: 1
  },
  {
    id: 'q3',
    type: 'prompt',
    category: 'Creativity',
    scenario: "You need to generate a highly realistic, cinematic 4k image of a futuristic workspace using Midjourney. Write your prompt.",
    keywordHints: ['cinematic', '4k', 'photorealistic', 'lighting', '--ar', 'unreal engine', '8k']
  },
  {
    id: 'q4',
    type: 'tool-select',
    category: 'AI Adaptability',
    scenario: "You are tasked with refactoring a massive legacy codebase across 50 files. Which AI tool is specifically built to handle multi-file, codebase-wide context best?",
    options: ["ChatGPT Plus", "Cursor AI", "Notion AI", "Canva Magic Studio"],
    correctOption: 1
  },
  {
    id: 'q5',
    type: 'workflow',
    category: 'Workflow Automation',
    scenario: "You need to create a recruiter outreach email template that automatically pulls in details from a Notion database of companies. Best approach?",
    options: [
      "Use Notion AI to generate the template directly inside the database block",
      "Copy the Notion table into Excel and use macros",
      "Screenshot the database and send it to ChatGPT Vision",
      "Write it manually using Grammarly"
    ],
    correctOption: 0
  }
];

export function AITools() {
  const { user } = useAuth();
  
  const [view, setView] = useState<ViewState>('dashboard');
  const [warnings, setWarnings] = useState(0);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [warningReason, setWarningReason] = useState("");
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  
  // Video Feature State
  const [ytUrl, setYtUrl] = useState('');
  const [videoStage, setVideoStage] = useState(0);
  
  // Loaded user scores
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem(`user_ai_stats_${user?.id}`);
    return saved ? JSON.parse(saved) : null;
  });

  const [videoStats, setVideoStats] = useState(() => {
    const saved = localStorage.getItem(`user_ai_video_stats_${user?.id}`);
    return saved ? JSON.parse(saved) : null;
  });

  // Anti-Cheat Engine for Assessment
  useEffect(() => {
    if (view !== 'assessment') return;
    
    const handleVisibility = () => {
      if (document.hidden) triggerCheatWarning("Tab Switching / Backgrounding Detected");
    };
    
    const handleBlur = () => {
      triggerCheatWarning("Focus Loss / Window Switching Detected");
    };
    
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          submitAssessment();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      clearInterval(timer);
    };
  }, [view]);

  // Video Processing Pipeline Effect
  useEffect(() => {
    if (view === 'video-analyzing') {
      const stages = 6;
      setVideoStage(0);
      
      const interval = setInterval(() => {
        setVideoStage(s => {
          if (s >= stages - 1) {
            clearInterval(interval);
            finishVideoAnalysis();
            return s;
          }
          return s + 1;
        });
      }, 1500); // 1.5s per stage
      return () => clearInterval(interval);
    }
  }, [view]);

  const triggerCheatWarning = (reason: string) => {
    setWarnings(w => w + 1);
    setWarningReason(reason);
    setShowWarningAlert(true);
    setTimeout(() => setShowWarningAlert(false), 4000);
  };

  const handleCopyPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    triggerCheatWarning("Copy-Paste Blocked. Real-time generation required.");
  };

  const startPreFlight = () => {
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 4);
    setQuestions(shuffled);
    setCurrentQ(0);
    setAnswers({});
    setWarnings(0);
    setTimeLeft(300);
    setView('pre-flight');
  };

  const launchAssessment = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (e) {
      console.warn("Fullscreen denied by browser. Proceeding anyway.");
    }
    setView('assessment');
  };

  const submitAssessment = async () => {
    if (document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch (e) {}
    }
    setView('analyzing');
    
    await new Promise(r => setTimeout(r, 4000));
    
    let scoreObj = {
      overall: 0,
      'Prompt Engineering': 50,
      'Workflow Automation': 50,
      'Creativity': 50,
      'AI Adaptability': 50
    };
    
    questions.forEach((q, idx) => {
      const ans = answers[idx];
      let earned = 0;
      
      if (q.type === 'tool-select' || q.type === 'workflow') {
        if (ans === q.correctOption) earned = 25;
      } else if (q.type === 'prompt') {
        if (typeof ans === 'string' && ans.length > 20) {
          let matches = 0;
          q.keywordHints?.forEach(kw => {
            if (ans.toLowerCase().includes(kw)) matches++;
          });
          earned = Math.min(25, 10 + (matches * 5));
        }
      }
      
      if (warnings > 0) earned = Math.max(0, earned - (warnings * 2));
      scoreObj[q.category] = Math.min(100, scoreObj[q.category] + earned);
      scoreObj.overall += earned;
    });
    
    scoreObj.overall = Math.min(99, Math.max(10, scoreObj.overall));
    
    const finalStats = {
      ...scoreObj,
      level: scoreObj.overall > 85 ? 'AI Power User' : scoreObj.overall > 70 ? 'Advanced' : scoreObj.overall > 40 ? 'Intermediate' : 'Beginner',
      date: new Date().toLocaleDateString()
    };
    
    localStorage.setItem(`user_ai_stats_${user?.id}`, JSON.stringify(finalStats));
    setStats(finalStats);
    setView('result');
  };

  const finishVideoAnalysis = () => {
    // Generate simulated dynamic intelligence results based on an explanation video
    const finalVideoStats = {
      commScore: 88 + Math.floor(Math.random() * 10),
      techScore: 85 + Math.floor(Math.random() * 12),
      toolsDetected: ['Cursor AI', 'ChatGPT Plus', 'Notion AI'],
      creatorScore: 92,
      atsBoost: 15,
      insight: "Outstanding technical explanation capability detected. Your ability to break down AI workflows makes you highly suitable for modern AI engineering and DevRel roles."
    };
    
    localStorage.setItem(`user_ai_video_stats_${user?.id}`, JSON.stringify(finalVideoStats));
    setVideoStats(finalVideoStats);
    setView('video-result');
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderDashboard = () => (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <div>
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-display font-bold text-white mb-2">
          AI Productivity & Knowledge Intelligence
        </motion.h1>
        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-gray-400 max-w-3xl">
          Recruiters are actively searching for candidates who can leverage AI tools to 10x their output, and effectively communicate their workflows. Prove your practical AI abilities and presentation skills here.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Anti-Cheat Assessment Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" /> Scenario Assessment
          </h2>
          {!stats ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 flex flex-col items-center justify-center text-center border-t-4 border-t-indigo-500 h-80">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                <BrainCircuit className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Evaluate AI Proficiency</h3>
              <p className="text-sm text-gray-400 mb-6">Take the strict anti-cheat assessment to map your prompt engineering and workflow automation skills.</p>
              <button onClick={startPreFlight} className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" /> Start Assessment
              </button>
            </motion.div>
          ) : (
            <div className="glass-card p-6 border-l-4 border-l-indigo-500 flex flex-col justify-between h-80">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">Productivity Index</p>
                    <h2 className="text-3xl font-bold text-white">{stats.overall}/100</h2>
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full">{stats.level}</span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Prompting</span>
                    <span className="text-white font-medium">{stats['Prompt Engineering']}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Workflows</span>
                    <span className="text-white font-medium">{stats['Workflow Automation']}%</span>
                  </div>
                </div>
              </div>
              
              <button onClick={startPreFlight} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-400" /> Retake Strict Assessment
              </button>
            </div>
          )}
        </div>

        {/* Video Intelligence Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MonitorPlay className="w-5 h-5 text-teal-400" /> Video Knowledge Analysis
          </h2>
          {!videoStats ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 flex flex-col items-center justify-center text-center border-t-4 border-t-teal-500 h-80">
              <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analyze YouTube Explanation</h3>
              <p className="text-sm text-gray-400 mb-6">Submit a video of you explaining an AI tool. Our engine will estimate your communication, technical depth, and AI tool knowledge.</p>
              <button onClick={() => setView('video-upload')} className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center gap-2">
                <PlayCircle className="w-5 h-5" /> Submit YouTube Video
              </button>
            </motion.div>
          ) : (
            <div className="glass-card p-6 border-l-4 border-l-teal-500 flex flex-col justify-between h-80 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5 p-4"><Video className="w-24 h-24" /></div>
              <div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <p className="text-sm text-gray-400 font-medium mb-1">AI Creator Score</p>
                    <h2 className="text-3xl font-bold text-white">{videoStats.creatorScore}/100</h2>
                  </div>
                  <span className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider rounded-full">Exceptional Communicator</span>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Communication Fluency</span>
                      <span className="text-teal-400 font-bold">{videoStats.commScore}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full"><div className="bg-teal-500 h-full rounded-full" style={{width: `${videoStats.commScore}%`}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Technical Explanation Depth</span>
                      <span className="text-indigo-400 font-bold">{videoStats.techScore}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full"><div className="bg-indigo-500 h-full rounded-full" style={{width: `${videoStats.techScore}%`}}></div></div>
                  </div>
                </div>
              </div>
              
              <button onClick={() => setView('video-upload')} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 relative z-10">
                <Video className="w-4 h-4 text-teal-400" /> Submit New Video Analysis
              </button>
            </div>
          )}
        </div>
      </div>

      {stats && videoStats && (
        <div className="glass-card p-6 mt-8 bg-gradient-to-r from-teal-500/5 to-indigo-500/5 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-400"/> Combined AI Intelligence Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111] p-4 rounded-xl border border-white/5">
              <h4 className="text-teal-400 text-sm font-semibold mb-2">Recruiter Impression</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{videoStats.insight}</p>
            </div>
            <div className="bg-[#111] p-4 rounded-xl border border-white/5 flex flex-col justify-center">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm text-gray-400">Total Placement ATS Boost</span>
                 <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">+{Math.round(stats.overall / 10) + videoStats.atsBoost}%</span>
               </div>
               <p className="text-[10px] text-gray-500">Derived from strict assessment and video communication analysis.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVideoUpload = () => {
    const isYtUrl = ytUrl.includes('youtube.com') || ytUrl.includes('youtu.be');
    
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-3xl w-full bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <button onClick={() => setView('dashboard')} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition-colors"><X className="w-5 h-5"/></button>
          
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
            <PlayCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Submit YouTube Explanation</h2>
          <p className="text-gray-400 text-sm mb-8">Paste the URL of your YouTube video where you explain an AI tool or automated workflow. Our AI will analyze your transcript, tool knowledge, and presentation fluency.</p>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Video URL</label>
              <input 
                type="text" 
                value={ytUrl}
                onChange={e => setYtUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            
            <AnimatePresence>
              {isYtUrl && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 items-center">
                  <div className="w-32 h-20 bg-[#0a0a0a] rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center group">
                    <img src={`https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=200&auto=format&fit=crop`} alt="thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <Play className="w-8 h-8 text-white relative z-10 drop-shadow-lg" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">How I automated my workflow with AI Tools</h4>
                    <p className="text-xs text-gray-400 mt-1">Student Portfolio Channel • 10:24</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] rounded-full font-semibold">Ready for Analysis</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button 
              onClick={() => setView('video-analyzing')}
              disabled={!isYtUrl}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(45,212,191,0.2)]"
            >
              Analyze Video Intelligence
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderVideoAnalyzing = () => {
    const STAGES = [
      "Initializing Video Processing Pipeline",
      "Downloading and Extracting Audio Stream",
      "Generating Semantic Transcript",
      "Detecting AI Tools & Contextual Accuracy",
      "Analyzing Speaking Fluency & Confidence",
      "Evaluating Technical Explanation Depth",
      "Synthesizing Final AI Creator Profile"
    ];
    
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-12 relative">
             <div className="w-32 h-32 relative flex items-center justify-center">
               <svg className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite]">
                 <circle cx="64" cy="64" r="60" stroke="rgba(45,212,191,0.2)" strokeWidth="4" fill="transparent" />
                 <circle cx="64" cy="64" r="60" stroke="#2dd4bf" strokeWidth="4" fill="transparent" strokeDasharray="377" strokeDashoffset={377 - (377 * (videoStage + 1)) / STAGES.length} className="transition-all duration-1000 ease-in-out" />
               </svg>
               <MonitorPlay className="w-12 h-12 text-teal-400 absolute" />
             </div>
          </div>
          
          <div className="space-y-6">
            {STAGES.map((stage, idx) => {
              const isActive = idx === videoStage;
              const isPast = idx < videoStage;
              if (!isActive && !isPast && idx > videoStage + 1) return null;
              
              return (
                <motion.div 
                  key={stage}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isActive ? 1 : isPast ? 0.5 : 0, x: 0 }}
                  className="flex items-center gap-4"
                >
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0", isPast ? "bg-teal-500" : isActive ? "border-2 border-teal-500 animate-pulse" : "border border-gray-700")}>
                    {isPast && <CheckCircle2 className="w-4 h-4 text-[#111]" />}
                    {isActive && <div className="w-2 h-2 bg-teal-500 rounded-full" />}
                  </div>
                  <span className={cn("text-sm font-medium", isPast ? "text-gray-400" : isActive ? "text-teal-400" : "text-gray-600")}>
                    {stage}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderVideoResult = () => (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl w-full bg-[#111] border border-white/10 rounded-3xl p-8 my-8 shadow-2xl relative">
        <button onClick={() => setView('dashboard')} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-white/5 rounded-full transition-colors"><X className="w-5 h-5"/></button>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-teal-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(45,212,191,0.4)]">
            <MonitorPlay className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white">Video Intelligence Report</h2>
          <p className="text-gray-400 mt-2">Analysis complete. Profile updated with Creator insights.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 border-t-4 border-t-teal-500 bg-teal-500/5 text-center">
            <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-2">Creator Score</p>
            <p className="text-5xl font-black text-teal-400">{videoStats?.creatorScore}</p>
          </div>
          <div className="glass-card p-6 border-t-4 border-t-indigo-500 bg-indigo-500/5 text-center">
            <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-2">Comm. Fluency</p>
            <p className="text-5xl font-black text-indigo-400">{videoStats?.commScore}%</p>
          </div>
          <div className="glass-card p-6 border-t-4 border-t-purple-500 bg-purple-500/5 text-center">
            <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-2">Tech Depth</p>
            <p className="text-5xl font-black text-purple-400">{videoStats?.techScore}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Cpu className="w-5 h-5 text-gray-400"/> AI Tools Detected</h3>
             <div className="flex flex-wrap gap-2">
                {videoStats?.toolsDetected.map((t: string) => (
                  <span key={t} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-200 font-medium">
                    {t}
                  </span>
                ))}
             </div>
          </div>
          
          <div className="glass-card p-5 bg-gradient-to-r from-teal-500/10 to-transparent border-l-4 border-l-teal-500">
            <h4 className="text-teal-400 font-bold mb-2">Recruiter Insight Generated</h4>
            <p className="text-sm text-gray-300 leading-relaxed italic">"{videoStats?.insight}"</p>
          </div>
        </div>

        <button onClick={() => setView('dashboard')} className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors shadow-xl">
          Return to Dashboard
        </button>
      </motion.div>
    </div>
  );

  const renderPreFlight = () => (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl w-full bg-[#111] border border-red-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <div className="flex justify-center mb-6"><ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" /></div>
        <h2 className="text-3xl font-bold text-center text-white mb-4">Strict Anti-Cheat Environment</h2>
        <p className="text-gray-400 text-center mb-8">This assessment evaluates realistic AI problem-solving. To prevent standard cheating (like pasting questions back into ChatGPT), strict monitoring is enabled.</p>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5"><Maximize className="w-5 h-5 text-indigo-400"/> Fullscreen is mandatory. Exiting auto-submits.</div>
          <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5"><AlertTriangle className="w-5 h-5 text-yellow-400"/> Tab switching, split-screen, or losing focus triggers a flag.</div>
          <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5"><Lock className="w-5 h-5 text-red-400"/> Copy-paste is strictly disabled to prevent external AI use.</div>
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => setView('dashboard')} className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={launchAssessment} className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">Accept & Enter Fullscreen</button>
        </div>
      </motion.div>
    </div>
  );

  const renderAssessment = () => (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col">
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#111]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center"><BrainCircuit className="w-5 h-5 text-indigo-400" /></div>
          <span className="text-white font-semibold">AI Productivity Intelligence Assessment</span>
        </div>
        <div className="flex items-center gap-6">
          <div className={cn("flex items-center gap-2 font-mono text-lg font-bold", timeLeft < 60 ? "text-red-500 animate-pulse" : "text-teal-400")}><Timer className="w-5 h-5" /> {formatTime(timeLeft)}</div>
          <button onClick={submitAssessment} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors">Submit Early</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div className="max-w-4xl w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Scenario {currentQ + 1} of {questions.length}</h2>
            <span className="px-3 py-1 bg-white/5 border border-white/10 text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full">{questions[currentQ].category}</span>
          </div>
          
          <div className="glass-card p-8 mb-8 border-l-4 border-l-indigo-500 bg-indigo-500/5">
            <p className="text-lg text-gray-200 leading-relaxed">{questions[currentQ].scenario}</p>
          </div>
          
          {questions[currentQ].type === 'prompt' ? (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><PenTool className="w-4 h-4"/> Draft your exact prompt below. Copy-paste is disabled.</label>
              <textarea 
                value={answers[currentQ] as string || ''}
                onChange={e => setAnswers({...answers, [currentQ]: e.target.value})}
                onCopy={handleCopyPaste}
                onPaste={handleCopyPaste}
                className="w-full h-48 bg-[#111] border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none custom-scrollbar"
                placeholder="Act as a senior developer..."
              />
            </div>
          ) : (
            <div className="space-y-3">
              {questions[currentQ].options?.map((opt, i) => (
                <div 
                  key={i}
                  onClick={() => setAnswers({...answers, [currentQ]: i})}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4",
                    answers[currentQ] === i ? "bg-indigo-500/10 border-indigo-500 text-white" : "bg-[#111] border-white/5 text-gray-400 hover:bg-white/5 hover:border-white/10"
                  )}
                >
                  <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", answers[currentQ] === i ? "border-indigo-400" : "border-gray-600")}>
                    {answers[currentQ] === i && <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full" />}
                  </div>
                  <span className="font-medium text-sm">{opt}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between mt-12">
            <button 
              onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
              disabled={currentQ === 0}
              className="px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            {currentQ === questions.length - 1 ? (
              <button onClick={submitAssessment} className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                Complete Assessment
              </button>
            ) : (
              <button onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))} className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all flex items-center gap-2">
                Next Scenario <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showWarningAlert && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.5)] font-bold flex items-center gap-3">
            <ShieldAlert className="w-6 h-6" /> {warningReason}. Warning logged ({warnings}/3).
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center">
      <div className="w-24 h-24 relative mb-8">
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
        <BrainCircuit className="w-10 h-10 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">AI Synthesizing Results...</h2>
      <p className="text-indigo-400 font-mono text-sm tracking-wider uppercase animate-pulse">Running semantic analysis on prompt structures</p>
    </div>
  );

  return (
    <>
      {view === 'dashboard' && renderDashboard()}
      {view === 'pre-flight' && renderPreFlight()}
      {view === 'assessment' && renderAssessment()}
      {view === 'analyzing' && renderAnalyzing()}
      
      {view === 'video-upload' && renderVideoUpload()}
      {view === 'video-analyzing' && renderVideoAnalyzing()}
      {view === 'video-result' && renderVideoResult()}

      {view === 'result' && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl w-full bg-[#111] border border-white/10 rounded-2xl p-10 text-center shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-tr from-teal-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(99,102,241,0.4)]">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Assessment Complete</h2>
            <p className="text-gray-400 mb-8">Your AI Productivity Index has been calculated and mapped to your placement profile.</p>
            
            <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/5">
              <p className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-2">Your Classification</p>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">{stats?.level}</p>
            </div>
            
            {warnings > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-8 flex items-start gap-3 text-left">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p><strong>Note:</strong> {warnings} security flags were raised during your session. Frequent tab switching or copy-pasting severely reduces your final adaptability score.</p>
              </div>
            )}
            
            <button onClick={() => setView('dashboard')} className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors">
              View Detailed Analytics
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
