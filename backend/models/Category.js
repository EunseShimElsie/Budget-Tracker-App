const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['income', 'expense'], required: true }, // 카테고리가 소득용인지 지출용인지 구분
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
