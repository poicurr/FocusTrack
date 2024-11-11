import React, { useState, useEffect } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import { Box, Button, Typography } from '@mui/material';
import 'react-circular-progressbar/dist/styles.css';
import './PomodoroTimer.css';
import CircularProgressBar from './CircularProgressBar';

const SIZE = 280;
const STROKE_WIDTH = 4;

const PomodoroTimer = () => {
  const [time, setTime] = useState(new Date());
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); // 25分
  const [startAngle, setStartAngle] = useState(0);
  const [endAngle, setEndAngle] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let countdown;
    if (isRunning) {
      countdown = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 0) {
            clearInterval(countdown);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
        const m = time.getMinutes();
        const s = time.getSeconds();
        setStartAngle(6 * m + 0.1 * s);
        setEndAngle(startAngle + secondsLeft * 0.1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
      <Box sx={{ position: 'relative', width: SIZE + STROKE_WIDTH * 2, height: SIZE + STROKE_WIDTH * 2 }}>

        {/* プログレスバー */}
        <Box sx={{
          position: 'absolute',
          top: 1 - STROKE_WIDTH,
          left: 1 - STROKE_WIDTH,
          width: SIZE + STROKE_WIDTH * 2,
          height: SIZE + STROKE_WIDTH * 2
        }}>
          <CircularProgressBar startAngle={-90 + startAngle} endAngle={-90 + endAngle} visible={isRunning}/>
        </Box>

        {/* アナログ時計 */}
        <Box sx={{ position: 'absolute', left: 1, top: 1}}>
          <Clock value={time} size={SIZE} />
        </Box>
        <Typography variant="h5" sx={{ textAlign: "center", mt: '65%'}}>
          {formatTime(secondsLeft)}
        </Typography>
      </Box>

      {/* スタート・ストップボタン */}
      <Button
        variant="contained"
        color={isRunning ? 'secondary' : 'primary'}
        onClick={() => {
          setIsRunning(!isRunning);
          const m = time.getMinutes();
          const s = time.getSeconds();
          setStartAngle(6 * m + 0.1 * s);
          setEndAngle(startAngle + secondsLeft * 0.1);
        }}
        sx={{ mt: 3 }}
      >
        {isRunning ? 'Pause' : 'Start'}
      </Button>

      {/* リセットボタン */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          setSecondsLeft(25 * 60); // 25分にリセット
          setIsRunning(false);
        }}
        sx={{ mt: 2 }}
      >
        Reset
      </Button>
    </Box>
  );
};

export default PomodoroTimer;
