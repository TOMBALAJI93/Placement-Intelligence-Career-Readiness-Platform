const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  cgpa: { type: Number, required: true },
  
  // External Profiles
  githubUrl: String,
  linkedinUrl: String,
  leetcodeRating: Number,
  hackerrankScore: Number,
  
  // Skills
  technicalSkills: [{
    name: String,
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] }
  }],
  aiTools: [{
    name: String,
    category: String,
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] }
  }],
  
  // Experience
  internships: [{
    company: String,
    role: String,
    durationInMonths: Number,
    relevanceScore: Number, // AI computed
    verified: { type: Boolean, default: false }
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    githubLink: String
  }],
  certifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }],
  
  // Evaluation Scores
  scores: {
    technical: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    aptitude: { type: Number, default: 0 },
    overallReadiness: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
