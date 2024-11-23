import React, { useState } from 'react';
import { Typography, Link, Box } from '@mui/material';
import { AuthContainer, AuthCard, AuthTextField, AuthButton } from './styles/AuthStyles';

const SignUp = ({ onSignUp }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (!displayName || !email || !password1 || !password2) {
      setError('All fields are required');
      return;
    }
    if (password1 !== password2) {
      setError('Wrong password');
      return;
    }
    // サインアップ処理
    onSignUp(displayName, email, password1, (err) => {
      const res = err.response;
      console.error("Sign up failed:", res.data.message);
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
          新規登録
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
            label="名前"
            variant="outlined"
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
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
            onChange={(e) => setPassword1(e.target.value)}
            required
          />
          <AuthTextField
            fullWidth
            label="パスワード（確認）"
            variant="outlined"
            type="password"
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <AuthButton fullWidth onClick={handleSignUp} variant="contained" type="submit">
            アカウント作成
          </AuthButton>
        </Box>
        <Typography align="center" sx={{ mt: 2 }}>
          すでにアカウントをお持ちの方は{' '}
          <Link href="/login" underline="none" sx={{ color: '#FE6B8B' }}>
            こちら
          </Link>
        </Typography>
      </AuthCard>
    </AuthContainer>
  );
}

export default SignUp;