import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Rocket, Target, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (role === 'student') navigate('/dashboard');
    else if (role === 'faculty') navigate('/faculty-dashboard');
    else if (role === 'admin') navigate('/admin-dashboard');
    else navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white overflow-hidden relative font-sans select-none">
      
      {/* Cinematic Background Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" 
      />

      {/* Floating Ambient Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-pulse-slow z-0" />

      {/* Navbar Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#060608]/40 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-400 via-indigo-500 to-purple-500 p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <div className="w-full h-full rounded-[10px] bg-[#0d0d12] flex items-center justify-center">
                <BrainCircuit className="text-teal-400 w-5.5 h-5.5" />
              </div>
            </div>
            <span className="font-display font-black text-xl tracking-tight text-gradient">PlacementAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">Intelligence</a>
            <Link to="/faculty-login" className="hover:text-white transition-colors">Faculty Portal</Link>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button 
                onClick={handleDashboardRedirect} 
                className="text-xs font-bold bg-white hover:bg-gray-100 text-black px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-[1.02] cursor-pointer"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="text-xs font-bold text-gray-300 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="text-xs font-bold bg-gradient-to-r from-teal-400 to-teal-500 text-black px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/5 border border-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-wider mb-8"
        >
          <Sparkles className="w-4.5 h-4.5 text-teal-400 animate-spin-slow" />
          <span>Futuristic Career Intelligence Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-5.5xl md:text-7xl font-display font-black tracking-tight mb-8 leading-none"
        >
          Predict Your Placement.<br />
          <span className="text-gradient">Design Your Technical Career.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base md:text-lg text-gray-400 max-w-2xl mb-10 font-medium leading-relaxed"
        >
          Dynamic matching calculations, verified certification mapping, and OCR-powered ATS scoring. Perfect intelligence alignment for major corporate entities.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center gap-4.5 w-full justify-center"
        >
          {isAuthenticated ? (
            <button 
              onClick={handleDashboardRedirect} 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 text-black font-extrabold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:scale-[1.02] transition-all cursor-pointer border border-teal-300/30"
            >
              Continue to Dashboard <ArrowRight className="w-4.5 h-4.5" />
            </button>
          ) : (
            <>
              <Link 
                to="/signup" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 text-black font-extrabold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:scale-[1.02] transition-all cursor-pointer border border-teal-300/30"
              >
                Start Free Analysis <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/20 font-bold flex items-center justify-center transition-all hover:scale-[1.02]"
              >
                Access Portal
              </Link>
            </>
          )}
        </motion.div>

        {/* Cinematic Dashboard Showcase Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="w-full max-w-5xl mt-24 relative rounded-2xl border border-white/[0.06] bg-[#0d0d12]/50 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-transparent z-10 rounded-2xl" />
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
            alt="Intelligence Panel Preview" 
            className="rounded-xl border border-white/[0.05] shadow-2xl opacity-40 grayscale hover:grayscale-0 transition-all duration-700 pointer-events-none"
          />
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10 border-t border-white/[0.03] bg-[#0a0a0f]/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3.5xl font-display font-extrabold tracking-tight">Enterprise Placement Architecture</h2>
            <p className="text-gray-400 text-sm font-medium">Sophisticated tools engineered for active campus shortlists.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Company Alignments", desc: "Live mapping algorithms aligning your track scores to core vacancy requirements." },
              { icon: ShieldCheck, title: "OCR Credential Verification", desc: "OCR computer vision verification scanning and certifying technical achievements." },
              { icon: Zap, title: "Real-Time Skill Gap Scanning", desc: "Instantly discover what tools and levels you need to unlock to match dream positions." }
            ].map((f, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                key={f.title} 
                className="glass-card p-8 bg-card/25 border border-white/[0.06] hover:border-teal-500/20 group transition-all duration-300 hover:shadow-[0_10px_30px_rgba(45,212,191,0.06)]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6 group-hover:bg-teal-500/5 group-hover:border-teal-500/25 transition-all duration-300">
                  <f.icon className="w-5.5 h-5.5 text-teal-400" />
                </div>
                <h3 className="text-lg font-bold mb-3 tracking-tight">{f.title}</h3>
                <p className="text-gray-400 text-xs font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
