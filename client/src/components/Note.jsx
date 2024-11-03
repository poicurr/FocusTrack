import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import axios from 'axios';
import debounce from 'lodash.debounce';

function Note() {
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/memo/memo`, { withCredentials: true })
      .then((res) => setNote(res.data))
      .catch((error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) navigate("/login");
      });
  }, [navigate]);

  const saveMemo = debounce((memoContent) => {
    axios
      .post(`http://localhost:5000/api/memo/memo`, { memo: memoContent }, { withCredentials: true })
      .catch((error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) navigate("/login");
      });
  }, 1000); // 1秒間の遅延

  useEffect(() => {
    saveMemo(note);
  }, [note]);

  return (
    <TextField
      multiline
      rows={30}
      fullWidth
      variant="outlined"
      placeholder="Write a note here..."
      value={note}
      onChange={(e) => setNote(e.target.value)}
      style={{
        marginTop: '16px',
        fontSize: '1.2rem',
      }}
      sx={{
        height: '80vh',
        '& .MuiInputBase-root': {
          height: '100%',
        },
        '& .MuiInputBase-input': {
          height: '100% !important',
          overflow: 'auto',
        },
      }}
    />
  );
}

export default Note;
