import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  Grid,
  Paper,
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from '@mui/material';
import { ChromePicker } from 'react-color';

import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useSettings } from './SettingsContext';
import axios from 'axios';
import debounce from 'lodash.debounce';

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

export default function SettingsPage() {
  const [avatar, setAvatar] = useState("");
  const [displayName, setDisplayName] = useState('');
  const [theme, setTheme] = useState('light');
  const [workTime, setWorkTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [primaryColor, setPrimaryColor] = useState('#2E0B17');
  const [secondaryColor, setSecondaryColor] = useState('#FF8E53');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [volume, setVolume] = useState(50);
  const [audioFile, setAudioFile] = useState(null); // アップロードされたMP3ファイル
  const audioRef = useRef(null); // 再生用のaudio要素の参照
  const [fileName, setFileName] = useState(""); // ファイル名表示用
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/settings/fetch`, {
      withCredentials: true, // クッキーを含めるために必要
    }).then(res => {
      const data = res.data;
      setAvatar(data.avatar);
      setDisplayName(data.displayName);
      setTheme(data.theme);
      setWorkTime(data.workTime);
      setShortBreakTime(data.shortBreakTime);
      setLongBreakTime(data.longBreakTime);
      setPrimaryColor(data.primaryColor);
      setSecondaryColor(data.secondaryColor);
      setNotificationsEnabled(data.notificationsEnabled);
    }).catch(error => {
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    });
  }, []);

  const handleClickOpen = () => {
    setDeleteOpen(true);
  };

  const handleClose = () => {
    setDeleteOpen(false);
  };

  const fileInputRef = useRef(null);

  // Avatar
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setAvatar(reader.result);
      const formData = new FormData();
      formData.append("avatar", reader.result);
      try {
        const res = await axios.post(`http://localhost:5000/api/settings/upload/avatar`, formData, {
          withCredentials: true, // クッキーを含めるために必要
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAvatar(res.data.avatar);
        updateSettings({ ...settings, avatar: res.data.avatar });
        console.log("ファイルが正常にアップロードされました！");
      } catch (error) {
        console.error("ファイルのアップロードに失敗しました:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  // DisplayName
  const saveDisplayName = debounce((displayName) => {
    if (!displayName || displayName.trim() === "") {
      return;
    }
    axios.post(`http://localhost:5000/api/settings/upload/displayName`, { displayName: displayName }, {
      withCredentials: true
    }).catch((error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) navigate("/login");
    });
  }, 1000); // 1秒間の遅延

  useEffect(() => {
    saveDisplayName(displayName);
  }, [displayName]);

  // テーマ設定
  const handleThemeChange = (ev) => {
    try {
      const newValue = theme === 'light' ? 'dark' : 'light';
      // サーバーに更新リクエストを送信
      axios.post("http://localhost:5000/api/settings/upload/theme",
        { theme: newValue },
        { withCredentials: true } // クッキーを使用して認証情報を送信する場合
      );
      setTheme(newValue); // 状態を更新
      updateSettings({ ...settings, theme: newValue });
    } catch (error) {
      console.error("サーバー更新に失敗しました:", error);
    }
  }

  // Primary Color
  const savePrimaryColor = debounce((primaryColor) => {
    axios.post(`http://localhost:5000/api/settings/upload/primaryColor`, { primaryColor: primaryColor }, {
      withCredentials: true
    }).catch((error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) navigate("/login");
    });
    updateSettings({ ...settings, primaryColor: primaryColor });
  }, 1000); // 1秒間の遅延

  useEffect(() => {
    savePrimaryColor(primaryColor);
  }, [primaryColor]);

  // Secondary Color
  const saveSecondaryColor = debounce((secondaryColor) => {
    axios.post(`http://localhost:5000/api/settings/upload/secondaryColor`, { secondaryColor: secondaryColor }, {
      withCredentials: true
    }).catch((error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) navigate("/login");
    });
    updateSettings({ ...settings, secondaryColor: secondaryColor });
  }, 1000); // 1秒間の遅延

  useEffect(() => {
    saveSecondaryColor(secondaryColor);
  }, [secondaryColor]);

  // colorChangeHandler(Primary/Secondary共用)
  const handleColorChange = (color, setColor) => (color) => {
    setColor(color.hex);
  };

  // WorkTime
  const saveWorkTime = debounce((workTime) => {
    axios.post(`http://localhost:5000/api/settings/upload/workTime`,
      { workTime: workTime },
      { withCredentials: true }
    ).catch((error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) navigate("/login");
    });
  }, 1000); // 1秒間の遅延

  useEffect(() => {
    saveWorkTime(workTime);
  }, [workTime]);

  // ShortBreakTime
  const saveShortBreakTime = debounce((shortBreakTime) => {
    axios.post(`http://localhost:5000/api/settings/upload/shortBreakTime`,
      { shortBreakTime: shortBreakTime },
      { withCredentials: true }
    ).catch((error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) navigate("/login");
    });
  }, 1000); // 1秒間の遅延

  useEffect(() => {
    saveShortBreakTime(shortBreakTime);
  }, [shortBreakTime]);

  // LongBreakTime
  const saveLongBreakTime = debounce((longBreakTime) => {
    axios.post(`http://localhost:5000/api/settings/upload/longBreakTime`,
      { longBreakTime: longBreakTime },
      { withCredentials: true }
    ).catch((error) => {
      const status = error.response?.status;
      if (status === 401 || status === 403) navigate("/login");
    });
  }, 1000); // 1秒間の遅延

  useEffect(() => {
    saveLongBreakTime(longBreakTime);
  }, [longBreakTime]);

  // 通知のオン/オフ
   const handleNotificationsEnabled = (ev) => {
    try {
      const newValue = !notificationsEnabled;
      // サーバーに更新リクエストを送信
      axios.post("http://localhost:5000/api/settings/upload/notificationsEnabled",
        { notificationsEnabled: newValue },
        { withCredentials: true } // クッキーを使用して認証情報を送信する場合
      );
      setNotificationsEnabled(newValue); // 状態を更新
    } catch (error) {
      console.error("サーバー更新に失敗しました:", error);
    }
  }

  // サウンドのオン/オフ
  const handleSoundToggle = (event) => {
    setSoundEnabled(event.target.checked);
  };

  // ボリューム調整
  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    if (audioRef.current) {
      audioRef.current.volume = newValue / 100; // 0～1の範囲で設定
    }
  };

  // MP3ファイルのアップロード処理
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "audio/mpeg") {
      const url = URL.createObjectURL(file); // 一時URLを生成
      setAudioFile(url);
      setFileName(file.name);
    } else {
      alert("MP3ファイルをアップロードしてください。");
    }
  };

  // テスト再生
  const handleTestPlay = () => {
    if (audioRef.current && audioFile) {
      audioRef.current.play();
    } else {
      alert("通知音をアップロードしてください。");
    }
  };

  // サーバーにMP3ファイルをアップロード
  const handleSoundSave = async () => {
    if (!fileName) {
      alert("MP3ファイルをアップロードしてください。");
      return;
    }

    const formData = new FormData();
    formData.append("audio", document.querySelector('input[type="file"]').files[0]);

    try {
      await axios.post("http://localhost:5000/settings/upload/audio", formData, 
        {
          withCredentials: true, // クッキーを含めるために必要
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      alert("ファイルが正常にアップロードされました！");
    } catch (error) {
      console.error("ファイルのアップロードに失敗しました:", error);
      alert("ファイルのアップロードに失敗しました。");
    }
  };

  const handleDeleteAccount = () => {
    // ここにアカウント削除のロジックを実装
    console.log('アカウントが削除されました');
    handleClose();
  };

  const isBase64 = () => {
    if (!avatar) return false;
    return avatar.match(/^data:(.+);base64,(.+)$/);
  }

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {
              isBase64() ?
              <Avatar
                src={avatar ? avatar : '/placeholder-user.jpg'}
                sx={{ width: 100, height: 100, cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              />
              :
              <Avatar
                src={avatar ? "http://localhost:5000/" + avatar : '/placeholder-user.jpg'}
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
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value)
          }}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="theme-select-label">Theme</InputLabel>
          <Select
            labelId="theme-select-label"
            value={theme}
            label="Theme"
            onChange={handleThemeChange}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormControl>

        <StyledPaper elevation={2}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Color Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Primary</Typography>
              <ColorBox bgcolor={primaryColor} />
              <ChromePicker 
                color={primaryColor}
                onChange={handleColorChange(primaryColor, setPrimaryColor)}
                disableAlpha={true}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Secondary</Typography>
              <ColorBox bgcolor={secondaryColor} />
              <ChromePicker 
                color={secondaryColor}
                onChange={handleColorChange(secondaryColor, setSecondaryColor)}
                disableAlpha={true}
              />
            </Grid>
          </Grid>
        </StyledPaper>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Timer Settings
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12}>
            <Typography id="work-time-slider" gutterBottom>
              Work Time: {workTime} minutes
            </Typography>
            <Slider
              value={workTime}
              onChange={(_, newValue) => setWorkTime(newValue)}
              aria-labelledby="work-time-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={60}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography id="short-break-slider" gutterBottom>
              Short Break: {shortBreakTime} minutes
            </Typography>
            <Slider
              value={shortBreakTime}
              onChange={(_, newValue) => setShortBreakTime(newValue)}
              aria-labelledby="short-break-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={30}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography id="long-break-slider" gutterBottom>
              Long Break: {longBreakTime} minutes
            </Typography>
            <Slider
              value={longBreakTime}
              onChange={(_, newValue) => setLongBreakTime(newValue)}
              aria-labelledby="long-break-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={60}
            />
          </Grid>
        </Grid>

        <StyledPaper elevation={2}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Notification
          </Typography>
          <Box sx={{ mt: 4 }}>
            {/* 通知のオン/オフ */}
            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={handleNotificationsEnabled}
                  color="primary"
                />
              }
              label="Notifications"
            />

            {/* サウンドのオン/オフ */}
            {notificationsEnabled && (
              <FormControlLabel
                control={
                  <Switch
                    checked={soundEnabled}
                    onChange={handleSoundToggle}
                    color="primary"
                  />
                }
                label="通知音を有効にする"
              />
            )}

            {/* 通知音のボリューム設定 */}
            {notificationsEnabled && soundEnabled && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  通知音のボリューム
                </Typography>
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  aria-labelledby="volume-slider"
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  color="primary"
                />
              </Box>
            )}

            {/* 通知音のアップロード */}
            {notificationsEnabled && soundEnabled && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  通知音をアップロード
                </Typography>
                <TextField
                  type="file"
                  inputProps={{ accept: ".mp3" }}
                  onChange={handleFileUpload}
                  fullWidth
                />
              </Box>
            )}

            {/* テスト再生ボタン */}
            {notificationsEnabled && soundEnabled && audioFile && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleTestPlay}
                >
                  通知音をテスト再生
                </Button>
                <audio ref={audioRef} src={audioFile}></audio>
              </Box>
            )}

            {/* 保存ボタン */}
            {notificationsEnabled && soundEnabled && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSoundSave}
                >
                  設定を保存
                </Button>
              </Box>
            )}
          </Box>
        </StyledPaper>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleClickOpen}
          >
            delete this account
          </Button>
        </Box>

        <Dialog
          open={deleteOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          disableAutoFocus
          disableEnforceFocus
        >
          <DialogTitle id="alert-dialog-title">
            {"アカウントを削除しますか？"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              この操作は取り消すことができません。アカウントを削除すると、すべてのデータが永久に失われます。本当に削除しますか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              キャンセル
            </Button>
            <Button onClick={handleDeleteAccount} color="error" autoFocus>
              削除する
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Container>
  );
}