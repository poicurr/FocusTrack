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
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "..", "uploads"); // サーバールートにuploads/ディレクトリを配置
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// エンドポイント設定
router.post("/upload", authenticateToken, upload.single("avatar"), async (req, res) => {
  const {
    avatar,
    displayName,
    workTime,
    shortBreakTime,
    longBreakTime,
    notificationsEnabled,
    theme
  } = req.body;

  // avatarの処理（Base64データの検証と変換）
  const matches = avatar.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({ message: "Invalid Base64 data" });
  }
  
  const mimeType = matches[1];
  const base64Data = matches[2];
  const fileExtension = mimeType.split("/")[1]; // 例: image/png -> png
  
  // ファイル保存
  const fileName = `${Date.now()}-avatar.${fileExtension}`;
  const filePath = path.join("public", "uploads", fileName);

  // ファイルデータを保存
  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ message: "Failed to save file" });
    }
  });

  // 認証されたユーザーIDを取得
  const userId = req.user.id;

  // ユーザー情報更新
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: {
        avatar: filePath,
        displayName: displayName
      }
    },
    { new: true, runValidators: true } // 更新後のデータを返すオプションとバリデーション
  );

  if (!updatedUser) {
    return res.status(404).json({ message: 'ユーザーが見つかりませんでした' });
  }

  // Settings情報更新
  const updatedSettings = await Settings.findByIdAndUpdate(
    userId,
    { $set: {
        workTime: workTime,
        shortBreakTime: shortBreakTime,
        longBreakTime: longBreakTime,
        notificationsEnabled: notificationsEnabled,
        theme: theme,
      }
    },
    { new: true, runValidators: true } // 更新後のデータを返すオプションとバリデーション
  );

  if (!updatedSettings) {
    const settings = new Settings({
      userId: userId,
      workTime: workTime,
      shortBreakTime: shortBreakTime,
      longBreakTime: longBreakTime,
      notificationsEnabled: notificationsEnabled,
      theme: theme,
    });
    settings.save();
  }

  res.status(200).json({
    avatar: avatar,
    displayName: displayName,
    workTime: workTime,
    shortBreakTime: shortBreakTime,
    longBreakTime: longBreakTime,
    notificationsEnabled: notificationsEnabled,
    theme: theme,
  });
});

module.exports = router;
