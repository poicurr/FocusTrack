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
  List,
  ListItem,
  Typography,
  IconButton,
  Paper
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { styled } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ja } from 'date-fns/locale';
import axios from 'axios';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

const StyledPaper = styled(Paper)({
  padding: '25px',
  maxWidth: '800px',
  margin: '0 auto',
});

function SortableItem({ id, task, toggleTaskCompletion, deleteTask }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      sx={{ display: 'flex', alignItems: 'center', py: 1 }}
    >
      <Box sx={{ mr: 1, cursor: 'move' }} {...listeners}>
        <DragIndicatorIcon />
      </Box>
      <Typography
        variant="body1"
        sx={{
          flexBasis: '30%',
          flexShrink: 0,
          textDecoration: task.completed ? 'line-through' : 'none'
        }}
      >
        {task.taskName}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          flexGrow: 1,
          textDecoration: task.completed ? 'line-through' : 'none'
        }}
      >
        {task.taskContent}
      </Typography>
      <IconButton
        onClick={(e) => toggleTaskCompletion(task._id ? task._id : task.id)}
        sx={{ ml: 1 }}
        aria-label={task.completed ? "タスクを未完了にする" : "タスクを完了にする"}
      >
        {task.completed
          ? <CheckCircleOutlineIcon color="primary" />
          : <RadioButtonUncheckedIcon />
        }
      </IconButton>
      <IconButton
        onClick={(e) => deleteTask(task._id ? task._id : task.id)}
        sx={{ ml: 1 }}
        aria-label="タスクを削除"
      >
        <DeleteOutlineIcon />
      </IconButton>
    </ListItem>
  );
}

const TaskEdit = (props) => {
  const { taskId, onSubmit } = props;

  // Task情報
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState(''); // 保存時にクライアント側では文字列として扱う
  const [deadline, setDeadline] = useState(null);
  const [status, setStatus] = useState('pending');
  const [children, setChildren] = useState([]);

  // 子タスク(というかほとんど単なるチェックリスト)
  const [taskName, setTaskName] = useState('');
  const [taskContent, setTaskContent] = useState('');
  const [nextId, setNextId] = useState(1);

  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  // タスクIDが存在する場合、タスク情報を取得
  useEffect(() => {
    if (!taskId) return;
    axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
      withCredentials: true, // クッキーを含めるために必要
    }).then(res => {
      const taskData = res.data;
      setTitle(taskData.title);
      setDescription(taskData.description);
      setPriority(taskData.priority);
      setTags(taskData.tags);
      setDeadline(new Date(taskData.deadline));
      setStatus(taskData.status);
      setChildren(taskData.children);
    }).catch(error => {
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

    if (!isFormValid) return; 
    
    const taskData = {
      title,
      description,
      priority,
      tags,
      deadline,
      status,
      children,
    };

    if (taskId) {
      // タスク更新
      axios.patch(`http://localhost:5000/api/tasks/${taskId}`, taskData, {
        withCredentials: true, // クッキーを含めるために必要
      }).catch(error => {
        if (error.status === 401 || error.status === 403) {
          navigate("/login");
        }
      });
    } else {
      // タスク登録
      axios.post(`http://localhost:5000/api/tasks`, taskData, {
        withCredentials: true, // クッキーを含めるために必要
      }).catch(error => {
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
    axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
      withCredentials: true, // クッキーを含めるために必要
    }).catch(error => {
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    });
    onSubmit();
  };

  const handleAddChild = async (ev) => {
    ev.preventDefault();
    if (!taskId || !taskName) return;

    const data = {
      id: nextId,
      taskName: taskName,
      taskContent: taskContent,
      completed: false
    }

    setChildren(children.concat(data));
    setTaskName('');
    setTaskContent('');
    setNextId(nextId + 1)
  };

  const toggleTaskCompletion = (id) => {
    setChildren(children.map(task => {
      if (task._id) {
        return task._id === id ? { ...task, completed: !task.completed } : task;
      } else {
        return task.id === id ? { ...task, completed: !task.completed } : task;
      }
    }));
  };

  const deleteChildTask = async (id) => {
    setChildren(children.filter(task => {
      if (task._id) {
        return task._id !== id;
      } else {
        return task.id !== id;
      }
    }));
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setChildren((items) => {
        if (items[0]._id) {
          const oldIndex = items.findIndex((item) => item._id === active.id);
          const newIndex = items.findIndex((item) => item._id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        } else {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        }
      });
    }
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

        {/* 子タスク追加フォーム */}
        {taskId && (
          <StyledPaper elevation={2}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={children.map(task => task._id ? task._id : task.id)}>
                子タスク
                <List dense>
                  {children.map((task) => (
                    <SortableItem
                      key={task._id ? task._id : task.id}
                      id={task._id ? task._id : task.id}
                      task={task}
                      toggleTaskCompletion={toggleTaskCompletion}
                      deleteTask={deleteChildTask}
                    />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
            <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="task name"
                variant="outlined"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
                size="small"
                sx={{ mr: 1, flexGrow: 1 }}
              />
              <TextField
                label="content"
                variant="outlined"
                value={taskContent}
                onChange={(e) => setTaskContent(e.target.value)}
                size="small"
                sx={{ mr: 1, flexGrow: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={handleAddChild}
                disabled={!taskName}
              >
                Add
              </Button>
            </Box>
          </StyledPaper>
        )}
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
