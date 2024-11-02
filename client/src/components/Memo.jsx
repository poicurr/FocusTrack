import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import axios from 'axios';
import debounce from 'lodash.debounce';

function Memo() {
  const [memo, setMemo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/memo/memo`, { withCredentials: true })
      .then((res) => setMemo(res.data))
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
    saveMemo(memo);
  }, [memo]);

  return (
    <TextField
      multiline
      rows={30}
      fullWidth
      variant="outlined"
      placeholder="ここにメモを書いてください..."
      value={memo}
      onChange={(e) => setMemo(e.target.value)}
      style={{
        marginTop: '16px',
        fontSize: '1.2rem',
      }}
    />
  );
}

export default Memo;
