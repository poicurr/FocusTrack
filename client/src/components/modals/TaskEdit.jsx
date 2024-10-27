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
  const [tags, setTags] = useState(''); // 保存時にクライアント側では文字列として扱う
  const [deadline, setDeadline] = useState(null);
  const [status, setStatus] = useState('pending');

  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  // タスクIDが存在する場合、タスク情報を取得
  useEffect(() => {
    if (!taskId) return;
    axios.get(`http://localhost:5000/api/user/tasks/${taskId}`, {
      withCredentials: true, // クッキーを含めるために必要
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

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (!title || !deadline) return;
    
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
        withCredentials: true, // クッキーを含めるために必要
      }).catch(error => {
        console.error('タスクの更新に失敗しました', error);
        if (error.status === 401 || error.status === 403) {
          navigate("/login");
        }
      });
    } else {
      // タスク登録
      axios.post(`http://localhost:5000/api/user/tasks`, taskData, {
        withCredentials: true, // クッキーを含めるために必要
      }).catch(error => {
        console.error('タスクの登録に失敗しました', error);
        if (error.status === 401 || error.status === 403) {
          navigate("/login");
        }
      });
    }
    onSubmit();
  };

  const handleDelete = (ev) => {
    ev.preventDefault();
    if (!taskId) return;
    axios.delete(`http://localhost:5000/api/user/tasks/${taskId}`, {
      withCredentials: true, // クッキーを含めるために必要
    }).catch(error => {
      console.error('タスクの削除に失敗しました', error);
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    });
    onSubmit();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {taskId ? 'Edit Task' : 'Register Task'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          id="description"
          label="description"
          name="description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">status</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            name="status"
            value={status}
            label="status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="pending">pending</MenuItem>
            <MenuItem value="in-progress">in-progress</MenuItem>
            <MenuItem value="completed">completed</MenuItem>
            <MenuItem value="cancelled">cancelled</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          id="tags"
          label="tags"
          name="tags"
          placeholder="Enter comma-separated"
          value={tags}
          onChange={(e) => {setTags(e.target.value)}}
        />
        <DatePicker
          fullWidth
          label="deadline"
          id="deadline"
          name="deadline"
          value={deadline}
          onChange={(newValue) => setDeadline(newValue)}
          slotProps={{ textField: { variant: 'outlined' } }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="priority-label">priority</InputLabel>
          <Select
            labelId="priority-label"
            id="priority"
            name="priority"
            value={priority}
            label="priority"
            onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value="low">low</MenuItem>
            <MenuItem value="medium">medium</MenuItem>
            <MenuItem value="high">high</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 1 }}
          onSubmit={handleSubmit}
          disabled={!isFormValid}
        >
          {taskId ? 'update' : 'register'}
        </Button>
        {taskId &&
          <Button
            fullWidth
            variant="contained"
            color="error"
            sx={{ mt: 1, mb: 1 }}
            onClick={handleDelete}
          >
            {'delete'}
          </Button>
        }
      </Box>
    </LocalizationProvider>
  );
}

export default TaskEdit;
