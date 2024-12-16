import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItem,
  Grid,
  Checkbox,
  Typography,
  Chip,
  TextField,
  IconButton,
  styled,
  Modal,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const TruncatedTypography = styled(Typography)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

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

const formatDate = (datestr) => {
  const date = new Date(datestr);
  return date.toLocaleDateString('ja-JP', {});
}

const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [taskId, setTaskId] = useState();
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

  // アーカイブ済みタスクリストを取得
  useEffect(() => {
    axios.get(`http://localhost:5000/api/tasks/archive`, {
      withCredentials: true, // クッキーを含めるために必要
    }).then(res => {
      setTasks(res.data);
    }).catch(error => {
      console.error('タスクリストの取得に失敗しました', error);
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    });
  }, [editOpen]);

  // タイトル、説明文、ステータス、タグ、優先度でフィルターをかける
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    task.priority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (task) => {
    setEditOpen(true);
    setTaskId(task._id);
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
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {filteredTasks.map((task) => (
          <Box key={task._id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }, minWidth: 250}}>
            <StyledCard elevation={2}>
              <CardContent sx={{ height: '100%', minHeight: 0 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {task.title}
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
                  {task.description}
                </Typography>
                <StatusChip
                  label={task.status}
                  status={task.status}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <PriorityChip
                  icon={<FlagIcon />}
                  label={task.priority}
                  priority={task.priority}
                  size="small"
                  sx={{ mb: 1, ml: 1 }}
                />
                <Box sx={{ mb: 1 }}>
                  {task.tags.map((tag) => (
                    tag && <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  deadline: {formatDate(task.deadline)}
                </Typography>
              </CardContent>
              { task.children?.length > 0 &&
                <Accordion sx={{ 
                  display: { xs: 'none', md: 'block' } // xs: 表示しない, md(900px以上): 表示する
                }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    Child Tasks
                  </AccordionSummary>
                  <AccordionDetails>
                    {task.children.map((childTask) => (
                      <StyledListItem key={childTask._id}>
                        <Grid container alignItems="center">
                          <Grid item xs={3}>
                            <TruncatedTypography variant="subtitle2">
                              {childTask.taskName}
                            </TruncatedTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <TruncatedTypography variant="body2" color="text.secondary">
                              {childTask.taskContent}
                            </TruncatedTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Checkbox
                              edge="end"
                              checked={childTask.completed}
                              inputProps={{ 'aria-labelledby': childTask._id }}
                            />
                          </Grid>
                        </Grid>
                      </StyledListItem>
                    ))}
                  </AccordionDetails>
                </Accordion>
              }
              <EditButton
                className="edit-button"
                aria-label={`edit ${task.title}`}
                onClick={() => handleEdit(task)}
              >
                <EditIcon />
              </EditButton>
            </StyledCard>
          </Box>
        ))}
      </Box>

      {/* 編集モーダル */}
      <Modal
        open={editOpen}
        onClose={handleClose}
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
          border: '1px solid #2e2e2e',
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
