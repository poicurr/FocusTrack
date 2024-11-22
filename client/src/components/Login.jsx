import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Box } from '@mui/material';
import { AuthContainer, AuthCard, AuthTextField, AuthButton } from './styles/AuthStyles';

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
    <>
      {/* エラーメッセージ */}
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}
      <AuthContainer>
        <AuthCard>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            FocusTrack
          </Typography>
          <Typography variant="h5" gutterBottom align="center">
            ログイン
          </Typography>
          <form>
            <AuthTextField
              fullWidth
              label="メールアドレス"
              variant="outlined"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AuthTextField
              fullWidth
              label="パスワード"
              variant="outlined"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <AuthButton fullWidth onClick={handleLogin} variant="contained" type="submit">
              ログイン
            </AuthButton>
          </form>
          <Typography align="center" sx={{ mt: 2 }}>
            アカウントをお持ちでない方は{' '}
            <Link href="/signup" underline="none" sx={{ color: '#FE6B8B' }}>
              こちら
            </Link>
          </Typography>
        </AuthCard>
      </AuthContainer>
    </>
  );
}

export default Login;
