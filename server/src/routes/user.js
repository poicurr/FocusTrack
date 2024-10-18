// routes/auth.js
const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

// タスク取得API
router.get('/tasks/:taskId', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const taskData = await Task.findById(taskId);
    if (!taskData) return res.status(404).json({message: "task not found"});
    res.status(200).json(taskData);
  } catch(error) {
    res.status(500).json({ message: 'サーバーエラーが発生しました', error });
  }
});

// タスクリスト取得API
router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    // 認証されたユーザーのIDを取得
    const userId = req.user.id;
    
    // 該当ユーザーのタスクリストを取得
    const tasks = await Task.find({ userId });

    // タスクリストを返す
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// タスクを登録
router.post('/tasks', authenticateToken, async (req, res) => {
  try {
    // リクエストボディからタスク情報を取得
    const { title, description, priority, tags, deadline, status } = req.body;

    // 認証されたユーザーIDを取得
    const userId = req.user.id;

    // 新しいタスクを作成
    const newTask = new Task({
      userId,               // 認証されたユーザーIDをセット
      title,                // タスクタイトル
      description,          // タスクの詳細
      priority,             // 優先度
      tags,                 // タグ
      deadline,             // 締切日時
      status,               // ステータス
    });

    // データベースにタスクを保存
    await newTask.save();

    console.log("taskを登録中...");
    console.dir(newTask);

    // 保存完了後、成功メッセージを返す
    res.status(201).json({ message: 'タスクが正常に作成されました', task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// タスクを更新
router.put('/tasks/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params; // URLからtaskIdを取得
    const updatedTaskData = req.body; // リクエストのボディから更新データを取得

    console.log("taskを更新中...");
    console.dir(updatedTaskData);

    // 該当するタスクを更新
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updatedTaskData }, // 更新データを設定
      { new: true, runValidators: true } // 更新後のデータを返すオプションとバリデーション
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'タスクが見つかりませんでした' });
    }

    res.status(200).json(updatedTask); // 更新されたタスクをレスポンスとして返す
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;
