import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Search, Briefcase, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

const companies = [
  { id: 1, name: 'Zoho', type: 'Product', location: 'Chennai', match: 88, role: 'MTS', img: 'Z' },
  { id: 2, name: 'TCS Digital', type: 'Service', location: 'Pan India', match: 93, role: 'System Engineer', img: 'T' },
  { id: 3, name: 'Amazon', type: 'MNC', location: 'Bangalore', match: 42, role: 'SDE-1', img: 'A' },
  { id: 4, name: 'Freshworks', type: 'Product', location: 'Chennai', match: 78, role: 'Frontend Developer', img: 'F' },
  { id: 5, name: 'Microsoft', type: 'MNC', location: 'Hyderabad', match: 61, role: 'Software Engineer', img: 'M' },
];

const roles = [
  { name: 'Full Stack Developer', match: 85, missing: ['Docker', 'AWS'], salary: '8-12 LPA' },
  { name: 'Frontend Developer', match: 92, missing: ['Figma to Code'], salary: '6-10 LPA' },
  { name: 'Backend Developer', match: 70, missing: ['System Design', 'Go'], salary: '8-15 LPA' },
  { name: 'AI/ML Engineer', match: 65, missing: ['PyTorch', 'Deep Learning'], salary: '10-18 LPA' },
];

export function CompanyPrediction() {
  const [activeTab, setActiveTab] = useState<'companies' | 'roles'>('companies');

  return (
    <div className="space-y-8 pb-12">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-display font-bold text-white mb-2"
        >
          Career Path Analyzer
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 max-w-2xl"
        >
          AI-driven analysis of your skills mapped against top companies and roles. See exactly where you stand and what you need to improve.
        </motion.p>
      </div>

      <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl w-max">
        <button 
          onClick={() => setActiveTab('companies')}
          className={cn(
            "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
            activeTab === 'companies' ? "bg-teal-500 text-black shadow-lg shadow-teal-500/20" : "text-gray-400 hover:text-white"
          )}
        >
          <Building2 className="w-4 h-4" /> Company Eligibility
        </button>
        <button 
          onClick={() => setActiveTab('roles')}
          className={cn(
            "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
            activeTab === 'roles' ? "bg-teal-500 text-black shadow-lg shadow-teal-500/20" : "text-gray-400 hover:text-white"
          )}
        >
          <Briefcase className="w-4 h-4" /> Role Suitability
        </button>
      </div>

      {activeTab === 'companies' ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {companies.map((company, i) => (
            <div key={company.id} className="glass-card p-6 flex flex-col hover:border-teal-500/30 transition-colors group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {company.img}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">{company.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <span className="bg-white/10 px-2 py-0.5 rounded-md">{company.type}</span>
                      <span>•</span>
                      <span>{company.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-white">
                    <span className={cn(
                      company.match >= 80 ? "text-emerald-400" :
                      company.match >= 60 ? "text-yellow-400" : "text-red-400"
                    )}>{company.match}%</span>
                  </div>
                  <p className="text-xs text-gray-500">Placement Chance</p>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-sm text-gray-300 flex justify-between">
                    <span>Target Role:</span> 
                    <span className="font-medium text-teal-400">{company.role}</span>
                  </p>
                </div>

                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full",
                      company.match >= 80 ? "bg-emerald-400" :
                      company.match >= 60 ? "bg-yellow-400" : "bg-red-400"
                    )} 
                    style={{ width: `${company.match}%` }}
                  ></div>
                </div>

                {company.match < 70 && (
                  <div className="flex items-start gap-2 mt-2 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-xs text-red-200">Improve your DSA and System Design skills to increase your chances for Amazon.</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {roles.map((role, i) => (
            <div key={i} className="glass-card p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{role.name}</h3>
                  <p className="text-sm text-gray-400">Expected Salary: <span className="text-teal-400 font-medium">{role.salary}</span></p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-gray-800 flex items-center justify-center relative">
                  <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
                    <circle
                      cx="28"
                      cy="28"
                      r="26"
                      stroke={role.match >= 80 ? "#34d399" : "#fbbf24"}
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray="163"
                      strokeDashoffset={163 - (163 * role.match) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="text-sm font-bold text-white">{role.match}%</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Skill Gap Analysis</h4>
                {role.match >= 80 ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20">
                    <CheckCircle2 className="w-5 h-5" />
                    You are highly suitable for this role!
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 mb-2">You are missing these skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {role.missing.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors">
                View Roadmap <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
