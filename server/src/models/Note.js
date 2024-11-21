const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  note: {
    type: String,
    default: ''
  }

});

module.exports = mongoose.model('Note', noteSchema);
