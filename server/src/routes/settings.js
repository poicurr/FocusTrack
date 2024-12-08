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
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor,
      notificationsEnabled: settings.notificationsEnabled,
    };
    res.status(200).json(settingsData);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました', error });
  }
});

// アバター画像登録API
router.post("/upload/avatar", authenticateToken, upload.single("avatar"), async (req, res) => {
  const {
    avatar,
  } = req.body;

  // 認証されたユーザーIDを取得
  const userId = req.user.id;

  let updatedUser = {};

  // avatarの処理（Base64データの検証と変換）
  const matches = avatar.match(/^data:(.+);base64,(.+)$/);
  if (!matches) return res.status(400).json({ message: "Failed to save file" });
    
  const mimeType = matches[1];
  const base64Data = matches[2];
  const fileExtension = mimeType.split("/")[1]; // 例: image/png -> png

  // ファイル保存
  const fileName = `${Date.now()}-avatar.${fileExtension}`;
  const filePath = path.join("public", "uploads", "avatar", fileName);

  // ファイルデータを保存
  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ message: "Failed to save file" });
    }
  });

  // 古い画像データを削除
  const user = await User.findById(userId);
  const oldfile = user.avatar;
  try {
    if (oldfile) fs.unlinkSync(oldfile);
  } catch(e) {
    console.log(`failed to delete file: ${e}`);
  }

  // ユーザー情報更新
  updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        avatar: filePath
      }
    },
    { new: true, upsert: true, runValidators: true } // 更新後のデータを返すオプションとバリデーション
  );

  if (!updatedUser) {
    return res.status(404).json({ message: 'ユーザーが見つかりませんでした' });
  }

  res.status(200).json(updatedUser);
});

// DisplayName
router.post("/upload/displayName", authenticateToken, async (req, res) => {
  const {
    displayName,
  } = req.body;

  if (!displayName) return; // displayName is required

  // 認証されたユーザーIDを取得
  const userId = req.user.id;
  updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        displayName: displayName
      }
    },
    { new: true, upsert: true, runValidators: true } // 更新後のデータを返すオプションとバリデーション
  );

  if (!updatedUser) {
    return res.status(404).json({ message: 'ユーザーが見つかりませんでした' });
  }
  res.status(200).json(updatedUser);
});

// PrimaryColor
router.post("/upload/primaryColor", authenticateToken, async (req, res) => {
  const {
    primaryColor,
  } = req.body;

  // 認証されたユーザーIDを取得
  const userId = req.user.id;
  // 既存Settings情報の更新または新規作成
  const updatedSettings = await Settings.findOneAndUpdate(
    { userId },
    {
      primaryColor: primaryColor,
    },
    { new: true, upsert: true } // upsert: trueで存在しない場合は作成
  );

  res.status(200).json(updatedSettings);
});

// SecondaryColor
router.post("/upload/secondaryColor", authenticateToken, async (req, res) => {
  const {
    secondaryColor,
  } = req.body;

  // 認証されたユーザーIDを取得
  const userId = req.user.id;
  // 既存Settings情報の更新または新規作成
  const updatedSettings = await Settings.findOneAndUpdate(
    { userId },
    {
      secondaryColor: secondaryColor,
    },
    { new: true, upsert: true } // upsert: trueで存在しない場合は作成
  );

  res.status(200).json(updatedSettings);
});

// WorkTime
router.post("/upload/workTime", authenticateToken, async (req, res) => {
  const {
    workTime,
  } = req.body;

  // 認証されたユーザーIDを取得
  const userId = req.user.id;
  // 既存Settings情報の更新または新規作成
  const updatedSettings = await Settings.findOneAndUpdate(
    { userId },
    {
      workTime: workTime,
    },
    { new: true, upsert: true } // upsert: trueで存在しない場合は作成
  );

  res.status(200).json(updatedSettings);
});

// ShortBreakTime
router.post("/upload/shortBreakTime", authenticateToken, async (req, res) => {
  const {
    shortBreakTime,
  } = req.body;

  // 認証されたユーザーIDを取得
  const userId = req.user.id;
  // 既存Settings情報の更新または新規作成
  const updatedSettings = await Settings.findOneAndUpdate(
    { userId },
    {
      shortBreakTime: shortBreakTime,
    },
    { new: true, upsert: true } // upsert: trueで存在しない場合は作成
  );

  res.status(200).json(updatedSettings);
});

// LongBreakTime
router.post("/upload/longBreakTime", authenticateToken, async (req, res) => {
  const {
    longBreakTime,
  } = req.body;

  // 認証されたユーザーIDを取得
  const userId = req.user.id;
  // 既存Settings情報の更新または新規作成
  const updatedSettings = await Settings.findOneAndUpdate(
    { userId },
    {
      longBreakTime: longBreakTime,
    },
    { new: true, upsert: true } // upsert: trueで存在しない場合は作成
  );

  res.status(200).json(updatedSettings);
});

// notificationsEnabled
router.post("/upload/notificationsEnabled", authenticateToken, async (req, res) => {
  const {
    notificationsEnabled,
  } = req.body;

  // 認証されたユーザーIDを取得
  const userId = req.user.id;
  // 既存Settings情報の更新または新規作成
  const updatedSettings = await Settings.findOneAndUpdate(
    { userId },
    {
      notificationsEnabled: notificationsEnabled,
    },
    { new: true, upsert: true } // upsert: trueで存在しない場合は作成
  );

  res.status(200).json(updatedSettings);
});

// theme
router.post("/upload/theme", authenticateToken, async (req, res) => {
  const {
    theme,
  } = req.body;

  // 認証されたユーザーIDを取得
  const userId = req.user.id;
  // 既存Settings情報の更新または新規作成
  const updatedSettings = await Settings.findOneAndUpdate(
    { userId },
    {
      theme: theme,
    },
    { new: true, upsert: true } // upsert: trueで存在しない場合は作成
  );

  res.status(200).json(updatedSettings);
});

module.exports = router;
