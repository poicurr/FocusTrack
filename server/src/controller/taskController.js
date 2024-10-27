// controllers/taskController.js
const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description, status, tags, priority, deadline } = req.body;

    // タグをカンマ区切りで分割し、配列として保存
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const newTask = new Task({
      title,
      description,
      status,
      tags: tagArray,  // ここで配列として設定
      priority,
      deadline,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'タスクの保存中にエラーが発生しました。' });
  }
};

module.exports = { createTask };
