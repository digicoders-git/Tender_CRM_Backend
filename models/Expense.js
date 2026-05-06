const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: ['Labour', 'Material', 'Transport', 'Equipment', 'Utilities', 'Permits', 'Miscellaneous'], default: 'Miscellaneous' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  date: { type: Date, default: Date.now },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
