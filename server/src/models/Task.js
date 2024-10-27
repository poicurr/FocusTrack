const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({

  // タスク作成者のユーザーID
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },

  // タスクのタイトル
  title: { 
    type: String, 
    required: true
  },

  // タスクの詳細説明
  description: { 
    type: String
  },

  // タスクの優先度 (low, medium, high)
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },

  // タグの配列
  tags: [String],

  // タスクの締切日
  deadline: { 
    type: Date,
    required: true
  },

  // タスクの状態 (pending, in-progress, completed, cancelled)
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
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

taskSchema.index({ deadline: 1, priority:1 });

module.exports = mongoose.model('Task', taskSchema);
