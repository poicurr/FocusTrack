const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  // ユーザー名
  displayName: { 
    type: String, 
    required: true 
  },

  // ユーザーのメールアドレス
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  // パスワードのハッシュ
  password: { 
    type: String, 
    required: true 
  },

  // アバター画像のURL
  avatar: { 
    type: String 
  },

  // アカウント作成日
  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  // アカウント最終更新日
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

// パスワードを保存前にハッシュ化する
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// パスワードの比較メソッド
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
