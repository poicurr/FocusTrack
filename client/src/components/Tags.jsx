import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { styled } from "@mui/system";

const StyledContainer = styled(Container)({
  maxWidth: "800px",
  margin: "0 auto",
  padding: "16px",
});

const TagBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "16px",
});

const ResponsiveList = styled(List)(({ theme }) => ({
  maxWidth: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "4px",
  boxShadow: theme.shadows[1],
}));

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [editTag, setEditTag] = useState({ index: null, value: "" });
  const [deleteTagIndex, setDeleteTagIndex] = useState(null);

  // タグを追加
  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  // タグを編集
  const handleEditTag = () => {
    if (editTag.value.trim() !== "" && editTag.index !== null) {
      const updatedTags = [...tags];
      updatedTags[editTag.index] = editTag.value;
      setTags(updatedTags);
      setEditTag({ index: null, value: "" });
    }
  };

  // タグを削除
  const handleDeleteTag = () => {
    if (deleteTagIndex !== null) {
      const updatedTags = tags.filter((_, index) => index !== deleteTagIndex);
      setTags(updatedTags);
      setDeleteTagIndex(null);
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        タグ管理
      </Typography>
      <TagBox>
        <TextField
          label="新しいタグ"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTag}
          startIcon={<Add />}
        >
          追加
        </Button>
      </TagBox>
      { tags.length !== 0 &&
        <ResponsiveList>
          {tags.map((tag, index) => (
            <>
              {index > 0 && <Divider component="li" />}
              <ListItem key={index}>
                <ListItemText primary={tag} />
                  <IconButton
                    edge="end"
                    onClick={() =>
                      setEditTag({ index, value: tag })
                    }
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => setDeleteTagIndex(index)}
                  >
                    <Delete />
                  </IconButton>
              </ListItem>
            </>
          ))}
        </ResponsiveList>
      }

      {/* 編集ダイアログ */}
      <Dialog
        open={editTag.index !== null}
        onClose={() => setEditTag({ index: null, value: "" })}
      >
        <DialogTitle>タグを編集</DialogTitle>
        <DialogContent>
          <TextField
            label="タグ名"
            value={editTag.value}
            onChange={(e) =>
              setEditTag((prev) => ({ ...prev, value: e.target.value }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditTag({ index: null, value: "" })}
            color="primary"
          >
            キャンセル
          </Button>
          <Button onClick={handleEditTag} color="primary" variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={deleteTagIndex !== null}
        onClose={() => setDeleteTagIndex(null)}
      >
        <DialogTitle>タグを削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            このタグを削除してもよろしいですか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTagIndex(null)} color="primary">
            キャンセル
          </Button>
          <Button
            onClick={handleDeleteTag}
            color="error"
            variant="contained"
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
}
