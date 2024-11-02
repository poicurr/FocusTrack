// routes/auth.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const Memo = require('../models/Memo');

// メモ取得API
router.get('/memo', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const memo = await Memo.findOne({ userId });
    if (!memo) return res.status(404).json({ message: "memo not found" });
    res.status(200).json(memo.memo); // メモの内容のみを返す
  } catch(error) {
    res.status(500).json({ message: 'メモの取得に失敗しました', error });
  }
});

// メモを登録または更新
router.post('/memo', authenticateToken, async (req, res) => {
  try {
    const { memo } = req.body;
    const userId = req.user.id;

    // 既存メモの更新または新規作成
    const updatedMemo = await Memo.findOneAndUpdate(
      { userId },
      { memo },
      { new: true, upsert: true } // upsert: trueで存在しない場合は作成
    );

    res.status(201).json({ message: 'メモが保存されました', memo: updatedMemo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'メモの保存に失敗しました', error });
  }
});

module.exports = router;
