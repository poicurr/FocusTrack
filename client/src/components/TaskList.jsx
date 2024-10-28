import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  IconButton,
  styled,
  Modal,
  Switch,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FlagIcon from '@mui/icons-material/Flag';
import TaskEdit from './modals/TaskEdit';

import axios from 'axios';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: '250px', // 最小の高さを追加
  display: 'flex',
  flexDirection: 'column',
  '&:hover .edit-button': {
    opacity: 1,
  },
}));

const ExecButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(6),
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const EditButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor:
    status === 'in-progress' ? '#1e90ff' :
    status === 'pending' ? '#ffd700' :
    status === 'completed' ? '#32cd32' :
    status === 'cancelled' ? '#ff4500' : '#e0e0e0',
  color: status === 'pending' ? '#000' : '#fff',
}));

const PriorityChip = styled(Chip)(({ priority }) => ({
  backgroundColor:
    priority === 'high' ? '#ff4500' :
    priority === 'medium' ? '#ffa500' :
    priority === 'low' ? '#32cd32' : '#e0e0e0',
  color: '#fff',
}));

const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [taskId, setTaskId] = useState();
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  const navigate = useNavigate();

  // タスクリストを取得
  useEffect(() => {
    axios.get(`http://localhost:5000/api/user/tasks`, {
      withCredentials: true, // クッキーを含めるために必要
    }).then(res => {
      setTasks(res.data);
    }).catch(error => {
      console.error('タスクリストの取得に失敗しました', error);
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    });
  }, [editOpen]); // 画面のリフレッシュタイミングはモーダル開閉のとき

  // タイトル、説明文、ステータス、タグ、優先度でフィルターをかける
  const filteredCards = tasks.filter((card) =>
    (
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      card.priority.toLowerCase().includes(searchTerm.toLowerCase())
    ) && showCompleted ? card.status === 'completed' : card.status !== 'completed'
  );

  const handleEdit = (card) => {
    setEditOpen(true);
    setTaskId(card._id);
  };

  const handleAddTask = () => {
    setEditOpen(true);
    setTaskId(null);
  };

  const handleClose = () => {
    setEditOpen(false);
    setTaskId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search"
          placeholder="Search by title, description, status, tags, priority..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>
              {showCompleted ? "Completed" : "Outstanding"}
            </Typography>
          }
        />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {filteredCards.map((card) => (
          <Box key={card._id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }, minWidth: 250}}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {card.description}
                </Typography>
                <StatusChip
                  label={card.status}
                  status={card.status}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <PriorityChip
                  icon={<FlagIcon />}
                  label={card.priority}
                  priority={card.priority}
                  size="small"
                  sx={{ mb: 1, ml: 1 }}
                />
                <Box sx={{ mb: 1 }}>
                  {card.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  締切日: {card.deadline}
                </Typography>
              </CardContent>
              <EditButton
                className="edit-button"
                aria-label={`edit ${card.title}`}
                onClick={() => handleEdit(card)}
              >
                <EditIcon />
              </EditButton>
              <ExecButton
                className="edit-button"
                aria-label={`task begin: ${card.title}`}
                onClick={() => handleEdit(card)}
              >
                <PlayArrowIcon />
              </ExecButton>
            </StyledCard>
          </Box>
        ))}
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
          <StyledCard>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%'
            }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddTask}
                sx={{ width: '100%', height: '100%' }}
              >
                {'Add new task'}
              </Button>
            </CardContent>
          </StyledCard>
        </Box>
      </Box>

      {/* モーダル */}
      <Modal
        open={editOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: "80%",
          height: "80%",
          maxWidth: 600,
          overflowY: "auto",
          bgcolor: 'background.paper',
          border: '2px solid #000',
          borderRadius: 5,
          boxShadow: 24,
          p: 4,
        }}>
          <TaskEdit taskId={taskId} onSubmit={handleClose} />
        </Box>
      </Modal>
    </Box>
  );
}

export default TaskList;
