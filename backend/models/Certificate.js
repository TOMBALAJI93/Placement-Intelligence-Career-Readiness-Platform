const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true },
  organization: { type: String, required: true },
  credentialId: String,
  issueDate: Date,
  
  // File details
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'image'] },
  
  // Verification details
  ocrExtractedText: String,
  qualityScore: { type: Number, default: 0 }, // Assigned by AI based on org weight
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin ID
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
