import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const ChildTaskModal = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = () => {
    onSubmit(title, status);
    setTitle('');
    setStatus('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>新しいタスクを追加</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="タスクタイトル"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <FormControl fullWidth variant="outlined" margin="dense">
          <InputLabel id="status-label">ステータス</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="ステータス"
          >
            <MenuItem value="未着手">未着手</MenuItem>
            <MenuItem value="進行中">進行中</MenuItem>
            <MenuItem value="完了">完了</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          追加
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChildTaskModal;
