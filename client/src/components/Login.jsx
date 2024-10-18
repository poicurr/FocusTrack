import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Box } from '@mui/material';

function Login({ onLogin, switchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (ev) => {
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }
    // ログイン処理
    onLogin(email, password, (err) => {
      const res = err.response;
      console.error("Login failed:", res.data.message);
      setError(res.data.message);
    });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2} width="100%" maxWidth="400px" margin="0 auto">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      
      {/* エラーメッセージ */}
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      {/* メールアドレス入力 */}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* パスワード入力 */}
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* ログインボタン */}
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ marginTop: 2 }}>
        Login
      </Button>

      {/* サインアップへのリンク */}
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Don't have an account?{' '}
        <Link href="#" onClick={switchToSignUp}>
          Sign up here
        </Link>
      </Typography>
    </Box>
  );
}

export default Login;
