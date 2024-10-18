// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

// JWTトークン生成関数
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // トークンの有効期限
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
    const token = generateToken(user._id);

    // 作成したユーザーとトークンを返却
    res.status(201).json({
      _id: user._id,
      displayName: user.displayName,
      password: user.password,
      email: user.email,
      token,
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
    const token = generateToken(user._id);

    // トークンを返却
    res.json({
      _id: user._id,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
