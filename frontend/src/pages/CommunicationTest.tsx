import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, ShieldCheck, Activity, BrainCircuit, Play, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const QUESTIONS = [
  "Tell me about yourself and your background.",
  "Why should we hire you for a software engineering role?",
  "Describe a time when you overcame a significant challenge.",
  "Where do you see yourself in 5 years?"
];

export function CommunicationTest() {
  const [step, setStep] = useState<'permission' | 'test' | 'analytics'>('permission');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  
  // Test State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  
  // Simulated Meters
  const [fluency, setFluency] = useState(85);
  const [confidence, setConfidence] = useState(90);
  const [eyeContact, setEyeContact] = useState(95);
  const [micActivity, setMicActivity] = useState(10);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const requestPermissions = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setStep('test');
    } catch (err) {
      console.error(err);
      setError('Camera and Microphone permissions are required to start the test.');
    }
  };

  // Attach stream to video element
  useEffect(() => {
    if (step === 'test' && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [step, stream]);

  // Simulate Mic Activity and Timers
  useEffect(() => {
    let interval: any;
    if (step === 'test' && isRecording) {
      interval = setInterval(() => {
        setMicActivity(Math.floor(Math.random() * 60) + 20);
        setFluency(prev => Math.min(100, Math.max(70, prev + (Math.random() > 0.5 ? 2 : -2))));
        setConfidence(prev => Math.min(100, Math.max(60, prev + (Math.random() > 0.5 ? 1 : -1))));
        setEyeContact(prev => Math.min(100, Math.max(50, prev + (Math.random() > 0.3 ? 5 : -10))));
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleNextQuestion();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setMicActivity(10);
    }
    return () => clearInterval(interval);
  }, [step, isRecording, currentQuestionIdx]);

  const handleNextQuestion = () => {
    setIsRecording(false);
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setTimeLeft(60);
    } else {
      // End of test
      finishTest();
    }
  };

  const finishTest = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStep('analytics');
  };

  // Render Permission State
  if (step === 'permission') {
    return (
      <div className="min-h-screen pt-20 pb-12 px-6 flex flex-col items-center justify-center relative">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 max-w-lg w-full text-center relative z-10"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-teal-500 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-teal-500/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Hardware Access Required</h2>
          <p className="text-gray-400 mb-8">
            To provide accurate AI analysis of your communication skills, we need temporary access to your camera and microphone. Your data is processed locally and never stored.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm mb-6 text-left">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2">
              <Camera className="w-6 h-6 text-teal-400" />
              <span className="text-sm text-gray-300 font-medium">Webcam</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2">
              <Mic className="w-6 h-6 text-indigo-400" />
              <span className="text-sm text-gray-300 font-medium">Microphone</span>
            </div>
          </div>

          <button 
            onClick={requestPermissions}
            className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]"
          >
            Allow Access & Continue
          </button>
        </motion.div>
      </div>
    );
  }

  // Render Analytics State
  if (step === 'analytics') {
    return (
      <div className="min-h-screen pt-12 pb-12 px-6 max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(45,212,191,0.4)]"
          >
            <CheckCircle2 className="w-12 h-12 text-black" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold text-white mb-4"
          >
            Test Complete
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Our AI has analyzed your performance. Here's your communication breakdown.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 border-t-4 border-t-teal-500 text-center">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Overall Score</h3>
            <p className="text-4xl font-bold text-white">88<span className="text-lg text-gray-500">/100</span></p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 border-t-4 border-t-indigo-500 text-center">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Confidence Level</h3>
            <p className="text-4xl font-bold text-white">92<span className="text-lg text-gray-500">%</span></p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 border-t-4 border-t-emerald-500 text-center">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Eye Contact</h3>
            <p className="text-4xl font-bold text-white">85<span className="text-lg text-gray-500">%</span></p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 border-t-4 border-t-orange-500 text-center">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Filler Words</h3>
            <p className="text-4xl font-bold text-white">12<span className="text-lg text-gray-500"> words</span></p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-teal-400" /> AI Improvement Suggestions
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-1">1</div>
              <div>
                <h4 className="text-white font-medium mb-1">Excellent Speaking Pace</h4>
                <p className="text-gray-400 text-sm">Your speech rate was optimal at 135 words per minute. This keeps the listener engaged without sounding rushed.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-1">2</div>
              <div>
                <h4 className="text-white font-medium mb-1">Reduce 'Um' and 'Like'</h4>
                <p className="text-gray-400 text-sm">You used filler words 12 times during the 4-minute session. Try taking a silent pause instead to project more confidence.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-1">3</div>
              <div>
                <h4 className="text-white font-medium mb-1">Strong Body Language</h4>
                <p className="text-gray-400 text-sm">Your posture and hand gestures were well-measured. You maintained good eye contact 85% of the time.</p>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>
    );
  }

  // Render Test State
  return (
    <div className="h-[calc(100vh-5rem)] p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Left Panel: Camera & Controls */}
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <div className="glass-card p-1 flex-1 relative overflow-hidden rounded-2xl border-white/10 group">
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline
            className="w-full h-full object-cover rounded-xl"
            style={{ transform: 'scaleX(-1)' }}
          />
          
          {/* AI Overlay UI */}
          <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-500'}`} />
                  {isRecording && <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />}
                </div>
                <span className="text-white font-medium text-sm">
                  {isRecording ? 'Recording...' : 'Waiting to start'}
                </span>
              </div>
              
              {isRecording && (
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-teal-500/30 text-teal-400 font-mono text-xl font-bold">
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
              )}
            </div>

            {/* Simulated Tracking Box */}
            <div className="w-48 h-48 border border-teal-500/30 rounded-3xl self-center mb-10 relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-400 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-teal-400 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-teal-400 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-400 rounded-br-xl" />
              
              <div className="absolute -right-24 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur text-xs px-2 py-1 rounded text-teal-300 border border-teal-500/20">
                Face Detected
              </div>
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex-1 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10 relative overflow-hidden">
              <Mic className="w-5 h-5 text-indigo-400 z-10" />
              <div 
                className="absolute bottom-0 left-0 w-full bg-indigo-500/30 transition-all duration-100 ease-out" 
                style={{ height: `${micActivity}%` }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Microphone Array</p>
              <p className="text-xs text-gray-400">{isRecording ? 'Capturing audio...' : 'Ready'}</p>
            </div>
          </div>

          <div className="flex gap-4">
            {!isRecording ? (
              <button 
                onClick={() => setIsRecording(true)}
                className="bg-teal-500 hover:bg-teal-400 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)]"
              >
                <Play className="w-5 h-5 fill-black" /> Start Answering
              </button>
            ) : (
              <button 
                onClick={handleNextQuestion}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border border-white/10"
              >
                Next Question <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Questions & Metrics */}
      <div className="space-y-6 flex flex-col h-full">
        {/* Question Card */}
        <div className="glass-card p-8 border-t-4 border-t-indigo-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400">
              Question {currentQuestionIdx + 1} of {QUESTIONS.length}
            </span>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold text-white leading-snug">
            {QUESTIONS[currentQuestionIdx]}
          </h2>
        </div>

        {/* Live Metrics Panel */}
        <div className="glass-card p-6 flex-1 flex flex-col">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" /> Live AI Analysis
          </h3>
          
          <div className="space-y-8 flex-1">
            {/* Confidence Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Confidence Match</span>
                <span className="text-teal-400 font-mono font-medium">{confidence}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" 
                  animate={{ width: `${confidence}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                />
              </div>
            </div>

            {/* Fluency Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Speech Fluency</span>
                <span className="text-indigo-400 font-mono font-medium">{fluency}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-400" 
                  animate={{ width: `${fluency}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                />
              </div>
            </div>

            {/* Eye Contact Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Eye Contact</span>
                <span className="text-purple-400 font-mono font-medium">{eyeContact}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                  animate={{ width: `${eyeContact}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                />
              </div>
            </div>

            {/* Speaking Pace Box */}
            <div className="mt-auto bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-teal-500/30 border-t-teal-400 animate-spin flex items-center justify-center shrink-0">
              </div>
              <div className="absolute ml-3 text-xs font-bold text-teal-400">135</div>
              <div>
                <p className="text-sm font-medium text-white">Speaking Pace</p>
                <p className="text-xs text-gray-400">Words per minute (Optimal)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
