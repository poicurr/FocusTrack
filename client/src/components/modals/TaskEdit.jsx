import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ja } from 'date-fns/locale';

import axios from 'axios';

const TaskEdit = (props) => {
  const { taskId, onSubmit } = props;

  // Task情報
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [status, setStatus] = useState('pending');

  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  // タスクIDが存在する場合、タスク情報を取得
  useEffect(() => {
    if (!taskId) return;
    axios.get(`http://localhost:5000/api/user/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => {
      const taskData = res.data;
      setTitle(taskData.title);
      setDescription(taskData.description);
      setPriority(taskData.priority);
      setTags(taskData.tags);
      setDeadline(new Date(taskData.deadline));
      setStatus(taskData.status);
    }).catch(error => {
      console.error('タスクの取得に失敗しました', error);
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    });
  }, [taskId]);

  useEffect(() => {
    setIsFormValid(!!title && !!deadline);
  }, [title, deadline]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !deadline) {
      return;
    }

    const taskData = {
      title,
      description,
      priority,
      tags,
      deadline,
      status,
    };

    if (taskId) {
      // タスク更新
      axios.put(`http://localhost:5000/api/user/tasks/${taskId}`, taskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).catch(error => {
        console.error('タスクの更新に失敗しました', error);
        if (error.status === 401 || error.status === 403) {
          navigate("/login");
        }
      });
    } else {
      // タスク登録
      axios.post(`http://localhost:5000/api/user/tasks`, taskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).catch(error => {
        console.error('タスクの登録に失敗しました', error);
        if (error.status === 401 || error.status === 403) {
          navigate("/login");
        }
      });
    }
    
    onSubmit();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {taskId ? 'タスク編集' : 'タスク登録'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="タイトル"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="説明文"
          name="description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">ステータス</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            name="status"
            value={status}
            label="ステータス"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="pending">保留中</MenuItem>
            <MenuItem value="in-progress">進行中</MenuItem>
            <MenuItem value="completed">完了</MenuItem>
            <MenuItem value="cancelled">キャンセル</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          id="tags"
          label="タグ"
          name="tags"
          placeholder="カンマ区切りで入力"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <DatePicker
          fullWidth
          label="締切日"
          id="deadline"
          name="deadline"
          value={deadline}
          onChange={(newValue) => setDeadline(newValue)}
          slotProps={{ textField: { variant: 'outlined' } }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="priority-label">優先度</InputLabel>
          <Select
            labelId="priority-label"
            id="priority"
            name="priority"
            value={priority}
            label="優先度"
            onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value="low">低</MenuItem>
            <MenuItem value="medium">中</MenuItem>
            <MenuItem value="high">高</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onSubmit={handleSubmit}
          disabled={!isFormValid}
        >
          {taskId ? '更新' : '登録'}
        </Button>
      </Box>
    </LocalizationProvider>
  );
}

export default TaskEdit;
