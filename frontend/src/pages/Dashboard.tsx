import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Code2, Database, Target, Building, Network, Mic, Briefcase, TerminalSquare } from 'lucide-react';
import { MetricCard } from '../components/ui/MetricCard';
import { GaugeCard } from '../components/ui/GaugeCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

const performanceData = [
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 68 },
  { name: 'Mar', score: 74 },
  { name: 'Apr', score: 82 },
  { name: 'May', score: 88 },
  { name: 'Jun', score: 92 },
];

const skillsData = [
  { subject: 'Algorithms', A: 90, fullMark: 100 },
  { subject: 'System Design', A: 75, fullMark: 100 },
  { subject: 'Communication', A: 85, fullMark: 100 },
  { subject: 'AI/ML', A: 80, fullMark: 100 },
  { subject: 'Web Dev', A: 95, fullMark: 100 },
  { subject: 'Aptitude', A: 88, fullMark: 100 },
];

const topCompanies = [
  { name: 'Amazon', match: 88, role: 'SDE-1', color: 'from-orange-400 to-orange-600' },
  { name: 'Microsoft', match: 82, role: 'SWE', color: 'from-blue-400 to-blue-600' },
  { name: 'Zoho', match: 95, role: 'MTS', color: 'from-green-400 to-green-600' },
  { name: 'TCS Digital', match: 98, role: 'System Engineer', color: 'from-indigo-400 to-indigo-650' },
];

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [atsBoost, setAtsBoost] = useState(0);
  const [certCount, setCertCount] = useState(0);
  const [internshipCount, setInternshipCount] = useState(0);
  const [videoStats, setVideoStats] = useState<any>(null);
  
  // Track Mastery System
  const [tracks, setTracks] = useState({ python: 0, dsi: 0, dbms: 0, dsii: 0 });
  const [dbmsCompleted, setDbmsCompleted] = useState<number[]>([]);
  const [dbmsMasteryState, setDbmsMasteryState] = useState<string>('Beginner');

  // Simulated AI Analyzer State
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Show AI scanner simulation for 1.5 seconds on mount
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user?.id) {
      const savedCerts = localStorage.getItem(`user_certificates_${user.id}`);
      const certs = savedCerts ? JSON.parse(savedCerts) : [];
      
      const savedInts = localStorage.getItem(`user_internships_${user.id}`);
      const internships = savedInts ? JSON.parse(savedInts) : [];
      
      const savedVideo = localStorage.getItem(`user_ai_video_stats_${user.id}`);
      setVideoStats(savedVideo ? JSON.parse(savedVideo) : null);
      
      // Load or mock track mastery
      const savedTracks = localStorage.getItem(`user_track_mastery_${user.id}`);
      let currentTracks = { python: 7, dsi: 5, dbms: 4, dsii: 3 };
      if (savedTracks) {
        currentTracks = JSON.parse(savedTracks);
      }
      setTracks(currentTracks);

      // Fetch fresh DBMS track from backend
      fetch(`http://localhost:5000/api/users/${user.id}`)
        .then(res => res.json())
        .then(resData => {
          if (resData.success && resData.data) {
            const freshUser = resData.data;
            setDbmsCompleted(freshUser.dbmsCompletedLevels || []);
            setDbmsMasteryState(freshUser.dbmsMastery || 'Beginner');
            setTracks(prev => {
              const updated = {
                ...prev,
                dbms: freshUser.dbmsLevel !== null && freshUser.dbmsLevel !== undefined ? freshUser.dbmsLevel : 0
              };
              localStorage.setItem(`user_track_mastery_${user.id}`, JSON.stringify(updated));
              return updated;
            });
          }
        })
        .catch(err => console.error("Failed to fetch fresh user profile in Dashboard:", err));
      
      let boost = 0;
      let validCerts = 0;
      let validInts = 0;
      
      certs.forEach((c: any) => {
        if (c.status === 'Verified') {
          boost += c.placementImpact || 0;
          validCerts++;
        }
      });
      
      internships.forEach((i: any) => {
        if (i.status === 'Verified') {
          boost += i.placementImpact || 0;
          validInts++;
        }
      });
      
      if (savedVideo) {
        boost += JSON.parse(savedVideo).atsBoost || 0;
      }

      setAtsBoost(boost);
      setCertCount(validCerts);
      setInternshipCount(validInts);
    } else {
      setAtsBoost(0);
      setCertCount(0);
      setInternshipCount(0);
      setVideoStats(null);
      setTracks({ python: 0, dsi: 0, dbms: 0, dsii: 0 });
      setDbmsCompleted([]);
      setDbmsMasteryState('Beginner');
    }
  }, [user?.id]);

  // Track Proficiency Classification Logic
  const getPythonLevel = (val: number) => val <= 2 ? 'Beginner' : val <= 5 ? 'Intermediate' : 'Advanced';
  const getDsiLevel = (val: number) => val <= 2 ? 'Beginner' : val <= 4 ? 'Intermediate' : 'Advanced';
  const getDsiiLevel = (val: number) => val <= 1 ? 'Beginner' : val <= 3 ? 'Intermediate' : 'Advanced';

  const totalTrackScore = tracks.python + tracks.dsi + tracks.dbms + tracks.dsii;
  const maxTrackScore = 9 + 7 + 6 + 4; // 26
  
  const getOverallProgrammingLevel = () => {
    if (totalTrackScore <= 8) return 'Beginner';
    if (totalTrackScore <= 18) return 'Intermediate';
    return 'Advanced';
  };

  const programmingLevel = getOverallProgrammingLevel();

  // Dynamic ATS calculation
  const programmingBoost = Math.round((totalTrackScore / maxTrackScore) * 20);
  const overallReadiness = Math.min(100, 50 + atsBoost + programmingBoost);

  const renderGenericTrackCard = (
    label: string, 
    icon: any, 
    current: number, 
    max: number, 
    completedLevels: number[],
    mastery: string, 
    intelligenceNote: string,
    colorClass: string,
    progressColor: string,
    shadowColor: string
  ) => {
    const Icon = icon;
    const totalLevelsCount = max + 1;
    const percentage = completedLevels.length > 0 ? (completedLevels.length / totalLevelsCount) * 100 : 0;

    return (
      <motion.div 
        whileHover={{ y: -6, scale: 1.015 }}
        className={cn(
          "bg-[#13131a]/30 backdrop-blur-xl border border-white/[0.06] p-5 rounded-2xl relative overflow-hidden group shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[230px]",
          shadowColor
        )}
      >
        <div className={`absolute top-0 right-0 w-32 h-32 ${progressColor} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity pointer-events-none`} />
        
        <div>
          <div className="flex justify-between items-start mb-3.5 relative z-10">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] ${colorClass} group-hover:bg-white/[0.06] transition-colors`}>
                <Icon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm tracking-tight">{label}</h4>
                <p className="text-[9px] text-gray-500 font-mono">Done: {completedLevels.length > 0 ? completedLevels.join(', ') : 'None'}</p>
              </div>
            </div>
            
            <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border ${
              mastery === 'Advanced' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 
              mastery === 'Intermediate' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' : 
              'text-red-400 border-red-500/20 bg-red-500/5'
            }`}>
              {mastery}
            </span>
          </div>
          
          <div className="w-full bg-white/[0.04] rounded-full h-1.5 relative z-10 overflow-hidden mb-3.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full rounded-full ${progressColor}`} 
            />
          </div>
        </div>

        <div className="space-y-3.5 relative z-10">
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
            <span>Level: {current} / {max}</span>
            <span>Max Level: {max} / {max}</span>
          </div>

          {/* Level indicators */}
          <div className="flex gap-1.5">
            {Array.from({ length: totalLevelsCount }, (_, i) => i).map(lvl => {
              const isCompleted = completedLevels.includes(lvl);
              return (
                <div 
                  key={lvl}
                  className={`h-2 flex-1 rounded-md transition-all duration-300 relative group/bubble ${
                    isCompleted 
                      ? `${progressColor} shadow-[0_0_8px_rgba(45,212,191,0.4)]` 
                      : 'bg-white/[0.03] border border-white/[0.03]'
                  }`}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/bubble:block bg-[#0d0d12] border border-white/10 text-white text-[9px] px-1.5 py-0.5 rounded font-mono pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                    Lvl {lvl}: {isCompleted ? 'Done' : 'Locked'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skill Intelligence Note */}
          <div className="pt-2 border-t border-white/[0.05] text-[10px] text-gray-400 font-medium italic flex items-center gap-2 leading-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0 animate-pulse" />
            {intelligenceNote}
          </div>
        </div>
      </motion.div>
    );
  };

  // Skeleton Loader for UI Scan Mode
  if (isScanning) {
    return (
      <div className="space-y-8 pb-12 scan-effect">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-9 w-72 bg-white/[0.04] rounded-xl shimmer" />
            <div className="h-4 w-96 bg-white/[0.04] rounded-lg shimmer" />
          </div>
          <div className="h-12 w-48 bg-white/[0.04] rounded-xl shimmer" />
        </div>

        {/* Skeleton Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-card/20 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 bg-white/[0.04] rounded shimmer" />
                <div className="h-8 w-8 bg-white/[0.04] rounded-lg shimmer" />
              </div>
              <div className="h-8 w-16 bg-white/[0.04] rounded shimmer mt-4" />
            </div>
          ))}
        </div>

        {/* Skeleton Intelligence Card */}
        <div className="h-80 bg-card/20 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-6 w-60 bg-white/[0.04] rounded shimmer" />
            <div className="h-4 w-[500px] bg-white/[0.04] rounded shimmer" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 bg-white/[0.04] rounded-2xl shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3.5xl font-display font-extrabold text-white mb-2 tracking-tight leading-none"
          >
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="text-gray-400 text-sm font-medium"
          >
            Your placement readiness is {overallReadiness >= 80 ? 'looking great' : 'building up'}. Keep up the momentum!
          </motion.p>
        </div>
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => navigate('/communication-test')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden group bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 text-black font-extrabold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.25)] hover:shadow-[0_0_30px_rgba(45,212,191,0.45)] flex items-center gap-2 cursor-pointer border border-teal-300/30"
        >
          {/* Shimmer effect inside button */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          <Mic className="w-4.5 h-4.5" />
          <span>Communication Test</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Overall Readiness" 
          value={`${overallReadiness}%`} 
          icon={Trophy} 
          trend={atsBoost} 
          trendLabel="ATS Boost" 
          delay={0.05} 
        />
        <MetricCard 
          title="Verified Certificates" 
          value={certCount.toString()} 
          icon={Code2} 
          trend={certCount} 
          trendLabel="Added" 
          delay={0.1} 
        />
        <MetricCard 
          title="Programming Skills" 
          value={programmingLevel} 
          icon={TerminalSquare} 
          delay={0.15} 
          trend={totalTrackScore}
          trendSuffix=" pts"
          trendLabel={`/ ${maxTrackScore}`}
        />
        <MetricCard 
          title="Verified Internships" 
          value={internshipCount.toString()} 
          icon={Briefcase} 
          trend={internshipCount}
          trendLabel="Uploaded"
          delay={0.2} 
        />
      </div>

      {/* Programming Intelligence Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.25 }} 
        className="glass-card p-6 border-l-4 border-l-teal-400 relative overflow-hidden bg-card/30 backdrop-blur-xl border border-white/[0.06]"
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none"><TerminalSquare className="w-36 h-36" /></div>
        
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8 relative z-10">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
              <Code2 className="w-5.5 h-5.5 text-teal-400"/> Programming Track Intelligence
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-medium">Live tracking of your technical mastery. Higher tracks automatically boost product-based placement probabilities.</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1 font-mono">Overall Technical Tier</span>
            <span className={`text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${programmingLevel === 'Advanced' ? 'from-teal-400 to-emerald-400' : 'from-yellow-400 to-orange-400'}`}>
              {programmingLevel} Engineer
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {renderGenericTrackCard(
            'Python',
            Code2,
            tracks.python,
            9,
            Array.from({ length: tracks.python + 1 }, (_, idx) => idx),
            getPythonLevel(tracks.python),
            'Python → AI & Data analytics roles',
            'text-blue-450',
            'bg-blue-500',
            'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/20'
          )}
          {renderGenericTrackCard(
            'Data Structures I',
            Network,
            tracks.dsi,
            7,
            Array.from({ length: tracks.dsi + 1 }, (_, idx) => idx),
            getDsiLevel(tracks.dsi),
            'DSA → Boosts Tier-1 company matches',
            'text-purple-455',
            'bg-purple-500',
            'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/20'
          )}
          {renderGenericTrackCard(
            'DBMS',
            Database,
            tracks.dbms,
            6,
            dbmsCompleted,
            dbmsMasteryState,
            'DBMS → Boosts Backend Systems roles',
            'text-orange-455',
            'bg-orange-500',
            'hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:border-orange-500/20'
          )}
          {renderGenericTrackCard(
            'Data Structures II',
            Target,
            tracks.dsii,
            4,
            Array.from({ length: tracks.dsii + 1 }, (_, idx) => idx),
            getDsiiLevel(tracks.dsii),
            'DS-II → Boosts complex problem solving',
            'text-rose-455',
            'bg-rose-500',
            'hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] hover:border-rose-500/20'
          )}
        </div>

        {programmingLevel === 'Advanced' && (
          <div className="mt-6 p-4 rounded-xl bg-teal-500/5 border border-teal-500/10 text-xs text-teal-300/90 flex items-start gap-3 relative z-10 leading-relaxed">
            <Trophy className="w-5 h-5 flex-shrink-0 mt-0.5 text-teal-400" />
            <p><strong>Recruiter Insight:</strong> Your Advanced mastery in DSA and Database Management unlocks Tier-1 product-based company eligibility. Your resume will bypass standard technical screening layers.</p>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 bg-card/30 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white tracking-tight">Readiness Trend</h3>
              <select className="bg-[#0d0d12] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-teal-500/30 transition-colors">
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
            <div className="h-72 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10}} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d0d12', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#2dd4bf', fontWeight: 'bold' }}
                    labelStyle={{ color: '#999', fontSize: 11 }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#2dd4bf" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GaugeCard value={92} label="Technical Readiness" color="stroke-indigo-400" delay={0.1} />
            <GaugeCard value={85} label="Communication Capacity" color="stroke-purple-400" delay={0.2} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 bg-card/30 border border-white/[0.06]">
            <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Skill Radar</h3>
            <div className="h-64 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                  <PolarGrid stroke="rgba(255,255,255,0.03)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Student" dataKey="A" stroke="#2dd4bf" strokeWidth={2} fill="#2dd4bf" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 bg-card/30 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white tracking-tight">Top Company Matches</h3>
              <Building className="w-5 h-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {topCompanies.map((company, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.05) }}
                  key={company.name} 
                  onClick={() => navigate(`/company/${company.name.toLowerCase().replace(' ', '-')}`)}
                  whileHover={{ x: 3 }}
                  className="p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-teal-500/20 rounded-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${company.color} flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform`}>
                        {company.name[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-200 group-hover:text-teal-400 transition-colors leading-none mb-1">{company.name}</h4>
                        <p className="text-[10px] text-gray-500 font-mono font-medium leading-none">{company.role}</p>
                      </div>
                    </div>
                    <span className="text-teal-400 font-bold text-sm">{company.match}%</span>
                  </div>
                  <div className="w-full bg-white/[0.03] rounded-full h-1 relative overflow-hidden mt-1">
                    <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full" style={{ width: `${company.match}%` }}></div>
                  </div>
                </motion.div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/all-company-matches')}
              className="w-full mt-4 py-2.5 text-xs text-teal-400 hover:text-teal-300 font-bold tracking-wider uppercase transition-colors text-center border border-white/[0.04] hover:border-teal-500/25 bg-white/[0.01] rounded-xl cursor-pointer"
            >
              View All Matches →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
