// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

const authenticateToken = require('../middleware/authenticateToken');

// JWTアクセストークン生成関数
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m', // accessトークンの有効期限
  });
};

// JWTリフレッシュトークン生成関数
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFLESH, {
    expiresIn: '7d', // refreshトークンの有効期限
  });
};

// ユーザー登録API
router.post('/signup', async (req, res) => {
  const { displayName, email, password } = req.body;

  try {
    // 既に登録されているか確認
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 新規ユーザー作成
    const user = new User({ displayName, email, password });
    await user.save();

    // JWTトークンを生成
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // アクセストークンをHTTP-only Cookieに保存
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // TODO: リリース時にtrue
      sameSite: 'Strict', // CSRF対策
      maxAge: 15 * 60 * 1000 // 15m
    });

    // リフレッシュトークンをHTTP-only Coockieに保存
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // TODO: リリース時にtrue
      sameSite: 'Strict', // CSRF対策
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
    });

    // 作成したユーザーを返却
    res.status(201).json({
      _id: user._id,
      displayName: user.displayName,
      password: user.password,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ログインAPI
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // ユーザーが存在するか確認
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // パスワードが正しいか確認
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // JWTトークンを生成
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // アクセストークンをHTTP-only Cookieに保存
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, // TODO: リリース時にtrue
      sameSite: 'Strict', // CSRF対策
      maxAge: 15 * 60 * 1000 // 15m
    });

    // リフレッシュトークンをHTTP-only Coockieに保存する
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // TODO: リリース時にtrue
      sameSite: 'Strict', // CSRF対策
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
    });

    // 認証されたユーザーを返却
    res.json({
      _id: user._id,
      email: user.email
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ログアウト処理
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
});

// 認証チェック処理
router.get('/check-auth', authenticateToken, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
