const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: String,
  tenderCost: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Active', 'Won', 'Lost', 'Cancelled'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Partial', 'Paid'], default: 'Unpaid' },
  amountPaid: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  completionDate: Date,
  description: String,
  documents: [{ name: String, uploadedAt: { type: Date, default: Date.now } }],
  notes: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
}, { timestamps: true });

module.exports = mongoose.model('Tender', tenderSchema);
