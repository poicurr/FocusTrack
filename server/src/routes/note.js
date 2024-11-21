// routes/auth.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const Note = require('../models/Note');

// メモ取得API
router.get('/note', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const note = await Note.findOne({ userId });
    if (!note) return res.status(404).json({ message: "note not found" });
    res.status(200).json(note.note); // メモの内容のみを返す
  } catch(error) {
    res.status(500).json({ message: 'メモの取得に失敗しました', error });
  }
});

// メモを登録または更新
router.post('/note', authenticateToken, async (req, res) => {
  try {
    const { note } = req.body;
    const userId = req.user.id;

    // 既存メモの更新または新規作成
    const updatedNote = await Note.findOneAndUpdate(
      { userId },
      { note },
      { new: true, upsert: true } // upsert: trueで存在しない場合は作成
    );

    res.status(201).json({ message: 'メモが保存されました', note: updatedNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'メモの保存に失敗しました', error });
  }
});

module.exports = router;
