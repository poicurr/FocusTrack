const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memoSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  memo: {
    type: String,
    default: ''
  }

});

module.exports = mongoose.model('Memo', memoSchema);
