const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['MNC', 'Startup', 'Product', 'Service'], required: true },
  location: String,
  
  openRoles: [{
    title: String,
    expectedSalaryRange: String,
    requiredSkills: [{ name: String, importance: Number }], // Importance from 1-10
    requiredAptitudeLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
    minCgpa: Number,
    preferredCertifications: [String]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
