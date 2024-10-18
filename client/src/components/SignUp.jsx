import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Box } from '@mui/material';

function SignUp({ onSignUp, switchToLogin }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (!displayName || !email || !password) {
      setError('All fields are required');
      return;
    }
    // サインアップ処理
    onSignUp(displayName, email, password, (err) => {
      const res = err.response;
      console.error("Sign up failed:", res.data.message);
      setError(res.data.message);
    });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2} width="100%" maxWidth="400px" margin="0 auto">
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      
      {/* エラーメッセージ */}
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      {/* 表示名 */}
      <TextField
        label="Display Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

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

      {/* サインアップボタン */}
      <Button variant="contained" color="primary" fullWidth onClick={handleSignUp} sx={{ marginTop: 2 }}>
        Sign Up
      </Button>

      {/* ログイン画面へのリンク */}
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Already have an account?{' '}
        <Link href="#" onClick={switchToLogin}>
          Login here
        </Link>
      </Typography>
    </Box>
  );
}

export default SignUp;
