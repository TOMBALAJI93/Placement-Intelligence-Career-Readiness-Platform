import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, Settings, Activity, CheckCircle, XCircle, Search, Filter, AlertTriangle, FileText, Database, Server, BarChart3, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'overview' | 'users' | 'verifications' | 'config';

const activityData = [
  { name: 'Mon', active: 400 },
  { name: 'Tue', active: 600 },
  { name: 'Wed', active: 850 },
  { name: 'Thu', active: 1100 },
  { name: 'Fri', active: 950 },
  { name: 'Sat', active: 1300 },
  { name: 'Sun', active: 1450 },
];

const mockUsers = [
  { id: '24111001', name: 'ABDUL JABBAR A H', dept: 'Cyber Security', readiness: 92, status: 'Active' },
  { id: '24111003', name: 'ABINAYA A', dept: 'Cyber Security', readiness: 88, status: 'Active' },
  { id: '24111024', name: 'DHARSHINI K', dept: 'Cyber Security', readiness: 45, status: 'Flagged' },
  { id: '24111041', name: 'KARTHIGEYANVAIBHAV T G', dept: 'Cyber Security', readiness: 96, status: 'Active' },
  { id: '24111058', name: 'MUGILESH S V', dept: 'Cyber Security', readiness: 71, status: 'Active' },
];

const mockVerifications = [
  { id: 'v1', student: 'ABISHECK R', type: 'AWS Solutions Architect', date: '2 hours ago', risk: 'Low' },
  { id: 'v2', student: 'AMIRDHA DHARSHINI', type: 'Internship - Zoho', date: '5 hours ago', risk: 'Medium' },
  { id: 'v3', student: 'EVAN PRAISON A', type: 'Coursera ML', date: '1 day ago', risk: 'High' },
];

export function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // States for interactive demo
  const [verifications, setVerifications] = useState(mockVerifications);
  const [atsWeight, setAtsWeight] = useState(40);
  const [internWeight, setInternWeight] = useState(30);
  const [aiWeight, setAiWeight] = useState(30);

  const handleVerify = (id: string, action: 'approve' | 'reject') => {
    setVerifications(prev => prev.filter(v => v.id !== id));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-red-500 bg-red-500/5">
          <p className="text-sm text-gray-400 font-medium mb-1">Total Active Students</p>
          <h2 className="text-3xl font-bold text-white mb-2">1,248</h2>
          <p className="text-xs text-red-400 flex items-center gap-1"><Activity className="w-3 h-3"/> +12% this week</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-orange-500 bg-orange-500/5">
          <p className="text-sm text-gray-400 font-medium mb-1">Avg Placement Readiness</p>
          <h2 className="text-3xl font-bold text-white mb-2">68%</h2>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-orange-500 h-full rounded-full" style={{width: '68%'}}></div>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-purple-500 bg-purple-500/5">
          <p className="text-sm text-gray-400 font-medium mb-1">Pending Verifications</p>
          <h2 className="text-3xl font-bold text-white mb-2">{verifications.length}</h2>
          <p className="text-xs text-purple-400 flex items-center gap-1"><Clock className="w-3 h-3"/> Requires Admin action</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-emerald-500 bg-emerald-500/5">
          <p className="text-sm text-gray-400 font-medium mb-1">System Health</p>
          <h2 className="text-3xl font-bold text-white mb-2">99.9%</h2>
          <p className="text-xs text-emerald-400 flex items-center gap-1"><Server className="w-3 h-3"/> All AI nodes operational</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-red-400"/> Global Platform Traffic</h3>
        <div className="h-[300px] w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(239,68,68,0.2)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="active" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-orange-400"/> Global User Directory</h3>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search ID or Name..." className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"><Filter className="w-4 h-4"/> Filter</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
              <th className="p-4 font-medium">Register No</th>
              <th className="p-4 font-medium">Student Name</th>
              <th className="p-4 font-medium">Department</th>
              <th className="p-4 font-medium">Readiness Score</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((u, i) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm text-gray-300">
                <td className="p-4 font-mono text-gray-400">{u.id}</td>
                <td className="p-4 font-medium text-white">{u.name}</td>
                <td className="p-4">{u.dept}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className={u.readiness > 80 ? "text-emerald-400 font-bold" : u.readiness > 50 ? "text-yellow-400 font-bold" : "text-red-400 font-bold"}>{u.readiness}%</span>
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-current rounded-full" style={{width: `${u.readiness}%`, color: u.readiness > 80 ? '#34d399' : u.readiness > 50 ? '#fbbf24' : '#f87171'}}></div></div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-xs text-red-400 hover:text-red-300 font-medium">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVerifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Manual Verification Queue</h3>
        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">{verifications.length} Pending</span>
      </div>
      
      {verifications.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">Queue Empty</h3>
          <p className="text-gray-400">All student documents have been verified by AI or Administrators.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {verifications.map((v) => (
              <motion.div key={v.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card p-6 flex flex-col justify-between border-t-4 border-t-purple-500">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-purple-400"/></div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${v.risk === 'High' ? 'bg-red-500/20 text-red-400' : v.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'}`}>Risk: {v.risk}</span>
                  </div>
                  <h4 className="text-white font-bold mb-1">{v.type}</h4>
                  <p className="text-sm text-gray-400 mb-4">Submitted by <span className="text-gray-300 font-medium">{v.student}</span></p>
                  <p className="text-xs text-gray-500 mb-6 flex items-center gap-1"><Clock className="w-3 h-3"/> {v.date}</p>
                </div>
                
                <div className="flex gap-3">
                  <button onClick={() => handleVerify(v.id, 'reject')} className="flex-1 py-2 bg-white/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"><XCircle className="w-4 h-4"/> Reject</button>
                  <button onClick={() => handleVerify(v.id, 'approve')} className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4"/> Approve</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );

  const renderConfig = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-card p-8 border-l-4 border-l-red-500">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Database className="w-6 h-6 text-red-400"/> Algorithm Weights Engine</h3>
        <p className="text-sm text-gray-400 mb-8">Adjust the global weights used by the AI to calculate the overall Placement Readiness Score across the platform.</p>
        
        <div className="space-y-8">
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-300 font-medium">Certifications Impact (ATS)</span><span className="text-red-400 font-bold">{atsWeight}%</span></div>
            <input type="range" min="0" max="100" value={atsWeight} onChange={(e) => setAtsWeight(parseInt(e.target.value))} className="w-full accent-red-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-300 font-medium">Internship Impact</span><span className="text-orange-400 font-bold">{internWeight}%</span></div>
            <input type="range" min="0" max="100" value={internWeight} onChange={(e) => setInternWeight(parseInt(e.target.value))} className="w-full accent-orange-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-300 font-medium">AI Tool Productivity Index</span><span className="text-purple-400 font-bold">{aiWeight}%</span></div>
            <input type="range" min="0" max="100" value={aiWeight} onChange={(e) => setAiWeight(parseInt(e.target.value))} className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
          </div>
          
          <div className="pt-6 border-t border-white/10">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">Warning: Changing these parameters will immediately trigger a recalculation of all 1,248 student profiles. This process may take up to 2 minutes.</p>
            </div>
            <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]">Apply New Global Weights</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <div className="border-b border-white/5 bg-[#111] px-8 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-display font-bold text-white flex items-center gap-3"
          >
            <ShieldCheck className="w-8 h-8 text-red-500" /> Secure Admin Zone
          </motion.h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 mr-4 border-r border-white/10 pr-4">Admin: System Root</span>
            <button onClick={logout} className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-bold rounded-lg transition-colors">
              Terminate Session
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto w-full p-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 space-y-2 flex-shrink-0">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'overview' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <Activity className="w-5 h-5"/> Platform Overview
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'users' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <Users className="w-5 h-5"/> User Directory
          </button>
          <button onClick={() => setActiveTab('verifications')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'verifications' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5"/> Verifications</div>
            {verifications.length > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{verifications.length}</span>}
          </button>
          <button onClick={() => setActiveTab('config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'config' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <Settings className="w-5 h-5"/> Algorithm Config
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'verifications' && renderVerifications()}
              {activeTab === 'config' && renderConfig()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
