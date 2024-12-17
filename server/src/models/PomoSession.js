const mongoose = require('mongoose');

const pomoSessionSchema = new mongoose.Schema({
  
  // 親タスクのID
  taskId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task', 
    required: true 
  },
  
  // ユーザーID
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // 開始時刻
  startTime: {
    type: Date,
    required: true
  },
  
  // 終了時刻
  endTime: {
    type: Date,
    required: true
  },
  
  // 継続時間（分）
  duration: {
    type: Number,
    required: true
  },

  // 5段階評価
  rating: {
    type: Number,
    min: 1, max: 5
  },

  // タスク作成日
  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  // タスク最終更新日
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const PomoSession = mongoose.model('PomoSession', pomoSessionSchema);
module.exports = PomoSession;
