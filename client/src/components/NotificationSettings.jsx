import React, { useState, useRef } from "react";
import { Container, Typography, FormControlLabel, Switch, Slider, Box, Button, TextField } from "@mui/material";
import axios from "axios"; // Axiosをインポート

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [audioFile, setAudioFile] = useState(null); // アップロードされたMP3ファイル
  const audioRef = useRef(null); // 再生用のaudio要素の参照
  const [fileName, setFileName] = useState(""); // ファイル名表示用

  // 通知のオン/オフ
  const handleNotificationToggle = (event) => {
    setNotificationsEnabled(event.target.checked);
  };

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

  // サーバーにファイルをアップロード
  const handleSave = async () => {
    if (!fileName) {
      alert("MP3ファイルをアップロードしてください。");
      return;
    }

    const formData = new FormData();
    formData.append("audio", document.querySelector('input[type="file"]').files[0]);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
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

  return (
    <Container
      maxWidth="sm"
      sx={{
        maxWidth: "800px",
        marginX: "auto",
        mt: 4,
        mb: 4,
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        通知設定
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        通知のオン/オフや通知音を設定します。
      </Typography>

      <Box sx={{ mt: 4 }}>
        {/* 通知のオン/オフ */}
        <FormControlLabel
          control={
            <Switch
              checked={notificationsEnabled}
              onChange={handleNotificationToggle}
              color="primary"
            />
          }
          label="通知を有効にする"
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
              onClick={handleSave}
            >
              設定を保存
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default NotificationSettings;
