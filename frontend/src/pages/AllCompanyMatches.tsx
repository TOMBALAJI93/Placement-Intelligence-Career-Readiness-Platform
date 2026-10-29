import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, Target, CheckCircle2, AlertCircle, Zap, Building, MapPin, Briefcase, Trophy, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

// Generate 150+ Companies
const COMPANY_NAMES = [
  "Amazon", "Microsoft", "Google", "Zoho", "Freshworks", "TCS", "Infosys", "Cognizant", "Wipro", "Accenture", 
  "Capgemini", "HCL", "Tech Mahindra", "LTIMindtree", "Hexaware", "CGI", "Virtusa", "Mphasis", "PayPal", "Visa", 
  "Mastercard", "Goldman Sachs", "Morgan Stanley", "JPMorgan", "Citibank", "Barclays", "Standard Chartered", "Fidelity", 
  "Tiger Analytics", "Soliton", "Presidio", "Ramco Systems", "Temenos", "ThoughtWorks", "Aspire Systems", "Photon", 
  "Symantec", "Cisco", "Intel", "AMD", "Qualcomm", "IBM", "Ford", "Bosch", "Siemens", "Samsung", "Nokia", "Ericsson", 
  "Adobe", "Salesforce", "Oracle", "SAP", "VMware", "Intuit", "ServiceNow", "Atlassian", "Snowflake", "Splunk", 
  "Databricks", "Palantir", "CrowdStrike", "Zscaler", "Fortinet", "Palo Alto Networks", "CyberArk", "McAfee", "Norton", 
  "FireEye", "Trend Micro", "Akamai", "Cloudflare", "Fastly", "DigitalOcean", "Heroku", "Netlify", "Vercel", "Stripe", 
  "Square", "Adyen", "Plaid", "Robinhood", "Coinbase", "Kraken", "Binance", "Shopify", "BigCommerce", "Magento", 
  "WooCommerce", "Wix", "Squarespace", "GoDaddy", "Mailchimp", "HubSpot", "Marketo", "Pardot", "Zendesk", "Intercom", 
  "Drift", "Slack", "Zoom", "Webex", "Asana", "Trello", "Monday.com", "Smartsheet", "Airtable", "Notion", "Coda", 
  "Evernote", "Dropbox", "Box", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence", "Jenkins", "CircleCI", "Docker", 
  "Kubernetes", "Terraform", "Ansible", "Datadog", "New Relic", "Dynatrace", "AppDynamics", "PagerDuty", "Sentry", 
  "Rollbar", "Bugsnag", "LogRocket", "FullStory", "Hotjar", "Mixpanel", "Amplitude", "Heap", "Segment", "Optimizely", 
  "LaunchDarkly", "Split"
];

const LOCATIONS = ['Chennai', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Coimbatore', 'Remote'];
const TYPES = ['Product', 'Service', 'Fintech', 'Startup', 'Core', 'Cybersecurity', 'Cloud'];
const DIFFICULTIES = ['Tier 1 (Very Hard)', 'Tier 2 (Hard)', 'Tier 3 (Moderate)', 'Tier 4 (Easy)'];
const DOMAINS = ['SaaS', 'E-Commerce', 'Finance', 'IT Services', 'Security', 'Cloud', 'Data Analytics', 'AI/ML'];
const COLORS = [
  'from-orange-400 via-amber-500 to-orange-650', 
  'from-blue-400 via-indigo-500 to-blue-650', 
  'from-green-400 via-emerald-500 to-green-650', 
  'from-indigo-400 via-purple-500 to-indigo-650', 
  'from-purple-400 via-fuchsia-500 to-purple-650', 
  'from-pink-400 via-rose-500 to-pink-650', 
  'from-red-400 via-orange-500 to-red-650', 
  'from-teal-400 via-cyan-500 to-teal-650'
];

// Seeded random generator for consistent mock data
const seededRandom = (seed: string) => {
  let h = 0;
  for(let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return () => {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
};

export interface CompanyCardData {
  id: string;
  name: string;
  logo: string;
  color: string;
  type: string;
  location: string;
  difficulty: string;
  domain: string;
  baseProbability: number;
  roles: string[];
  requiredSkills: string[];
}

const generateCompanies = (): CompanyCardData[] => {
  return COMPANY_NAMES.map(name => {
    const rng = seededRandom(name);
    const getRand = (arr: any[]) => arr[rng() % arr.length];
    
    let type = getRand(TYPES);
    let difficulty = getRand(DIFFICULTIES);
    let baseProbability = 40 + (rng() % 40); // 40 to 80
    let companyLocation = getRand(LOCATIONS);
    
    // Seed some static skills for matching
    let requiredSkills = ['Python', 'SQL', 'Git'];
    if (type === 'Product' || type === 'Fintech') {
      requiredSkills = ['Data Structures', 'Algorithms', 'System Design', 'SQL'];
    } else if (type === 'Service') {
      requiredSkills = ['HTML', 'CSS', 'JavaScript', 'SQL'];
    } else if (type === 'Cybersecurity') {
      requiredSkills = ['Linux', 'Network Security', 'Python'];
    } else if (type === 'Cloud') {
      requiredSkills = ['AWS', 'Docker', 'Kubernetes', 'CI/CD'];
    }

    if (['Amazon', 'Microsoft', 'Google', 'Adobe'].includes(name)) { 
      type = 'Product'; 
      difficulty = 'Tier 1 (Very Hard)'; 
      baseProbability = 50; 
    }
    if (['TCS', 'Infosys', 'Wipro', 'Accenture'].includes(name)) { 
      type = 'Service'; 
      difficulty = 'Tier 4 (Easy)'; 
      baseProbability = 85; 
    }
    if (['Zoho', 'Freshworks'].includes(name)) { 
      type = 'Product'; 
      difficulty = 'Tier 2 (Hard)'; 
      companyLocation = 'Chennai'; 
    }
    if (['Bosch', 'Cognizant', 'ThoughtWorks'].includes(name)) { 
      companyLocation = 'Coimbatore'; 
    }
    if (['PayPal', 'Visa', 'Goldman Sachs'].includes(name)) { 
      type = 'Fintech'; 
      difficulty = 'Tier 1 (Very Hard)'; 
    }

    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      logo: name.substring(0, 1).toUpperCase(),
      color: getRand(COLORS),
      type,
      location: companyLocation,
      difficulty,
      domain: getRand(DOMAINS),
      baseProbability,
      roles: ['Software Engineer', getRand(['Frontend Developer', 'Backend Developer', 'Cloud Engineer', 'Data Analyst', 'Security Analyst'])],
      requiredSkills
    };
  });
};

const ALL_COMPANIES = generateCompanies();

export function AllCompanyMatches() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');
  const [filterLoc, setFilterLoc] = useState('All');
  
  // User context
  const [userAi, setUserAi] = useState<any>(null);
  const [userCerts, setUserCerts] = useState<any[]>([]);
  const [userInts, setUserInts] = useState<any[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>(['HTML', 'CSS', 'Python']);
  const [dbmsMastery, setDbmsMastery] = useState<string>('Beginner');

  useEffect(() => {
    if (user?.id) {
      const savedAi = localStorage.getItem(`user_ai_stats_${user.id}`);
      if (savedAi) setUserAi(JSON.parse(savedAi));
      
      const savedCerts = localStorage.getItem(`user_certificates_${user.id}`);
      if (savedCerts) setUserCerts(JSON.parse(savedCerts));
      
      const savedInts = localStorage.getItem(`user_internships_${user.id}`);
      if (savedInts) setUserInts(JSON.parse(savedInts));
      
      // Load track data
      fetch(`http://localhost:5000/api/users/${user.id}`)
        .then(res => res.json())
        .then(resData => {
          if (resData.success && resData.data) {
            setDbmsMastery(resData.data.dbmsMastery || 'Beginner');
          }
        })
        .catch(err => console.error("Error fetching DBMS mastery in AllCompanyMatches:", err));

      let extracted = ['HTML', 'CSS', 'Python'];
      if (savedInts) {
        JSON.parse(savedInts).forEach((i: any) => { 
          if (i.technologies) extracted.push(...i.technologies); 
        });
      }
      setUserSkills(Array.from(new Set(extracted)));
    }
  }, [user?.id]);

  // Calculate dynamic personalized match
  const getPersonalizedMatch = (company: CompanyCardData) => {
    let match = company.baseProbability;
    
    // Apply user profile boosters
    if (userAi && userAi.overall > 60) match += 10;
    if (userCerts.length > 0) match += 5 * userCerts.length;
    if (userInts.length > 0) match += 10 * userInts.length;
    
    // Penalize Tier 1 if no internships
    if (company.difficulty.includes('Tier 1') && userInts.length === 0) match -= 20;

    // DBMS boost/penalty logic for SDE/SE roles
    const requiresDbms = company.requiredSkills.includes('SQL') || company.requiredSkills.includes('System Design');
    if (requiresDbms) {
      if (dbmsMastery === 'Advanced') match += 15;
      else if (dbmsMastery === 'Intermediate') match += 8;
      else match -= 12;
    }
    
    // Cap at 99
    return Math.min(99, Math.max(10, match));
  };

  const filteredCompanies = useMemo(() => {
    return ALL_COMPANIES.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'All' || c.type === filterType;
      const matchDiff = filterDiff === 'All' || c.difficulty === filterDiff;
      const matchLoc = filterLoc === 'All' || c.location === filterLoc;
      return matchSearch && matchType && matchDiff && matchLoc;
    }).sort((a, b) => getPersonalizedMatch(b) - getPersonalizedMatch(a));
  }, [search, filterType, filterDiff, filterLoc, userAi, userCerts, userInts, dbmsMastery]);

  const generateInsight = () => {
    if (userInts.length > 0 && userInts[0].technologies.some((t: string) => t.toLowerCase().includes('security'))) {
      return "Your cybersecurity internship strongly aligns with Security Analyst roles at Tier-1 MNCs.";
    }
    if (userAi && userAi.overall > 80) {
      return "Your advanced 'AI Power User' status increases product startup shortlisting by +22%.";
    }
    if (dbmsMastery === 'Advanced') {
      return "Your Advanced DBMS mastery unlocks SDE/Backend priority matching at major SaaS firms.";
    }
    if (userCerts.length === 0) {
      return "Acquiring a cloud certification (AWS/Azure) will boost your Tier-1 MNC matches by 15%.";
    }
    return "Complete more technical tracks to raise your matching index across product-based firms.";
  };

  return (
    <div className="space-y-8 pb-12 max-w-[1600px] mx-auto">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -15 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="text-4xl font-display font-extrabold text-white mb-2 tracking-tight"
          >
            Company Intelligence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -15 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.05 }} 
            className="text-gray-400 text-sm max-w-2xl font-medium"
          >
            Explore 150+ placement companies including global leaders, regional giants, and SaaS startups. Your placement probability updates in real-time as your portfolio changes.
          </motion.p>
        </div>
        
        {/* Top Intelligence Insight */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.1 }}
          className="glass-card p-4 border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-500/10 to-transparent flex items-center gap-4 max-w-md bg-[#13131a]/40 border border-white/[0.06] shadow-xl"
        >
          <Zap className="w-8 h-8 text-purple-400 flex-shrink-0 animate-pulse" />
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> AI Shortlist Predictor
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-medium mt-0.5">{generateInsight()}</p>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 sticky top-20 z-30 bg-[#060608]/75 backdrop-blur-xl border border-white/[0.06] shadow-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Filter by name, tags, stacks (e.g. Amazon, SaaS)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0d0d12] border border-white/[0.08] focus:border-indigo-500/30 focus:ring-2 focus:ring-indigo-500/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-500 font-medium focus:outline-none transition-all duration-300"
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-[#0d0d12] border border-white/[0.08] focus:border-indigo-500/30 rounded-xl px-4 py-3 text-xs font-semibold text-gray-300 focus:outline-none">
            <option value="All">All Types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          
          <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="bg-[#0d0d12] border border-white/[0.08] focus:border-indigo-500/30 rounded-xl px-4 py-3 text-xs font-semibold text-gray-300 focus:outline-none">
            <option value="All">All Difficulties</option>
            {DIFFICULTIES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          
          <select value={filterLoc} onChange={e => setFilterLoc(e.target.value)} className="bg-[#0d0d12] border border-white/[0.08] focus:border-indigo-500/30 rounded-xl px-4 py-3 text-xs font-semibold text-gray-300 focus:outline-none">
            <option value="All">All Locations</option>
            {LOCATIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5 tracking-tight">
            <Building className="w-5 h-5 text-indigo-400" /> 
            <span>{filteredCompanies.length} Matching Profiles</span>
          </h2>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider font-mono">Sorted by Relevance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredCompanies.map((company) => {
              const match = getPersonalizedMatch(company);
              
              // Calculate missing skills
              const missing = company.requiredSkills.filter(
                s => !userSkills.some(us => us.toLowerCase().includes(s.toLowerCase()))
              );

              return (
                <motion.div 
                  key={company.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/company/${company.id}`)}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="bg-[#13131a]/30 backdrop-blur-xl border border-white/[0.06] hover:border-indigo-500/30 p-5 rounded-2xl cursor-pointer group shadow-xl transition-all duration-300 hover:shadow-[0_15px_40px_rgba(99,102,241,0.12)] flex flex-col justify-between h-[310px] relative overflow-hidden scan-effect"
                >
                  {/* Subtle scanning light sweep overlay on card hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scan-effect pointer-events-none z-0" />

                  <div>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        {/* Styled company logo */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${company.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                          <span className="text-xl font-black text-white drop-shadow-md">{company.logo}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-base tracking-tight truncate max-w-[110px]">{company.name}</h3>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 font-mono">{company.type}</span>
                        </div>
                      </div>
                      
                      {/* Animated circular gauge match score */}
                      <div className="relative w-12 h-12 flex items-center justify-center select-none">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/[0.04]" />
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3.5" fill="transparent" 
                            strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * match) / 100} 
                            className={cn(
                              "transition-all duration-1000", 
                              match >= 85 ? "text-emerald-400" : match >= 60 ? "text-yellow-400" : "text-red-400"
                            )} 
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-white">{match}%</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 relative z-10">
                      <div className="flex items-center gap-2.5 text-xs text-gray-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" /> <span>{company.location}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-gray-400 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-gray-500" /> <span>{company.domain}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-gray-400 font-medium">
                        <Trophy className="w-3.5 h-3.5 text-yellow-500/70" /> <span>{company.difficulty.split(' ')[0]} Entry</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills / Missing Block */}
                  <div className="mt-4 pt-3.5 border-t border-white/[0.05] relative z-10 flex flex-col justify-end">
                    {missing.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-red-400/90 font-semibold mb-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[10px] uppercase font-mono tracking-wider">Gap: {missing.slice(0, 2).join(', ')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-400/95 font-semibold mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[10px] uppercase font-mono tracking-wider">Matched Stack</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {company.roles.slice(0, 2).map(r => (
                        <span key={r} className="bg-white/[0.02] border border-white/[0.06] px-2 py-0.5 rounded-md text-[9px] text-gray-300 font-medium">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredCompanies.length === 0 && (
          <div className="glass-card p-16 flex flex-col items-center justify-center text-center mt-8 bg-card/20 border border-white/[0.06]">
            <Search className="w-12 h-12 text-gray-600 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">No Companies Found</h3>
            <p className="text-sm text-gray-400">Adjust your searches or filters to scan other corporate entities.</p>
          </div>
        )}
      </div>
    </div>
  );
}
