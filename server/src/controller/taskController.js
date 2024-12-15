// controllers/taskController.js
const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    // リクエストボディからタスク情報を取得
    const { title, description, priority, tags, deadline, status, children } = req.body;

    // 認証されたユーザーIDを取得
    const userId = req.user.id;

    // カンマ区切り文字列を配列に変換する
    const newtags = tags.split(',').map(tag => tag.trim());

    // 新しいタスクを作成
    const newTask = new Task({
      userId,               // 認証されたユーザーIDをセット
      title,                // タスクタイトル
      description,          // タスクの詳細
      priority,             // 優先度
      tags: newtags,        // タグ <--- ここだけ特別な処理になっている
      deadline,             // 締切日時
      status,               // ステータス
      children,
    });

    // データベースにタスクを保存
    await newTask.save();

    // 保存完了後、成功メッセージを返す
    res.status(201).json({ message: 'タスクが登録されました', task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'タスクの登録に失敗しました', error });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params; // URLからtaskIdを取得
    const updatedTaskData = req.body; // リクエストのボディから更新データを取得

    // カンマ区切り文字列を配列に変換する <--- ここだけ特別な処理になっている
    if (typeof updatedTaskData.tags === 'string')
      updatedTaskData.tags = updatedTaskData.tags.split(',').map(tag => tag.trim());

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
    res.status(500).json({ messsage: 'タスクの更新に失敗しました', error });
  }
}

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    await Task.findByIdAndDelete(taskId);
    res.sendStatus(204); // 成功時には 204 No Content を返すことが一般的
  } catch (error) {
    res.status(500).json({ message: 'タスクの削除に失敗しました', error });
  }
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
};
