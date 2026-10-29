import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, ShieldCheck, Target, CheckCircle2, AlertCircle, TrendingUp, Cpu, Award, Zap, Briefcase, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const COMPANY_DB: Record<string, any> = {
  'amazon': {
    name: 'Amazon',
    logo: 'A',
    color: 'from-orange-400 via-amber-500 to-orange-600',
    glowColor: 'shadow-orange-500/10 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] hover:border-orange-500/30',
    overview: 'Amazon focuses on highly scalable backend systems, cloud infrastructure (AWS), and customer-centric engineering. They prioritize Data Structures, System Design, and Cloud computing.',
    difficulty: 'Tier 1 (Very Hard)',
    domains: ['E-Commerce', 'Cloud Computing', 'AI/ML'],
    roles: [
      {
        title: 'SDE-1 (Backend/Full Stack)',
        requiredSkills: ['Node.js', 'Java', 'Data Structures', 'System Design'],
        preferredCerts: ['AWS Cloud Practitioner', 'Problem Solving (HackerRank)'],
        techProficiencyReq: 90,
        internshipReq: 'Preferred',
        aiToolReq: 'Copilot / Cursor',
      },
      {
        title: 'Cloud DevOps Engineer',
        requiredSkills: ['AWS EC2', 'Kubernetes', 'Docker', 'Linux', 'CI/CD'],
        preferredCerts: ['AWS Solutions Architect'],
        techProficiencyReq: 85,
        internshipReq: 'Required',
        aiToolReq: 'Infrastructure AI',
      }
    ]
  },
  'microsoft': {
    name: 'Microsoft',
    logo: 'M',
    color: 'from-blue-400 via-indigo-500 to-blue-600',
    glowColor: 'shadow-blue-500/10 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:border-blue-500/30',
    overview: 'Microsoft values robust software engineering, enterprise integration, and heavy AI-driven product development. Strong foundational programming and Azure knowledge is a massive plus.',
    difficulty: 'Tier 1 (Very Hard)',
    domains: ['Enterprise Software', 'Cloud (Azure)', 'AI'],
    roles: [
      {
        title: 'Software Engineer',
        requiredSkills: ['C#', 'C++', 'System Design', 'React'],
        preferredCerts: ['Azure Fundamentals'],
        techProficiencyReq: 88,
        internshipReq: 'Preferred',
        aiToolReq: 'GitHub Copilot',
      }
    ]
  },
  'zoho': {
    name: 'Zoho',
    logo: 'Z',
    color: 'from-green-400 via-emerald-500 to-green-600',
    glowColor: 'shadow-green-500/10 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:border-green-500/30',
    overview: 'Zoho values deep technical knowledge, algorithmic thinking, and candidates who can build products from scratch without relying heavily on external frameworks.',
    difficulty: 'Tier 2 (Hard)',
    domains: ['SaaS', 'Productivity', 'CRM'],
    roles: [
      {
        title: 'Member Technical Staff',
        requiredSkills: ['C', 'Java', 'Data Structures', 'SQL'],
        preferredCerts: ['Any Programming Core'],
        techProficiencyReq: 80,
        internshipReq: 'Optional',
        aiToolReq: 'Basic',
      },
      {
        title: 'UI/UX Designer',
        requiredSkills: ['Figma', 'Prototyping', 'CSS', 'HTML'],
        preferredCerts: ['Google UX Design'],
        techProficiencyReq: 75,
        internshipReq: 'Preferred',
        aiToolReq: 'Gamma / Canva AI',
      }
    ]
  },
  'tcs-digital': {
    name: 'TCS Digital',
    logo: 'T',
    color: 'from-indigo-400 via-purple-500 to-indigo-650',
    glowColor: 'shadow-indigo-500/10 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] hover:border-indigo-500/30',
    overview: 'TCS Digital recruits top-tier candidates for advanced technology roles including AI/ML, Full Stack, and Cloud integrations.',
    difficulty: 'Tier 2 (Hard)',
    domains: ['IT Services', 'Consulting', 'Digital Transformation'],
    roles: [
      {
        title: 'System Engineer (Digital)',
        requiredSkills: ['Python', 'Java', 'SQL', 'Aptitude'],
        preferredCerts: ['Any Cloud or AI Cert'],
        techProficiencyReq: 75,
        internshipReq: 'Optional',
        aiToolReq: 'Basic',
      }
    ]
  }
};

// Fallback for others
const FALLBACK_COMPANY = {
  name: 'Tech Corp',
  logo: 'T',
  color: 'from-gray-400 via-slate-500 to-gray-650',
  glowColor: 'shadow-gray-500/10 hover:shadow-[0_0_40px_rgba(156,163,175,0.15)] hover:border-gray-500/30',
  overview: 'Leading technology solutions provider looking for skilled engineers and developers.',
  difficulty: 'Tier 3 (Moderate)',
  domains: ['Software', 'IT'],
  roles: [
    {
      title: 'Software Developer',
      requiredSkills: ['Java', 'Python', 'SQL', 'Web Dev'],
      preferredCerts: ['Basic Programming'],
      techProficiencyReq: 65,
      internshipReq: 'Optional',
      aiToolReq: 'Basic',
    }
  ]
};

export function CompanyDetail() {
  const { companyName } = useParams<{ companyName: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [userCerts, setUserCerts] = useState<any[]>([]);
  const [userInts, setUserInts] = useState<any[]>([]);
  const [userAi, setUserAi] = useState<any>(null);
  const [userSkills, setUserSkills] = useState<string[]>(['HTML', 'CSS', 'Python']); 
  const [dbmsCompleted, setDbmsCompleted] = useState<number[]>([]);
  const [dbmsLevel, setDbmsLevel] = useState<number>(0);
  const [dbmsMastery, setDbmsMastery] = useState<string>('Beginner');

  // Simulated AI Analyzer State
  const [isScanning, setIsScanning] = useState(true);

  const company = (companyName && COMPANY_DB[companyName]) || { ...FALLBACK_COMPANY, name: companyName?.toUpperCase() || 'Company' };

  useEffect(() => {
    // Show scanner simulation for 1.2s
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user?.id) {
      const savedCerts = localStorage.getItem(`user_certificates_${user.id}`);
      if (savedCerts) setUserCerts(JSON.parse(savedCerts));
      
      const savedInts = localStorage.getItem(`user_internships_${user.id}`);
      if (savedInts) setUserInts(JSON.parse(savedInts));
      
      const savedAi = localStorage.getItem(`user_ai_stats_${user.id}`);
      if (savedAi) setUserAi(JSON.parse(savedAi));

      // Fetch fresh DBMS track from backend
      fetch(`http://localhost:5000/api/users/${user.id}`)
        .then(res => res.json())
        .then(resData => {
          if (resData.success && resData.data) {
            const freshUser = resData.data;
            setDbmsCompleted(freshUser.dbmsCompletedLevels || []);
            setDbmsLevel(freshUser.dbmsLevel || 0);
            setDbmsMastery(freshUser.dbmsMastery || 'Beginner');
          }
        })
        .catch(err => console.error("Failed to fetch fresh user profile in CompanyDetail:", err));
    }
  }, [user?.id]);

  useEffect(() => {
    let extracted: string[] = ['HTML', 'CSS', 'Python'];
    if (userInts && userInts.length > 0) {
      userInts.forEach((i: any) => {
        if (i.technologies) extracted.push(...i.technologies);
      });
    }
    if (dbmsLevel > 0) {
      extracted.push('SQL', 'DBMS', 'Database');
    }
    setUserSkills(Array.from(new Set(extracted)));
  }, [userInts, dbmsLevel]);

  const calculateMatch = (role: any) => {
    let match = 50; // base
    
    // Check missing skills
    const missing = role.requiredSkills.filter((s: string) => !userSkills.some(us => us.toLowerCase().includes(s.toLowerCase())));
    const skillMatchRatio = (role.requiredSkills.length - missing.length) / role.requiredSkills.length;
    match += (skillMatchRatio * 20);

    // AI Tools boost
    if (userAi && userAi.overall > 50) match += 10;
    
    // Internship boost
    if (role.internshipReq === 'Required' && userInts.length === 0) match -= 15;
    else if (userInts.length > 0) match += 10;
    
    // Cert boost
    if (userCerts.length > 0) match += 10;

    // Strong DBMS students boost, Weak ones penalty for backend/software/developer roles
    const isBackendRole = role.title.toLowerCase().includes('backend') || 
                          role.title.toLowerCase().includes('full stack') || 
                          role.title.toLowerCase().includes('software engineer') || 
                          role.title.toLowerCase().includes('technical staff') ||
                          role.title.toLowerCase().includes('developer') ||
                          role.title.toLowerCase().includes('sde');

    if (isBackendRole) {
      if (dbmsMastery === 'Advanced') {
        match += 15;
      } else if (dbmsMastery === 'Intermediate') {
        match += 8;
      } else {
        match -= 12;
      }
    }

    return {
      score: Math.min(99, Math.max(10, Math.round(match))),
      missingSkills: missing,
      isBackendRole
    };
  };

  const overallScore = Math.round(company.roles.reduce((acc: number, r: any) => acc + calculateMatch(r).score, 0) / company.roles.length);

  // Skeleton Loader for scanning state
  if (isScanning) {
    return (
      <div className="space-y-8 pb-12 scan-effect">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-white/[0.04] rounded-xl shimmer" />
          <div className="h-14 w-14 bg-white/[0.04] rounded-2xl shimmer" />
          <div className="space-y-2">
            <div className="h-8 w-44 bg-white/[0.04] rounded shimmer" />
            <div className="h-4 w-32 bg-white/[0.04] rounded shimmer" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-32 bg-card/20 rounded-2xl border border-white/[0.05] md:col-span-2 shimmer" />
          <div className="h-32 bg-card/20 rounded-2xl border border-white/[0.05] shimmer" />
          <div className="h-32 bg-card/20 rounded-2xl border border-white/[0.05] shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      
      {/* Header and Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.05] pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl transition-all cursor-pointer group hover:scale-[1.03]"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-gray-300 group-hover:text-teal-400 transition-colors" />
          </button>
          
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${company.color} flex items-center justify-center shadow-lg transition-transform duration-500 group hover:rotate-6`}>
            <span className="text-2xl font-black text-white drop-shadow-lg">{company.logo}</span>
          </div>
          <div>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight leading-none mb-1.5">{company.name}</h1>
            <p className="text-xs text-gray-400 font-semibold uppercase font-mono tracking-wider">{company.domains.join(' • ')}</p>
          </div>
        </div>
      </div>

      {/* Top Overview Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Company Profile Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className={cn(
            "glass-card p-6 md:col-span-2 border-t-4 border-t-indigo-500/80 bg-card/30 border border-white/[0.06]",
            company.glowColor
          )}
        >
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2.5 tracking-tight">
            <Building2 className="w-4.5 h-4.5 text-indigo-400"/> Corporate Focus
          </h3>
          <p className="text-gray-350 text-sm leading-relaxed font-medium mt-3">{company.overview}</p>
          <div className="mt-5 flex items-center gap-2.5">
            <span className="px-3 py-1 bg-[#060608]/40 border border-white/[0.06] rounded-lg text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">
              Shortlist Rate: {company.difficulty}
            </span>
          </div>
        </motion.div>

        {/* Dynamic Placement Gauge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.05 }} 
          className="glass-card p-6 border-t-4 border-t-teal-400/80 relative overflow-hidden bg-card/30 border border-white/[0.06] hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] hover:border-teal-500/20"
        >
          <div className="absolute right-0 top-0 opacity-[0.02] p-4 pointer-events-none"><Target className="w-24 h-24" /></div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 font-mono">Core Compatibility</p>
          <div className="flex items-end gap-3.5 mt-3">
            <span className="text-4.5xl font-display font-black text-white leading-none tracking-tighter">{overallScore}%</span>
            <span className="text-teal-400 text-xs font-extrabold flex items-center mb-1 font-mono uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Strong
            </span>
          </div>
          <div className="w-full bg-white/[0.04] h-1.5 rounded-full mt-5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${overallScore}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full" 
            />
          </div>
        </motion.div>

        {/* AI shortlisting odds */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          className="glass-card p-6 border-t-4 border-t-purple-400/80 relative overflow-hidden bg-card/30 border border-white/[0.06] hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:border-purple-500/20"
        >
          <div className="absolute right-0 top-0 opacity-[0.02] p-4 pointer-events-none"><ShieldCheck className="w-24 h-24" /></div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 font-mono">Recruiter Shortlist Weight</p>
          <div className="flex items-end gap-3.5 mt-3">
            <span className="text-4.5xl font-display font-black text-white leading-none tracking-tighter">
              {userAi ? Math.min(99, overallScore + 5) : Math.max(30, overallScore - 12)}%
            </span>
          </div>
          <p className="text-[10px] text-gray-500 font-medium mt-4 leading-normal">
            {userAi ? 'Active AI Copilot Mastery boosts this score.' : 'Assess AI tools to increase shortlist preference.'}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Roles Analysis */}
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Active Professional Tracks</h2>
          
          {company.roles.map((role: any, idx: number) => {
            const matchData = calculateMatch(role);
            return (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.15 + (idx * 0.05) }}
                key={role.title} 
                className="glass-card p-6 bg-card/30 border border-white/[0.06] hover:border-indigo-500/20 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  {/* Left Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{role.title}</h3>
                      <p className="text-[9px] text-gray-500 uppercase tracking-widest font-mono font-bold mt-1">Technical Threshold requirements</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 text-xs">
                      <div className="bg-[#060608]/40 p-3 rounded-xl border border-white/[0.04] transition-colors hover:border-white/[0.08]">
                        <span className="text-gray-500 block mb-1 text-[10px] font-bold uppercase tracking-wider font-mono">Proficiency Target</span>
                        <span className="text-gray-200 font-semibold">{role.techProficiencyReq}% Minimum</span>
                      </div>
                      <div className="bg-[#060608]/40 p-3 rounded-xl border border-white/[0.04] transition-colors hover:border-white/[0.08]">
                        <span className="text-gray-500 block mb-1 text-[10px] font-bold uppercase tracking-wider font-mono">Experience Index</span>
                        <span className="text-gray-200 font-semibold">{role.internshipReq}</span>
                      </div>
                      <div className="bg-[#060608]/40 p-3 rounded-xl border border-white/[0.04] transition-colors hover:border-white/[0.08]">
                        <span className="text-gray-500 block mb-1 text-[10px] font-bold uppercase tracking-wider font-mono">AI Tools Standard</span>
                        <span className="text-indigo-400 font-semibold">{role.aiToolReq}</span>
                      </div>
                      <div className="bg-[#060608]/40 p-3 rounded-xl border border-white/[0.04] transition-colors hover:border-white/[0.08]">
                        <span className="text-gray-500 block mb-1 text-[10px] font-bold uppercase tracking-wider font-mono">Target Certification</span>
                        <span className="text-gray-200 font-semibold truncate block">{role.preferredCerts[0]}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2.5 block font-mono">Prerequisites Stack</span>
                      <div className="flex flex-wrap gap-1.5">
                        {role.requiredSkills.map((skill: string) => (
                          <span key={skill} className="px-2.5 py-1 rounded-md text-xs font-semibold border border-white/[0.06] bg-white/[0.01] text-gray-300 font-mono">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Match Gauge */}
                  <div className="md:w-64 bg-[#08080c] rounded-2xl p-5 border border-white/[0.05] flex flex-col justify-between hover:border-white/10 transition-colors">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Index Score</span>
                        <span className={cn("text-xl font-black font-mono", matchData.score >= 80 ? "text-emerald-400" : matchData.score >= 60 ? "text-yellow-400" : "text-red-400")}>
                          {matchData.score}%
                        </span>
                      </div>
                      <div className="w-full bg-white/[0.03] h-1.5 rounded-full mb-6 overflow-hidden">
                        <div className={cn("h-full rounded-full", matchData.score >= 80 ? "bg-emerald-400" : matchData.score >= 60 ? "bg-yellow-400" : "bg-red-400")} style={{width: `${matchData.score}%`}}></div>
                      </div>
                    </div>

                    {matchData.missingSkills.length > 0 || (matchData.isBackendRole && dbmsMastery === 'Beginner') ? (
                      <div className="space-y-3">
                        {matchData.missingSkills.length > 0 && (
                          <div>
                            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2 font-mono">
                              <AlertCircle className="w-3.5 h-3.5" /> Gaps Identified
                            </span>
                            <ul className="space-y-1.5 pl-1.5">
                              {matchData.missingSkills.slice(0, 3).map((ms: string) => (
                                <li key={ms} className="text-xs text-gray-400 font-semibold flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-red-400" /> {ms}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {matchData.isBackendRole && dbmsMastery === 'Beginner' && (
                          <div className="bg-orange-500/[0.04] border border-orange-500/20 rounded-xl p-3">
                            <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5 font-mono">
                              ⚠️ DBMS Critical Level
                            </span>
                            <p className="text-[10px] text-gray-400 leading-normal font-medium">
                              Your database level is low. Upgrade DBMS track levels to boost suitability.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-emerald-350 font-medium leading-relaxed">Your portfolio meets all stack requirements!</span>
                      </div>
                    )}
                  </div>
                  
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic AI Insights Panel */}
        <div className="space-y-6">
          
          <div className="glass-card p-6 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-500/5 to-transparent bg-card/30 border border-white/[0.06] hover:shadow-[0_0_35px_rgba(168,85,247,0.08)]">
            <div className="flex items-center gap-2.5 mb-4 border-b border-white/[0.04] pb-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Placement Analytics
              </h3>
            </div>
            
            <div className="space-y-4">
              {overallScore >= 80 ? (
                <div className="bg-[#0d0d12] border border-white/[0.05] p-4 rounded-xl hover:border-emerald-500/20 transition-colors">
                  <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-wider font-mono mb-1">Strong Match Potential</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium mt-1.5">Based on credentials, recruiters are 85% likely to shortlist your portfolio for initial screenings.</p>
                </div>
              ) : (
                <div className="bg-[#0d0d12] border border-white/[0.05] p-4 rounded-xl hover:border-yellow-500/20 transition-colors">
                  <h4 className="text-yellow-400 text-xs font-bold uppercase tracking-wider font-mono mb-1">Upskill Pipeline Required</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium mt-1.5">You are currently below target threshold levels. Focus on resolving the technical gaps list.</p>
                </div>
              )}

              {dbmsMastery === 'Beginner' && (
                <div className="bg-orange-500/5 border border-orange-500/10 p-4 rounded-xl">
                  <h4 className="text-orange-400 text-xs font-bold uppercase tracking-wider font-mono mb-1">DBMS Upskilling Path</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium mt-1.5">
                    We recommend completing DBMS Levels to raise compatibility with product stacks.
                  </p>
                </div>
              )}
              
              {!userCerts.length && (
                <div className="bg-[#0d0d12] border border-white/[0.05] p-4 rounded-xl flex gap-3.5 hover:border-indigo-500/20 transition-colors">
                  <Award className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-wider font-mono mb-1">Credentials Action</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium mt-1">Upload a verified certification to boost matchmaking rates by +10%.</p>
                  </div>
                </div>
              )}
              
              {!userInts.length && (
                <div className="bg-[#0d0d12] border border-white/[0.05] p-4 rounded-xl flex gap-3.5 hover:border-blue-500/20 transition-colors">
                  <Briefcase className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider font-mono mb-1">Industrial Experience</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium mt-1">Upload validation for internship terms to bypass core technical layers.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Candidate Comparison radar chart */}
          <div className="glass-card p-6 bg-card/30 border border-white/[0.06]">
            <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-widest font-mono">Competitor Index Matrix</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                  { metric: 'Tech Skill', You: Math.min(100, userSkills.length * 20), Avg: 70 },
                  { metric: 'Experience', You: userInts.length ? 85 : 20, Avg: 50 },
                  { metric: 'AI Tools', You: userAi?.overall || 10, Avg: 60 },
                  { metric: 'Projects', You: 65, Avg: 60 },
                  { metric: 'Certs', You: userCerts.length ? 90 : 10, Avg: 40 },
                ]}>
                  <PolarGrid stroke="rgba(255,255,255,0.03)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' }} />
                  <Radar name="You" dataKey="You" stroke="#2dd4bf" strokeWidth={2} fill="#2dd4bf" fillOpacity={0.25} />
                  <Radar name="Average Candidate" dataKey="Avg" stroke="#6366f1" strokeWidth={1.5} fill="transparent" strokeDasharray="3 3" />
                  <Tooltip contentStyle={{ backgroundColor: '#0d0d12', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', backdropFilter: 'blur(10px)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2 text-[10px] font-bold uppercase tracking-wider font-mono">
              <span className="flex items-center gap-1.5 text-gray-300"><div className="w-2.5 h-2.5 rounded bg-teal-400"></div> Your Profile</span>
              <span className="flex items-center gap-1.5 text-gray-500"><div className="w-2.5 h-2.5 rounded bg-indigo-500"></div> Competitors</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
