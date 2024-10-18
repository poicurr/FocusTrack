import React, { useState, useRef } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/system';

const Input = styled('input')({
  display: 'none',
});

export default function SettingsPage() {
  const [avatar, setAvatar] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [theme, setTheme] = useState('light');
  const [workTime, setWorkTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [notifications, setNotifications] = useState(true);

  const fileInputRef = useRef(null);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Here you would typically save the settings to a backend or local storage
    console.log({
      avatar,
      displayName,
      theme,
      workTime,
      shortBreakTime,
      longBreakTime,
      notifications,
    });
  };

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={avatar || '/placeholder-user.jpg'}
              sx={{ width: 100, height: 100, cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
            />
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
          onChange={(e) => setDisplayName(e.target.value)}
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="theme-select-label">Theme</InputLabel>
          <Select
            labelId="theme-select-label"
            value={theme}
            label="Theme"
            onChange={(e) => setTheme(e.target.value)}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormControl>

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

        <FormControlLabel
          control={
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          }
          label="Notifications"
          sx={{ mt: 2 }}
        />

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Container>
  );
}