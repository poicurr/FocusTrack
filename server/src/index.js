const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const settingsRoutes = require('./routes/settings');
const noteRoutes = require('./routes/note');
require('dotenv').config();

const app = express();

// 静的ファイルを提供する設定
app.use('/public', express.static(__dirname + '/../public'));

// CORS設定を追加
app.use(cors({
  origin: 'http://localhost:3000', // クライアントのオリジンを指定
  credentials: true,               // クレデンシャルを許可
}));
app.use(cookieParser());
app.use(express.json());

// MongoDBに接続
console.log(`connecting database: ${process.env.MONGO_URI}`)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.log(`failed to connect db: ${err}`);
  return;
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error(err.stack);  // エラーをログに記録
  res.status(500).json({ error: 'Something went wrong!' });  // エラーレスポンスを返す
});

// 認証ルート
app.use('/api/auth', authRoutes);

// タスク情報API
app.use('/api/tasks', taskRoutes);

// 設定情報API
app.use('/api/settings', settingsRoutes);

// メモ保存用API
app.use('/api/note', noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
