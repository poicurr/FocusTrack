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

const addChildTask = async (req, res) => {
  const { taskId } = req.params;
  const { childTask } = req.body;

  console.log(`parentId: ${taskId}`);
  console.dir(childTask);

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "親タスクが見つかりません。" });

    task.children.push(childTask);  // 子タスクを追加
    await task.save();

    res.status(200).json(task.children.pop()); // 末尾の子タスクを返す
  } catch (error) {
    res.status(500).json({ error: "子タスクの追加に失敗しました。" });
  }
};

const updateChildTask = async (req, res) => {
  const { taskId, childTaskId } = req.params;
  const { title, completed } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "親タスクが見つかりません。" });

    const child = task.children.id(childTaskId);  // MongoDBの _idを使って子タスクを取得
    if (!child) return res.status(404).json({ error: "子タスクが見つかりません。" });

    if (title !== undefined) child.title = title;
    if (completed !== undefined) child.completed = completed;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "子タスクの更新に失敗しました。" });
  }
};

const deleteChildTask = async (req, res) => {
  const { taskId, childTaskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "親タスクが見つかりません。" });

    task.children.id(childTaskId).remove();  // _idを使って子タスクを削除
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "子タスクの削除に失敗しました。" });
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  addChildTask,
  updateChildTask,
  deleteChildTask,
};
