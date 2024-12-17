import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  TextField,
  Button,
  Switch,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from '@mui/material';
import { ChromePicker } from 'react-color';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useSettings } from './SettingsContext';
import axios from 'axios';

const ColorBox = styled(Box)(({ bgcolor }) => ({
  width: '100%',
  height: '50px',
  backgroundColor: bgcolor,
  borderRadius: '4px',
  marginBottom: '10px',
}));

const StyledPaper = styled(Paper)({
  padding: '20px',
  maxWidth: '800px',
  margin: '0 auto',
});

const Input = styled('input')({
  display: 'none',
});

// 各MP3ファイルのURL
const audioFiles = [
  "mail1.mp3",
  "mail2.mp3",
];

const Settings = () => {
  const [settingsState, setSettingsState] = useState({
    avatar: '',
    displayName: '',
    theme: 'light',
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    primaryColor: '#FE6B8B',
    secondaryColor: '#FF8E53',
    notificationsEnabled: false,
    volume: 50,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const { updateSettings } = useSettings();
  const sound1 = new Audio(audioFiles[0]);
  const sound2 = new Audio(audioFiles[1]);
  const fileInputRef = useRef(null);

  // APIから設定を初期化
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/settings/fetch', {
          withCredentials: true,
        });
        setSettingsState(data);
      } catch (error) {
        if ([401, 403].includes(error.response?.status)) {
          navigate('/login');
        } else {
          console.error('設定の取得に失敗しました:', error);
        }
      }
    };
    fetchSettings();
  }, [navigate]);

  // 共通の設定更新関数
  const updateSetting = async (key, value) => {
    try {
      setSettingsState((prev) => ({ ...prev, [key]: value }));
      await axios.post(`http://localhost:5000/api/settings/upload/${key}`, { [key]: value }, {
        withCredentials: true,
      });
      updateSettings((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) {
        navigate('/login');
      } else {
        console.error(`設定の更新に失敗しました (${key}):`, error);
      }
    }
  };

  // アバター変更
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const avatarData = reader.result;
      updateSetting('avatar', avatarData);
      const formData = new FormData();
      formData.append("avatar", reader.result);
      try {
        const res = await axios.post(`http://localhost:5000/api/settings/upload/avatar`, formData, {
          withCredentials: true, // クッキーを含めるために必要
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        updateSettings((prev) => ({ ...prev, avatar: res.data.avatar }));
        console.log("ファイルが正常にアップロードされました！");
      } catch (error) {
        console.error("ファイルのアップロードに失敗しました:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSliderChange = (key) => (_, value) => {
    setSettingsState((prev) => ({ ...prev, [key]: value }));
    updateSetting(key, value);
  };

  const handleColorChange = (key) => (color) => {
    setSettingsState((prev) => ({ ...prev, [key]: color.hex }));
    updateSetting(key, color.hex);
  };

  const isBase64 = (avatar) => {
    if (!avatar) return false;
    return avatar.match(/^data:(.+);base64,(.+)$/);
  }

  // 再生処理
  const playSound1 = () => {
    sound1.play();
  };

  const playSound2 = () => {
    sound2.play();
  };

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {
              isBase64(settingsState.avatar) ?
              <Avatar
                src={settingsState.avatar ? settingsState.avatar : '/placeholder-user.jpg'}
                sx={{ width: 100, height: 100, cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              />
              :
              <Avatar
                src={settingsState.avatar ? "http://localhost:5000/" + settingsState.avatar : '/placeholder-user.jpg'}
                sx={{ width: 100, height: 100, cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              />
            }
            <label htmlFor="avatar-upload">
              <Input
                ref={fileInputRef}
                accept="image/*"
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
              />
              <Button variant="contained" component="span">
                Upload
              </Button>
            </label>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Display Name"
          value={settingsState.displayName}
          onChange={(e) => {
            const value = e.target.value;
            setSettingsState((prev) => ({ ...prev, displayName: value }));
            updateSetting('displayName', value);
          }}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <Select
            value={settingsState.theme}
            onChange={(e) => updateSetting('theme', e.target.value)}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormControl>

        <StyledPaper elevation={2}>
          <Typography variant="h6">Color Settings</Typography>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography>Primary</Typography>
              <ColorBox bgcolor={settingsState.primaryColor} />
              <ChromePicker
                color={settingsState.primaryColor}
                onChange={handleColorChange('primaryColor')}
                disableAlpha={true}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>Secondary</Typography>
              <ColorBox bgcolor={settingsState.secondaryColor} />
              <ChromePicker
                color={settingsState.secondaryColor}
                onChange={handleColorChange('secondaryColor')}
                disableAlpha={true}
              />
            </Grid>
          </Grid>
        </StyledPaper>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Timer Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography>Work Time: {settingsState.workTime} min</Typography>
            <Slider
              value={settingsState.workTime}
              onChange={handleSliderChange('workTime')}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={60}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Short Break: {settingsState.shortBreakTime} min</Typography>
            <Slider
              value={settingsState.shortBreakTime}
              onChange={handleSliderChange('shortBreakTime')}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={30}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Long Break: {settingsState.longBreakTime} min</Typography>
            <Slider
              value={settingsState.longBreakTime}
              onChange={handleSliderChange('longBreakTime')}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={60}
            />
          </Grid>
        </Grid>

        <StyledPaper elevation={2}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settingsState.notificationsEnabled}
                onChange={() =>
                  updateSetting('notificationsEnabled', !settingsState.notificationsEnabled)
                }
              />
            }
            label="Enable Notifications"
          />
          {settingsState.notificationsEnabled && (
            <>
              <Box sx={{ mt: 3 }}>
                <Typography>Volume</Typography>
                <Slider
                  value={settingsState.volume}
                  onChange={handleSliderChange('volume')}
                  min={0}
                  max={100}
                />
              </Box>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={playSound1}
                >
                  通知音1をテスト再生
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={playSound2}
                  sx={{ ml: 3 }}
                >
                  通知音2をテスト再生
                </Button>
              </Box>
            </>
          )}
        </StyledPaper>

        <Button
          variant="contained"
          color="error"
          fullWidth
          sx={{ mt: 4 }}
          onClick={() => setDeleteOpen(true)}
        >
          Delete Account
        </Button>

        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogTitle>Delete Account?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action is irreversible. Are you sure you want to delete your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                console.log('Account deleted');
                setDeleteOpen(false);
              }}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Settings;
