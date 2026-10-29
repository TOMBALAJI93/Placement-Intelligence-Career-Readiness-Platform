import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
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
          id: email, // Since admin logs in via email field
          password: password,
          role: 'admin'
        }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.data.user as any, data.data.token);
        navigate('/admin-dashboard');
      } else {
        setError(data.message || 'Invalid admin email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Cannot connect to server. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden p-6">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/10 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 mb-8 w-max mx-auto group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-500 to-orange-400 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl text-white">System Admin</span>
        </Link>

        <div className="glass-card p-8 md:p-10 border-t-4 border-t-red-500">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Secure Access</h1>
            <p className="text-sm text-gray-400">Restricted zone. Admins only.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Admin ID</label>
              <input 
                type="text" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin_system" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Admin Password</label>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
              ) : (
                <>Secure Login <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
