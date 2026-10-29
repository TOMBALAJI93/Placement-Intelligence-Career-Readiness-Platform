import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#060608] text-foreground flex relative overflow-hidden font-sans select-none">
      
      {/* 1. Cinematic Background Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_60%,transparent_100%)] pointer-events-none z-0" 
      />

      {/* 2. Floating Ambient Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none z-0" />

      {/* 3. Dynamic Mouse Tracking Spotlight Glow */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-500 ease-out"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 212, 191, 0.05) 0%, rgba(99, 102, 241, 0.01) 40%, transparent 70%)`
        }}
      />

      {/* 4. Subtle Noise Overlay for Texture Depth */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay z-10 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')]" />

      <Sidebar />
      
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen relative z-20">
        <Header />
        
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

