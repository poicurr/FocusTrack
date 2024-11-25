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

// Settings画面データ取得
router.get("/fetch", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    const settings = await Settings.findOneAndUpdate(
      { userId: userId },
      {},
      { new: true, upsert: true }
    );

    const settingsData = {
      avatar: user.avatar,
      displayName: user.displayName,
      theme: settings.theme,
      workTime: settings.workTime,
      shortBreakTime: settings.shortBreakTime,
      longBreakTime: settings.longBreakTime,
      notificationsEnabled: settings.notificationsEnabled,
    };
    res.status(200).json(settingsData);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました', error });
  }
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

  // 認証されたユーザーIDを取得
  const userId = req.user.id;

  let updatedUser = {};

  // avatarの処理（Base64データの検証と変換）
  const matches = avatar.match(/^data:(.+);base64,(.+)$/);
  if (matches) {
    // 画像データつきのリクエスト
    
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

    // ユーザー情報更新
    updatedUser = await User.findByIdAndUpdate(
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
  } else {
    // 画像データなしのリクエスト

    // ユーザー情報更新
    updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: {
            displayName: displayName
        }
        },
        { new: true, runValidators: true } // 更新後のデータを返すオプションとバリデーション
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'ユーザーが見つかりませんでした' });
    }
  }

  // 既存Settings情報の更新または新規作成
  const updatedSettings = await Settings.findOneAndUpdate(
    { userId },
    {
      workTime: workTime,
      shortBreakTime: shortBreakTime,
      longBreakTime: longBreakTime,
      notificationsEnabled: notificationsEnabled,
      theme: theme,
    },
    { new: true, upsert: true } // upsert: trueで存在しない場合は作成
  );

  res.status(200).json(updatedSettings);
});

module.exports = router;
