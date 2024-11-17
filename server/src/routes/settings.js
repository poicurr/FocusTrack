// routes/auth.js
const express = require('express');
const User = require('../models/User');
const Settings = require('../models/Settings');
const multer = require("multer");
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const fs = require("fs");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// エンドポイント設定
router.post("/upload", upload.single("avatar"), (req, res) => {
  const { avatar, displayName } = req.body;
  if (!avatar || !displayName) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  // Base64データの検証と変換
  const matches = avatar.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({ message: "Invalid Base64 data" });
  }
  
  const mimeType = matches[1];
  const base64Data = matches[2];
  const fileExtension = mimeType.split("/")[1]; // 例: image/png -> png
  
  // ファイル保存
  const fileName = `${Date.now()}-avatar.${fileExtension}`;
  const filePath = path.join(__dirname, "uploads", fileName);

  // ファイルデータを保存
  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ message: "Failed to save file" });
    }

    console.log(`File saved: ${filePath}`);
    res.status(200).json({
      message: "Upload successful",
      displayName: displayName,
      fileName: fileName,
      filePath: filePath,
    });
  });
});

/*
// Settings情報取得API
router.post('/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const settings = await Settings.findById(userId);

    if (!user || !settings) {
      res.status(404).json({ message: 'failed to load resources', error });
    }

    const data = req.body;

    user.avatar = data.avatar;
    user.displayName = data.displayName;
    console.log(`email: ${user.email}`);
    console.log(`avatar: ${data.avatar}`);
    console.log(`displayName: ${data.displayName}`);
    user.save();

    settings.theme = theme;
    settings.workTime = workTime;
    settings.shortBreakTime = shortBreakTime;
    settings.longBreakTime = longBreakTime;
    settings.notificationEnabled = notificationEnabled;
    settings.save();

    res.status(200).json({
      avatar,
      displayName,
      theme,
      workTime,
      shortBreakTime,
      longBreakTime,
      notificationEnabled,
    });

  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました', error });
  }
});
*/

module.exports = router;
