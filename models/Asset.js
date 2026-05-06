const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  purchasePrice: { type: Number, required: true },
  vendor: String,
  purchaseDate: Date,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
