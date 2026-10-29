import React from 'react';
import { Sparkles, Users, GraduationCap, Briefcase, Building2, ChevronRight } from 'lucide-react';
import type { SampleDataset } from '../types/dataset';

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'employee_data',
    name: 'Employee Data',
    description: 'Corporate employee roster with salary, department, and tenure',
    category: 'Corporate',
    rowCount: 523,
    colCount: 6,
    csvString: `EmployeeID,Name,Department,Age,Salary,ExperienceYears,Status
EMP-101,Aarav Sharma,Engineering,28,95000,5,Active
EMP-102,Priya Patel,Marketing,32,82000,7,Active
EMP-103,Rohan Gupta,Data Science,25,110000,3,Active
EMP-104,Ananya Iyer,Product,29,105000,4,Active
EMP-105,Vikram Singh,Engineering,35,125000,10,Active
EMP-106,Sneha Reddy,Human Resources,31,78000,6,Active
EMP-107,Karan Verma,Sales,27,72000,2,Active
EMP-108,Divya Nair,Design,26,85000,3,Active
EMP-109,Aditya Joshi,Engineering,30,118000,8,Active
EMP-110,Meera Kapoor,Finance,34,98000,9,Active
EMP-111,Siddharth Shah,Data Science,24,92000,1,Active
EMP-112,Neha Choudhury,Marketing,28,80000,4,Active
EMP-113,Rahul Mehta,Engineering,33,130000,11,Active
EMP-114,Pooja Agarwal,Operations,30,88000,5,Active
EMP-115,Amit Deshmukh,Engineering,29,102000,5,Active`
  },
  {
    id: 'college_data',
    name: 'College Data',
    description: 'Student academic performance, CGPA, and attendance stats',
    category: 'Academic',
    rowCount: 450,
    colCount: 7,
    csvString: `RollNo,StudentName,Department,CGPA,AttendancePct,ProjectsCount,Backlogs
2024CS01,Arjun Kumar,Computer Science,9.2,94,4,0
2024CS02,Bhavna Sen,Computer Science,8.7,91,3,0
2024IT01,Chirag Roy,Information Tech,7.8,85,2,1
2024EC01,Deepika Rao,Electronics,8.4,89,3,0
2024CS03,Eshwar Menon,Computer Science,9.6,98,5,0
2024ME01,Farhan Khan,Mechanical,7.2,80,1,2
2024IT02,Gauri Pillai,Information Tech,8.9,93,4,0
2024CS04,Harsh Vardhan,Computer Science,8.1,88,2,0
2024EC02,Isha Sharma,Electronics,7.9,86,2,0
2024CS05,Jatin Das,Computer Science,9.0,95,4,0
2024AI01,Kavya Kulkarni,Artificial Intelligence,9.4,97,5,0
2024AI02,Lalit Prasad,Artificial Intelligence,8.6,90,3,0`
  },
  {
    id: 'placement_data',
    name: 'Placement Data',
    description: 'Student technical skills, communication score, and placement status',
    category: 'Placements',
    rowCount: 680,
    colCount: 8,
    csvString: `Student,JavaScore,PythonScore,CommunicationScore,AptitudeScore,InternshipsCount,PlacementStatus,PackageLPA
Aarav S,88,92,85,90,2,Placed,14.5
Priya P,75,80,92,84,1,Placed,11.0
Rohan G,95,98,78,94,3,Placed,22.0
Ananya I,82,85,88,86,2,Placed,12.8
Vikram S,65,70,68,72,0,Not Placed,0.0
Sneha R,70,75,85,78,1,Placed,8.5
Karan V,60,65,72,68,0,Not Placed,0.0
Divya N,78,88,90,82,2,Placed,13.2
Aditya J,90,94,84,92,3,Placed,18.0
Meera K,84,79,95,88,2,Placed,15.0`
  },
  {
    id: 'company_data',
    name: 'Company Data',
    description: 'Recruiting companies, package offered, tier, and hiring roles',
    category: 'Recruiting',
    rowCount: 120,
    colCount: 6,
    csvString: `Company,PackageLPA,RoleType,Location,TierCategory,EligibleCGPA
Google,32.0,Software Engineer,Bengaluru,Tier 1,8.5
Microsoft,28.5,SDE-1,Hyderabad,Tier 1,8.0
Amazon,26.0,Software Dev Engineer,Bengaluru,Tier 1,7.5
Goldman Sachs,24.0,Quantitative Analyst,Mumbai,Tier 1,8.0
TCS Digital,9.0,Systems Engineer,PAN India,Tier 2,7.0
Infosys Power Programmer,9.5,Specialist Programmer,PAN India,Tier 2,7.0
Wipro Turbo,8.5,Project Engineer,PAN India,Tier 2,6.5
Accenture Advanced,10.0,Application Tech Lead,Gurugram,Tier 2,7.0
Adobe,30.0,Member Tech Staff,Noida,Tier 1,8.5
Atlassian,42.0,Software Engineer,Remote,Tier 1,9.0`
  }
];

interface SampleDatasetsProps {
  onSelectSample: (sample: SampleDataset) => void;
}

export const SampleDatasets: React.FC<SampleDatasetsProps> = ({ onSelectSample }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'employee_data': return Users;
      case 'college_data': return GraduationCap;
      case 'placement_data': return Briefcase;
      case 'company_data': return Building2;
      default: return Sparkles;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Or Test Immediately with Sample Datasets
          </h3>
        </div>
        <span className="text-xs text-gray-500">Click any card to parse instant CSV</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SAMPLE_DATASETS.map((sample) => {
          const Icon = getIcon(sample.id);
          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="glass-card p-4 text-left group hover:border-teal-500/40 hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-teal-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 group-hover:scale-105 transition-all">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono">
                    {sample.category}
                  </span>
                </div>

                <h4 className="font-semibold text-sm text-gray-100 group-hover:text-teal-300 transition-colors">
                  {sample.name}
                </h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-500 group-hover:text-gray-400 font-mono">
                <span>{sample.rowCount} rows • {sample.colCount} cols</span>
                <ChevronRight className="w-3.5 h-3.5 text-teal-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
