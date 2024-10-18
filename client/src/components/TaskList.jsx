import React, { useState } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TaskEdit from './modals/TaskEdit';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  '&:hover .edit-button': {
    opacity: 1,
  },
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
    status === '進行中' ? '#1e90ff' :
    status === '保留中' ? '#ffd700' :
    status === '完了' ? '#32cd32' :
    status === 'キャンセル' ? '#ff4500' : '#e0e0e0',
  color: status === '保留中' ? '#000' : '#fff',
}));

const cardData = [
  {
    id: "670edd196cd2e1a3ba5d4d43",
    title: 'プロジェクトA',
    description: '新しいウェブサイトのデザインと開発。このプロジェクトには多くの段階があり、チーム全体の協力が必要です。ユーザー体験を最優先に考え、最新のウェブ技術を活用して革新的なサイトを作成します。',
    status: '進行中',
    tags: ['デザイン', '開発'],
    deadline: '2024/06/30',
  },
  {
    id: 2,
    title: 'タスクB',
    description: 'データベース最適化とパフォーマンス向上。既存のシステムを分析し、クエリの最適化と索引の改善を行います。これは、システム全体の応答速度を向上させるための重要なステップです。詳細な分析と計画に基づいて、最適化を実施します。',
    status: '保留中',
    tags: ['データベース', '最適化'],
    deadline: '2024/07/15',
  },
  {
    id: 3,
    title: 'プロジェクトC',
    description: 'モバイルアプリのUI/UX改善。ユーザーフィードバックに基づいて、アプリの使いやすさと視覚的魅力を向上させます。具体的な改善点としては、ナビゲーションの改善、視覚的な要素の調整、ユーザーインターフェースの簡素化などが挙げられます。',
    status: '完了',
    tags: ['モバイル', 'UI/UX'],
    deadline: '2024/05/20',
  },
  {
    id: 4,
    title: 'タスクD',
    description: 'レガシーシステムの移行計画。古いシステムから新しいプラットフォームへのスムーズな移行を計画します。この計画には、データマイグレーション、システムテスト、ユーザーへのトレーニングなどが含まれます。リスクを最小限に抑え、移行を成功させるための詳細な手順を策定します。',
    status: 'キャンセル',
    tags: ['システム移行', '計画'],
    deadline: '2024/08/01',
  },
];

const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [taskId, setTaskId] = useState();

  const cardData2 = [];

  const filteredCards = cardData.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (card) => {
    setOpen(true);
    setTaskId(card.id);
  };

  const handleOpen = () => {
    setOpen(true);
    setTaskId(null);
  };

  const handleClose = () => {
    setOpen(false);
    setTaskId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        label="検索"
        placeholder="タイトル、説明、タグで検索..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {filteredCards.map((card) => (
          <Box key={card.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }, minWidth: 250}}>
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
                aria-label={`${card.title}を編集`}
                onClick={() => handleEdit(card)}
              >
                <EditIcon />
              </EditButton>
            </StyledCard>
          </Box>
        ))}
      </Box>

      {/* モーダル */}
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
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
