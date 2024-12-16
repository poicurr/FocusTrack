// routes/auth.js
const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {
  createTask,
  updateTask,
  deleteTask,
} = require('../controller/taskController')
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// すべての親タスクを取得
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({
      userId: userId,
      status: { $in: ["pending", "in-progress"] },
    })
      .sort({deadline: 'asc', priority:'desc'});
    // タスクリストを返す
    res.status(200).json(tasks ? tasks : []);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました', error });
  }
});

// アーカイブタスク一覧取得
router.get('/archive', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({
      userId: userId,
      status: { $in: ["cancelled", "completed"] },
    })
      .sort({deadline: 'desc', priority:'desc'});
    // タスクリストを返す
    res.status(200).json(tasks ? tasks : []);
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました', error });
  }
});

// 特定の親タスクを取得
router.get('/:taskId', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const taskData = await Task.findById(taskId);
    if (!taskData) return res.status(404).json({ message: "task not found" });
    res.status(200).json(taskData);
  } catch(error) {
    res.status(500).json({ message: 'タスクの取得に失敗しました', error });
  }
});

// 新しい親タスクを作成
router.post('/', authenticateToken, async (req, res) => {
  createTask(req, res);
});

// 特定の親タスクを更新
router.patch('/:taskId', authenticateToken, async (req, res) => {
  updateTask(req, res);
});

// 特定の親タスクを削除
router.delete('/:taskId', authenticateToken, async (req, res) => {
  deleteTask(req, res);
});

module.exports = router;
