import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: registerNumber,
          password: password,
          role: 'student'
        }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.user as any, data.data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection failure. Verify database state & try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center relative overflow-hidden p-6 font-sans select-none">
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-0" 
      />

      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="flex items-center gap-2.5 mb-8 w-max mx-auto group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 via-indigo-500 to-purple-500 p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.25)] group-hover:scale-[1.03] transition-all duration-300">
            <div className="w-full h-full rounded-[10px] bg-[#0d0d12] flex items-center justify-center">
              <BrainCircuit className="text-teal-400 w-5.5 h-5.5" />
            </div>
          </div>
          <span className="font-display font-black text-xl text-white tracking-tight">PlacementAI</span>
        </Link>

        <div className="bg-[#0d0d12]/60 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-8 md:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.8)] hover:border-white/[0.12] transition-colors">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-white mb-1.5 tracking-tight flex items-center justify-center gap-1.5">
              Welcome back
            </h1>
            <p className="text-xs text-gray-500 font-semibold tracking-wide">ENTER YOUR SECURE ACCESS REGISTER</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs font-semibold text-red-400/90 leading-relaxed">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">Register Number</label>
              <input 
                type="text" 
                required
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                placeholder="e.g. 24111001" 
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-teal-500/30 focus:ring-2 focus:ring-teal-500/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-gray-650 focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">Secret Key</label>
                <Link to="#" className="text-xs font-bold text-teal-400 hover:text-teal-300">Forgot key?</Link>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-teal-500/30 focus:ring-2 focus:ring-teal-500/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-gray-650 focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="rounded border-white/[0.08] bg-white/[0.03] text-teal-550 focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer" 
              />
              <label htmlFor="remember" className="text-xs text-gray-400 font-medium cursor-pointer">Remember credential block</label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 text-black font-extrabold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.25)] hover:shadow-[0_0_30px_rgba(45,212,191,0.45)] flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed mt-6 border border-teal-300/20 cursor-pointer hover:scale-[1.02]"
            >
              {isLoading ? (
                <><Loader2 className="w-4.5 h-4.5 animate-spin" /> Authenticating...</>
              ) : (
                <>Access Engine <ArrowRight className="w-4.5 h-4.5" /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8 font-semibold">
            Need an entry node? <Link to="/signup" className="text-teal-400 hover:text-teal-300 ml-1.5 uppercase font-bold tracking-wider font-mono">Sign up</Link>
          </p>
          
          <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-white/[0.06] text-[10px] font-bold uppercase tracking-wider font-mono text-gray-500">
             <Link to="/faculty-login" className="hover:text-white transition-colors">Faculty</Link>
             <span>•</span>
             <Link to="/admin-login" className="hover:text-white transition-colors">Admin Node</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
