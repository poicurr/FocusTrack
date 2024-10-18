const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// タグスキーマ定義
const tagSchema = new Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('Tag', tagSchema);
