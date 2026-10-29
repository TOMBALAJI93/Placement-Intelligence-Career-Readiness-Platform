import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCircle, 
  FileBadge, 
  Briefcase, 
  BrainCircuit, 
  TrendingUp, 
  Target, 
  FileSpreadsheet,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileSpreadsheet, label: 'CSV Data Studio', path: '/csv-upload' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: FileBadge, label: 'Certifications', path: '/certifications' },
  { icon: Briefcase, label: 'Internships', path: '/internships' },
  { icon: BrainCircuit, label: 'AI Tools', path: '/ai-tools' },
  { icon: TrendingUp, label: 'Placement Readiness', path: '/readiness' },
  { icon: Target, label: 'Role Analyzer', path: '/role-analyzer' },
];

export function Sidebar() {
  const { logout, role } = useAuth();
  
  const items = role === 'faculty' 
    ? [{ icon: GraduationCap, label: 'Faculty Dashboard', path: '/faculty-dashboard' }]
    : navItems;

  return (
    <aside className="w-72 hidden md:flex flex-col h-screen fixed top-0 left-0 bg-[#0d0d12]/75 backdrop-blur-2xl border-r border-white/[0.05] z-40">
      
      {/* Branding */}
      <div className="p-6 flex items-center gap-3.5 border-b border-white/[0.04]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 via-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.25)] relative group-hover:scale-105 transition-all">
          <div className="absolute inset-0.5 rounded-[10px] bg-[#0d0d12] flex items-center justify-center">
            <BrainCircuit className="text-teal-400 w-5 h-5" />
          </div>
        </div>
        <div>
          <h1 className="font-display font-bold text-xl tracking-tight text-gradient">PlacementAI</h1>
          <p className="text-[10px] uppercase tracking-widest text-teal-400/70 font-semibold font-mono">v1.2 SaaS Engine</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3.5 px-4.5 py-3 rounded-xl transition-all duration-300 group relative text-sm font-medium",
              isActive 
                ? "text-teal-400 bg-white/[0.02] border border-white/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.2)]" 
                : "text-gray-400 hover:text-gray-100 hover:bg-white/[0.02] border border-transparent"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-teal-400 to-indigo-500 rounded-r-full"
                  />
                )}
                <item.icon className={cn("w-4.5 h-4.5 transition-colors duration-300", isActive ? "text-teal-400" : "text-gray-450 group-hover:text-gray-200")} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout / Bottom */}
      <div className="p-4 mt-auto border-t border-white/[0.04] bg-[#0a0a0f]/40">
        <button 
          onClick={logout} 
          className="flex items-center gap-3.5 px-4.5 py-3 w-full rounded-xl text-gray-450 hover:text-red-400 hover:bg-red-500/[0.06] border border-transparent hover:border-red-500/10 transition-all duration-350 text-sm font-medium"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Logout Portal</span>
        </button>
      </div>
    </aside>
  );
}
