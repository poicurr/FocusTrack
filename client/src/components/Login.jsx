import React, { useState } from 'react';
import { Typography, Link, Box } from '@mui/material';
import { AuthContainer, AuthCard, AuthTextField, AuthButton } from './styles/AuthStyles';

const Login = ({ onLogin }) => {
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
    <AuthContainer>
      <AuthCard>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          FocusTrack
        </Typography>
        <Typography variant="h5" gutterBottom align="center">
          ログイン
        </Typography>
        {/* エラーメッセージ */}
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
        <Box>
          <AuthTextField
            fullWidth
            label="メールアドレス"
            variant="outlined"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <AuthTextField
            fullWidth
            label="パスワード"
            variant="outlined"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <AuthButton fullWidth onClick={handleLogin} variant="contained" type="submit">
            ログイン
          </AuthButton>
        </Box>
        <Typography align="center" sx={{ mt: 2 }}>
          アカウントをお持ちでない方は{' '}
          <Link href="/signup" underline="none" sx={{ color: '#FE6B8B' }}>
            こちら
          </Link>
        </Typography>
      </AuthCard>
    </AuthContainer>
  );
}

export default Login;
