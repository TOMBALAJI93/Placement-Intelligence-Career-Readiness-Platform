import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, Phone, MapPin, ExternalLink, ShieldCheck, Download, Star, Database, Code2, Network, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export function Profile() {
  const { user } = useAuth();
  
  const [tracks, setTracks] = useState({ python: 0, dsi: 0, dbms: 0, dsii: 0 });
  const [dbmsCompleted, setDbmsCompleted] = useState<number[]>([]);
  const [dbmsMasteryState, setDbmsMasteryState] = useState<string>('Beginner');

  useEffect(() => {
    if (user?.id) {
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
        .catch(err => console.error("Failed to fetch fresh user profile in Profile page:", err));
    }
  }, [user?.id]);

  const getPythonLevel = (val: number) => val <= 2 ? 'Beginner' : val <= 5 ? 'Intermediate' : 'Advanced';
  const getDsiLevel = (val: number) => val <= 2 ? 'Beginner' : val <= 4 ? 'Intermediate' : 'Advanced';
  const getDsiiLevel = (val: number) => val <= 1 ? 'Beginner' : val <= 3 ? 'Intermediate' : 'Advanced';

  const getGlowStyles = (mastery: string) => {
    if (mastery === 'Advanced') {
      return {
        badge: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
        bar: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]',
        border: 'hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]'
      };
    }
    if (mastery === 'Intermediate') {
      return {
        badge: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5',
        bar: 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]',
        border: 'hover:border-yellow-500/30 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]'
      };
    }
    return {
      badge: 'text-red-400 border-red-500/20 bg-red-500/5',
      bar: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]',
      border: 'hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]'
    };
  };
  
  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* Profile Header Canvas */}
      <div className="relative">
        <div className="h-52 w-full rounded-2xl bg-gradient-to-r from-teal-950/60 via-indigo-950/50 to-[#0c0c12] border border-white/[0.06] overflow-hidden relative shadow-2xl">
          {/* Futuristic grid mesh overlay inside header */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
          
          <div className="absolute bottom-5 right-5 bg-[#060608]/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/[0.08] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-200">Profile Verified (85%)</span>
          </div>
        </div>
        
        <div className="absolute -bottom-16 left-8 flex flex-col md:flex-row md:items-end gap-5">
          <div className="relative group select-none">
            <div className="w-32 h-32 rounded-2xl border-4 border-[#060608] bg-gray-900 overflow-hidden relative shadow-2xl">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=13141f&color=2dd4bf&size=256&bold=true`} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-7 h-7 rounded-xl border-3 border-[#060608] flex items-center justify-center shadow-lg" title="Verified Student">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <div className="mb-3">
            <h1 className="text-3xl font-display font-extrabold text-white flex flex-wrap items-center gap-3 tracking-tight leading-none">
              {user?.name || 'Student Name'}
              <span className="bg-teal-500/10 text-teal-400 text-[10px] px-3 py-1 rounded-full font-bold border border-teal-500/20 font-mono uppercase tracking-wider">
                {user?.department || 'Department'} • {user?.id || 'ID'}
              </span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm font-medium">Aspiring Full Stack AI Engineer</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
        {/* Left Column (Contact & Resume) */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card p-6 bg-card/30 border border-white/[0.06]"
          >
            <h3 className="text-base font-bold text-white mb-4 tracking-tight border-b border-white/[0.04] pb-2">Contact Intelligence</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 text-gray-300">
                <div className="p-2 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <Mail className="w-4 h-4 text-teal-400" />
                </div>
                <span className="text-sm font-medium truncate">{user?.id || 'student'}@college.edu</span>
              </div>
              <div className="flex items-center gap-3.5 text-gray-300">
                <div className="p-2 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <Phone className="w-4 h-4 text-teal-400" />
                </div>
                <span className="text-sm font-medium font-mono">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3.5 text-gray-300">
                <div className="p-2 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  <MapPin className="w-4 h-4 text-teal-400" />
                </div>
                <span className="text-sm font-medium">Chennai, Tamil Nadu, IN</span>
              </div>
            </div>

            <hr className="border-white/[0.05] my-6" />
            
            <h3 className="text-base font-bold text-white mb-4 tracking-tight">Connected Profiles</h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center justify-between text-sm text-gray-400 hover:text-teal-400 font-medium px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-teal-500/20 transition-all group">
                <span className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-teal-400 transition-colors" /> LinkedIn
                </span>
                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">→</span>
              </a>
              <a href="#" className="flex items-center justify-between text-sm text-gray-400 hover:text-teal-400 font-medium px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-teal-500/20 transition-all group">
                <span className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-teal-400 transition-colors" /> GitHub
                </span>
                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">→</span>
              </a>
              <a href="#" className="flex items-center justify-between text-sm text-gray-400 hover:text-teal-400 font-medium px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-teal-500/20 transition-all group">
                <span className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-teal-400 transition-colors" /> LeetCode
                </span>
                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-xs">→</span>
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 bg-card/30 border border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-4.5">
              <h3 className="text-base font-bold text-white tracking-tight">Active Resume</h3>
              <button className="text-teal-400 hover:text-teal-300 text-xs font-bold uppercase tracking-wider">Update</button>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] hover:border-white/10 rounded-xl p-4 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-[130px]">{user?.name?.split(' ')[0] || 'Student'}_Resume.pdf</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">Verified • 2d ago</p>
                </div>
              </div>
              <button className="p-2.5 hover:bg-white/[0.04] rounded-xl border border-white/[0.04] transition-colors cursor-pointer">
                <Download className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="mt-4 bg-teal-500/5 border border-teal-500/10 rounded-xl p-3 flex items-center gap-2.5">
              <div className="p-1 rounded-md bg-teal-400/10"><Star className="w-4.5 h-4.5 text-teal-400" /></div>
              <p className="text-xs text-teal-350 font-semibold">
                Technical ATS Score: 85/100
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Track Mastery Grid & Academic Details) */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6 bg-card/30 border border-white/[0.06]"
          >
            <div className="flex justify-between items-center mb-6 border-b border-white/[0.04] pb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5 tracking-tight">
                <Code2 className="w-5 h-5 text-teal-400" /> Track Mastery Levels
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Python',
                  icon: Code2,
                  completed: tracks.python + 1,
                  max: 10,
                  mastery: getPythonLevel(tracks.python),
                  percentage: ((tracks.python + 1) / 10) * 100,
                  impact: 'Python → AI / Data Science Roles'
                },
                {
                  name: 'Data Structures I',
                  icon: Network,
                  completed: tracks.dsi + 1,
                  max: 8,
                  mastery: getDsiLevel(tracks.dsi),
                  percentage: ((tracks.dsi + 1) / 8) * 100,
                  impact: 'DS-I → Tier-1 Product Companies'
                },
                {
                  name: 'DBMS',
                  icon: Database,
                  completed: dbmsCompleted.length,
                  max: 7,
                  mastery: dbmsMasteryState,
                  percentage: (dbmsCompleted.length / 7) * 100,
                  impact: 'DBMS → Backend Engineering Roles'
                },
                {
                  name: 'Data Structures II',
                  icon: Target,
                  completed: tracks.dsii + 1,
                  max: 5,
                  mastery: getDsiiLevel(tracks.dsii),
                  percentage: ((tracks.dsii + 1) / 5) * 100,
                  impact: 'DS-II → Complex Problem Solving'
                }
              ].map(track => {
                const Icon = track.icon;
                const styles = getGlowStyles(track.mastery);
                return (
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.01 }}
                    key={track.name} 
                    className={cn(
                      "bg-[#13131a]/30 border border-white/[0.05] p-5 rounded-2xl relative overflow-hidden group shadow-lg transition-all duration-300",
                      styles.border
                    )}
                  >
                    <div className="flex justify-between items-start mb-3.5 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-teal-400 group-hover:bg-white/[0.05] transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm tracking-tight">{track.name}</h4>
                          <span className="text-[10px] text-gray-500 font-mono">
                            Completed: {track.completed} / {track.max}
                          </span>
                        </div>
                      </div>
                      <span className={cn("px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border", styles.badge)}>
                        {track.mastery}
                      </span>
                    </div>

                    <div className="w-full bg-white/[0.04] rounded-full h-1.5 relative z-10 overflow-hidden mb-3.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${track.percentage}%` }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className={cn("h-full rounded-full", styles.bar)} 
                      />
                    </div>

                    <div className="text-[10px] text-gray-400 font-medium italic flex items-center gap-2 leading-tight pt-2.5 border-t border-white/[0.05]">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                      {track.impact}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 bg-card/30 border border-white/[0.06]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-white tracking-tight">Academic Profile</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/[0.02] border border-white/[0.05] hover:border-white/10 rounded-2xl p-4.5 text-center transition-colors">
                <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-semibold">CGPA</p>
                <p className="text-2xl font-display font-black text-white">8.75</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] hover:border-white/10 rounded-2xl p-4.5 text-center transition-colors">
                <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-semibold">Arrears</p>
                <p className="text-2xl font-display font-black text-white">0</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] hover:border-white/10 rounded-2xl p-4.5 text-center transition-colors">
                <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-semibold">12th Grade</p>
                <p className="text-2xl font-display font-black text-white font-mono">92%</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] hover:border-white/10 rounded-2xl p-4.5 text-center transition-colors">
                <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-semibold">10th Grade</p>
                <p className="text-2xl font-display font-black text-white font-mono">95%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
