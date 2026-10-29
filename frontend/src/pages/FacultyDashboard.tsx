import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, Award, FileDown, Search, ArrowUpRight, BarChart3, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';
import { MetricCard } from '../components/ui/MetricCard';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, ComposedChart
} from 'recharts';

const departmentData = [
  { name: 'CSE', readiness: 88, placed: 145, total: 180, avgCtc: 8.5, aiAdoption: 92, internships: 160 },
  { name: 'IT', readiness: 85, placed: 120, total: 150, avgCtc: 7.8, aiAdoption: 88, internships: 130 },
  { name: 'AIML', readiness: 92, placed: 95, total: 100, avgCtc: 10.2, aiAdoption: 98, internships: 98 },
  { name: 'Cyber', readiness: 82, placed: 50, total: 60, avgCtc: 9.0, aiAdoption: 75, internships: 55 },
  { name: 'ECE', readiness: 75, placed: 85, total: 140, avgCtc: 6.5, aiAdoption: 60, internships: 90 },
];

const placementTrends = [
  { month: 'Jul', CSE: 10, IT: 5, AIML: 8, Cyber: 2, ECE: 4 },
  { month: 'Aug', CSE: 25, IT: 15, AIML: 20, Cyber: 8, ECE: 10 },
  { month: 'Sep', CSE: 45, IT: 35, AIML: 35, Cyber: 15, ECE: 20 },
  { month: 'Oct', CSE: 80, IT: 65, AIML: 60, Cyber: 25, ECE: 40 },
  { month: 'Nov', CSE: 110, IT: 90, AIML: 80, Cyber: 35, ECE: 55 },
  { month: 'Dec', CSE: 145, IT: 120, AIML: 95, Cyber: 50, ECE: 85 },
];

const topStudents = [
  { id: 1, name: 'Sarah Chen', dept: 'AIML', score: 98, status: 'Placed - Amazon', ctc: '24 LPA', avatar: 'S' },
  { id: 2, name: 'Rahul Sharma', dept: 'CSE', score: 96, status: 'Placed - Microsoft', ctc: '22 LPA', avatar: 'R' },
  { id: 3, name: 'Priya Patel', dept: 'IT', score: 94, status: 'Placed - Zoho', ctc: '15 LPA', avatar: 'P' },
  { id: 4, name: 'John Davis', dept: 'Cyber', score: 93, status: 'Interview - Palo Alto', ctc: '-', avatar: 'J' },
];

const weakStudents = [
  { id: 1, name: 'Amit Kumar', dept: 'ECE', issue: 'Low DSA Score (40%)', action: 'Assigned to Bootcamp' },
  { id: 2, name: 'Neha Gupta', dept: 'CSE', issue: 'No Internships', action: 'Counseling Scheduled' },
  { id: 3, name: 'Vikram Singh', dept: 'IT', issue: 'Poor Communication', action: 'Soft Skills Training' },
];

const skillGapHeatmap = [
  { skill: 'DSA', CSE: 85, IT: 75, AIML: 80, Cyber: 70, ECE: 55 },
  { skill: 'System Design', CSE: 70, IT: 60, AIML: 65, Cyber: 60, ECE: 40 },
  { skill: 'Cloud/AWS', CSE: 75, IT: 80, AIML: 85, Cyber: 90, ECE: 50 },
  { skill: 'AI/ML', CSE: 60, IT: 50, AIML: 95, Cyber: 45, ECE: 30 },
  { skill: 'Full Stack', CSE: 90, IT: 85, AIML: 75, Cyber: 65, ECE: 60 },
];

export function FacultyDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'students'>('overview');

  const getHeatmapColor = (value: number) => {
    if (value >= 85) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (value >= 70) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3"
          >
            {user?.name?.split(' ')[0] || 'HOD'} Analytics Hub <GraduationCap className="w-8 h-8 text-teal-400" />
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl"
          >
            Enterprise-grade monitoring for department readiness, placement predictions, and skill gap analysis.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-3"
        >
          <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl transition-all border border-white/10 flex items-center gap-2 text-sm font-medium">
            <BarChart3 className="w-4 h-4 text-teal-400" /> Generate Report
          </button>
          <button className="bg-teal-500 hover:bg-teal-400 text-black px-4 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center gap-2 text-sm font-bold">
            <FileDown className="w-4 h-4" /> Export Excel
          </button>
        </motion.div>
      </div>

      <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl w-max">
        {['overview', 'departments', 'students'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 capitalize",
              activeTab === tab ? "bg-teal-500 text-black shadow-lg shadow-teal-500/20" : "text-gray-400 hover:text-white"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Total Eligible Students" value="630" icon={Users} trend={5.2} trendLabel="vs last year" delay={0.1} />
            <MetricCard title="Overall Readiness Avg" value="84.4%" icon={TrendingUp} trend={2.1} trendLabel="vs last month" delay={0.2} />
            <MetricCard title="AI Tool Adoption" value="78%" icon={Award} trend={12.5} trendLabel="since launch" delay={0.3} />
            <MetricCard title="At-Risk Students" value="45" icon={AlertTriangle} trend={-15} trendLabel="vs last month" delay={0.4} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Department Readiness & Placement Rate</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={departmentData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="readiness" name="Readiness Score %" fill="#2dd4bf" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Line yAxisId="right" type="monotone" dataKey="avgCtc" name="Avg CTC (LPA)" stroke="#818cf8" strokeWidth={3} dot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Placement Trend (Offers/Month)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={placementTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCSE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAIML" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="CSE" stackId="1" stroke="#2dd4bf" fill="url(#colorCSE)" />
                    <Area type="monotone" dataKey="AIML" stackId="1" stroke="#818cf8" fill="url(#colorAIML)" />
                    <Area type="monotone" dataKey="IT" stackId="1" stroke="#34d399" fill="#34d399" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'departments' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Skill Gap Heatmap</h3>
              <p className="text-xs text-gray-400">Values indicate percentage of students proficient</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-white/10 text-gray-400 font-medium text-sm">Skill Domain</th>
                    {departmentData.map(d => (
                      <th key={d.name} className="p-4 border-b border-white/10 text-gray-200 font-medium text-sm text-center">{d.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {skillGapHeatmap.map((row) => (
                    <tr key={row.skill} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gray-300 font-medium text-sm">{row.skill}</td>
                      {departmentData.map(dept => {
                        const val = row[dept.name as keyof typeof row] as number;
                        return (
                          <td key={dept.name} className="p-4 text-center">
                            <span className={cn(
                              "inline-block px-3 py-1 rounded-md text-xs font-bold border",
                              getHeatmapColor(val)
                            )}>
                              {val}%
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 border-t-4 border-t-teal-500">
              <h4 className="text-lg font-semibold text-white mb-2">Highest AI Adoption</h4>
              <p className="text-3xl font-display font-bold text-teal-400 mb-1">AIML <span className="text-sm text-gray-400 font-sans font-normal">98% students</span></p>
              <p className="text-xs text-gray-500">Leading the college in modern tooling.</p>
            </div>
            <div className="glass-card p-6 border-t-4 border-t-indigo-500">
              <h4 className="text-lg font-semibold text-white mb-2">Most Internships</h4>
              <p className="text-3xl font-display font-bold text-indigo-400 mb-1">CSE <span className="text-sm text-gray-400 font-sans font-normal">160 completed</span></p>
              <p className="text-xs text-gray-500">Highest industry exposure rate.</p>
            </div>
            <div className="glass-card p-6 border-t-4 border-t-red-500">
              <h4 className="text-lg font-semibold text-white mb-2">Critical Attention</h4>
              <p className="text-3xl font-display font-bold text-red-400 mb-1">ECE <span className="text-sm text-gray-400 font-sans font-normal">Cloud Skills</span></p>
              <p className="text-xs text-gray-500">Requires immediate bootcamp scheduling.</p>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'students' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" /> College Leaderboard
              </h3>
              <button className="text-sm text-teal-400 hover:text-teal-300">View All</button>
            </div>
            <div className="space-y-4">
              {topStudents.map((student, i) => (
                <div key={student.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    {student.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-semibold text-white">{student.name}</h4>
                      <span className="text-sm font-bold text-teal-400">{student.score}%</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-400">{student.dept} • {student.status}</p>
                      <span className="text-xs text-emerald-400 font-medium">{student.ctc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border border-red-500/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" /> Action Required (At-Risk)
              </h3>
              <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 flex items-center">
                <Search className="w-3 h-3 text-gray-400 mr-2" />
                <input type="text" placeholder="Search ID..." className="bg-transparent border-none outline-none text-xs w-20 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              {weakStudents.map((student) => (
                <div key={student.id} className="flex items-center gap-4 p-4 bg-red-500/5 rounded-xl border border-red-500/10 hover:bg-red-500/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gray-800 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
                    {student.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{student.name} <span className="text-xs text-gray-500 ml-2">{student.dept}</span></h4>
                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {student.issue}
                        </p>
                      </div>
                      <button className="text-[10px] uppercase tracking-wider font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                        Action <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="mt-3 text-xs text-gray-400 bg-black/20 p-2 rounded border border-white/5">
                      <span className="text-gray-500">Proposed Strategy:</span> {student.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-dashed border-white/20 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/40 transition-all">
              Load More Students
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
