import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Box
} from '@mui/material';
import { styled } from '@mui/system';
import TimerIcon from '@mui/icons-material/Timer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// スタイル付きコンポーネントの定義
const StyledAppBar = styled(AppBar)({
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
});

const HeroSection = styled(Box)({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  padding: '100px 0',
  color: 'white',
  textAlign: 'center',
});

const FeatureCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
});

const Footer = styled(Box)({
  background: '#f5f5f7',
  padding: '2rem 0',
  textAlign: 'center',
});

export default function Home() {

  const navigate = useNavigate();

  return (
    <>
      <StyledAppBar position="static" elevation={0}>
        <Toolbar>
          <img src="logo.png" style={{width: 64, height: 64}} alt="logo" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'black' }}>
            FocusTrack
          </Typography>
          <Button color="inherit" sx={{ color: 'black' }} onClick={ ev => navigate("/login") }>Login</Button>
          <Button color="inherit" sx={{ color: 'black' }} onClick={ ev => navigate("/signup") }>Signup</Button>
        </Toolbar>
      </StyledAppBar>

      <HeroSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            生産性を再定義する
          </Typography>
          <Typography variant="h5" paragraph>
            ポモドーロ法とタスク管理を完璧に融合
          </Typography>
        </Container>
      </HeroSection>

      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <TimerIcon sx={{ fontSize: 60, color: '#FE6B8B', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                スマートなタイムマネジメント
              </Typography>
              <Typography>
                カスタマイズ可能なポモドーロタイマーで、集中力を最大化し、生産性を向上させます。
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <AssignmentIcon sx={{ fontSize: 60, color: '#FF8E53', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                直感的なタスク管理
              </Typography>
              <Typography>
                シンプルで使いやすいインターフェースで、タスクの整理と優先順位付けが簡単に行えます。
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <TrendingUpIcon sx={{ fontSize: 60, color: '#3F51B5', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                詳細な分析
              </Typography>
              <Typography>
                生産性のトレンドを可視化し、作業習慣を最適化するためのインサイトを提供します。
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            あなたの生産性を最大化
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            FocusTrackは、ポモドーロ法とタスク管理を完璧に統合し、
            あなたの作業効率を飛躍的に向上させます。
            シンプルで美しいデザインと直感的な操作性で、
            生産性向上の新たな扉を開きます。
          </Typography>
        </Container>
      </Box>

      <Footer>
        <Container>
          <Typography variant="body2" color="text.secondary">
            © 2024 FocusTrack. All rights reserved.
          </Typography>
        </Container>
      </Footer>
    </>
  );
}

