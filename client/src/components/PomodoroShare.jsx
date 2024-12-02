import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarRateIcon from '@mui/icons-material/StarRate';

const PomodoroShare = ({ pomodoroCount, completedTasks, satisfaction }) => {
  return (
    <Card sx={{
      maxWidth: 800,
      margin: 'auto',
      padding: 3,
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      color: 'white',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }}>
      <CardContent>
        <Typography variant="h4" component="div" gutterBottom align="center">
          Today's achievements🎉
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <AccessAlarmIcon />
            <Typography variant="h3">{pomodoroCount}</Typography>
            <Typography variant="subtitle1">Pomodoro Sessions</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircleIcon />
            <Typography variant="h3">{completedTasks}</Typography>
            <Typography variant="subtitle1">Completed Tasks</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <StarRateIcon />
            <Typography variant="h3">{satisfaction}</Typography>
            <Typography variant="subtitle1">Satisfaction</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'right', mt: 3 }}>
          Powered by FocusTrack
        </Box>
      </CardContent>
    </Card>
  );
};

export default PomodoroShare;