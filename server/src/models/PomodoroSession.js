const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pomodoroSessionSchema = new Schema({
    task: { type: Schema.Types.ObjectId, ref: 'Task' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isBreak: { type: Boolean, default: false },
    duration: { type: Number, required: true } // minutes
  });
  
  module.exports = mongoose.model('PomodoroSession', pomodoroSessionSchema);
