const Student = require('../models/Student');
const Company = require('../models/Company');

// ML Engine Simulation Controller
exports.getStudentReadiness = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    const student = await Student.findById(studentId).populate('certifications');
    
    // In a real scenario, this would call an external Python ML API or use TensorFlow.js
    // For this demonstration, we calculate a weighted score based on rules
    
    let technicalScore = student.scores.technical || 0;
    let communicationScore = student.scores.communication || 0;
    let aiToolScore = student.aiTools.length * 10; // dummy logic
    let certificationScore = student.certifications.filter(c => c.isVerified).length * 15;
    
    let overallReadiness = (technicalScore * 0.4) + (communicationScore * 0.2) + (aiToolScore * 0.2) + (certificationScore * 0.2);
    
    res.json({
      success: true,
      data: {
        overallReadiness: Math.min(overallReadiness, 100),
        technicalScore,
        communicationScore,
        industryReadiness: Math.min((aiToolScore + certificationScore), 100),
        breakdown: {
          programming: 85,
          aptitude: 70,
          communication: communicationScore,
          aiKnowledge: aiToolScore
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompanyPredictions = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    const student = await Student.findById(studentId);
    const companies = await Company.find();
    
    // Engine analyzes student skills against each company's open roles
    const predictions = companies.map(company => {
      // Simulate compatibility matching algorithm
      const matchPercentage = Math.floor(Math.random() * (98 - 40 + 1) + 40); 
      return {
        companyName: company.name,
        companyType: company.type,
        matchPercentage,
        targetRole: company.openRoles[0]?.title || 'Software Engineer',
        skillGap: matchPercentage < 75 ? ['AWS', 'System Design'] : []
      };
    });
    
    res.json({ success: true, data: predictions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
