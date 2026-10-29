import { useState, useRef, useEffect } from 'react';
import { Bell, Search, UserCircle, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, role, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSubtext = () => {
    if (role === 'admin') return 'System Administrator';
    if (role === 'faculty') return `HOD - ${user?.department || 'Department'}`;
    return user?.department || 'Student';
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  return (
    <header className="h-20 w-full bg-[#060608]/40 backdrop-blur-xl border-b border-white/[0.04] sticky top-0 z-30 flex items-center justify-between px-6 md:px-8">
      
      {/* Search Input Block */}
      <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-xl px-4.5 py-2.5 w-80 md:w-96 focus-within:border-teal-500/30 focus-within:ring-2 focus-within:ring-teal-500/10 focus-within:bg-[#060608]/60 transition-all duration-300">
        <Search className="w-4 h-4 text-gray-400 mr-2.5" />
        <input 
          type="text" 
          placeholder="Quick search (e.g. Amazon, Python)..." 
          className="bg-transparent border-none outline-none text-sm w-full text-gray-250 placeholder:text-gray-500 font-medium"
        />
      </div>

      <div className="flex items-center gap-5.5">
        
        {/* Notifications Icon Button */}
        <button className="relative p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-all duration-300 group hover:scale-[1.03]">
          <Bell className="w-4.5 h-4.5 text-gray-300 group-hover:text-teal-400 transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-tr from-teal-400 to-emerald-400 rounded-full ring-2 ring-[#060608]"></span>
        </button>
        
        {/* Profile Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3.5 pl-5 border-l border-white/[0.08] hover:opacity-95 transition-opacity focus:outline-none cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-200 tracking-tight leading-none mb-1">{user?.name || 'Guest User'}</p>
              <p className="text-[10px] text-teal-400/90 font-bold font-mono tracking-wider leading-none uppercase">{getSubtext()}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 via-indigo-500 to-purple-500 p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all duration-300">
              <div className="w-full h-full rounded-[10px] bg-[#0d0d12] overflow-hidden flex items-center justify-center font-bold text-white text-sm font-display uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </button>

          {/* Animated Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-3.5 w-60 rounded-2xl bg-[#0d0d12]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_10px_50px_rgba(0,0,0,0.5)] py-2.5 z-50 overflow-hidden"
              >
                <div className="px-4.5 py-3 border-b border-white/[0.05] sm:hidden">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{getSubtext()}</p>
                </div>
                
                <div className="py-1">
                  <button 
                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-3 px-4.5 py-2.5 text-sm text-gray-300 hover:bg-white/[0.03] hover:text-white transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-teal-450" />
                    <span>View Profile</span>
                  </button>
                  <button 
                    onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-3 px-4.5 py-2.5 text-sm text-gray-300 hover:bg-white/[0.03] hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4 text-indigo-405" />
                    <span>Settings</span>
                  </button>
                </div>
                
                <div className="py-1 border-t border-white/[0.05] mt-1.5 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4.5 py-2.5 text-sm text-red-400 hover:bg-red-500/[0.06] hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout Portal</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
