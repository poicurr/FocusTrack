import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  Box,
  List,
  ListItem,
  Divider,
  Typography,
  IconButton,
  Paper
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { styled } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ja } from 'date-fns/locale';
import axios from 'axios';

const StyledPaper = styled(Paper)({
  padding: '25px',
  maxWidth: '800px',
  margin: '0 auto',
});

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
  const [completed, setCompleted] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  // タスクIDが存在する場合、タスク情報を取得
  useEffect(() => {
    if (!taskId) return;
    axios.get(`http://localhost:5000/api/task/tasks/${taskId}`, {
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
    };

    if (taskId) {
      // タスク更新
      axios.put(`http://localhost:5000/api/task/tasks/${taskId}`, taskData, {
        withCredentials: true, // クッキーを含めるために必要
      }).catch(error => {
        if (error.status === 401 || error.status === 403) {
          navigate("/login");
        }
      });
    } else {
      // タスク登録
      axios.post(`http://localhost:5000/api/task/tasks`, taskData, {
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
    axios.delete(`http://localhost:5000/api/task/tasks/${taskId}`, {
      withCredentials: true, // クッキーを含めるために必要
    }).catch(error => {
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    });
    onSubmit();
  };

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskContentChange = (event) => {
    setTaskContent(event.target.value);
  };

  const handleAddChild = (event) => {
    event.preventDefault();
    if (taskName) {
      setChildren([...children, { id: nextId, name: taskName, content: taskContent, completed: false }]);
      setNextId(nextId + 1);
      setTaskName('');
      setTaskContent('');
    }
  };

  const toggleTaskCompletion = (id) => {
    setChildren(children.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setChildren(children.filter(task => task.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newTasks = Array.from(children);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);

    setChildren(newTasks);
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
        <StyledPaper elevation={2}>
          子タスク
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {children.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{ display: 'flex', alignItems: 'center', py: 1 }}
                        >
                          <Box {...provided.dragHandleProps} sx={{ mr: 1, cursor: 'move' }}>
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
                            {task.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              flexGrow: 1,
                              textDecoration: task.completed ? 'line-through' : 'none'
                            }}
                          >
                            {task.content}
                          </Typography>
                          <IconButton onClick={() => toggleTaskCompletion(task.id)} sx={{ ml: 1 }} aria-label={task.completed ? "タスクを未完了にする" : "タスクを完了にする"}>
                            {task.completed 
                              ? <CheckCircleOutlineIcon color="primary" /> 
                              : <RadioButtonUncheckedIcon />
                            }
                          </IconButton>
                          <IconButton onClick={() => deleteTask(task.id)} sx={{ ml: 1 }} aria-label="タスクを削除">
                            <DeleteOutlineIcon />
                          </IconButton>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
          
          <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="タスク名"
              variant="outlined"
              value={taskName}
              onChange={handleTaskNameChange}
              required
              size="small"
              sx={{ mr: 1, flexGrow: 1 }}
            />
            <TextField
              label="内容"
              variant="outlined"
              value={taskContent}
              onChange={handleTaskContentChange}
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
              追加
            </Button>
          </Box>
        </StyledPaper>
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
