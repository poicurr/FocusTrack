import React, { useState, useEffect } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import { Box, Button, Typography } from '@mui/material';
import 'react-circular-progressbar/dist/styles.css';

// props.th1 < props.th2
const createSvg = (props) => {
  const {th1, th2, radius, color, strokeWidth} = props;

  const x1 = radius + strokeWidth + radius * Math.cos(Math.PI * th1 / 180.0);
  const y1 = radius + strokeWidth + radius * Math.sin(Math.PI * th1 / 180.0);

  const x2 = radius + strokeWidth + radius * Math.cos(Math.PI * th2 / 180.0);
  const y2 = radius + strokeWidth + radius * Math.sin(Math.PI * th2 / 180.0);

  let svg = `<svg width="${(radius + strokeWidth) * 2}" height="${(radius + strokeWidth) * 2}" viewBox="0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}" xmlns="http://www.w3.org/2000/svg">`
  if (th2 - th1 >= 180)
    svg += `<path d="M ${x1} ${y1} A ${radius} ${radius} 0 1 1 ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
  else
    svg += `<path d="M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"/>`;
  svg += `</svg>`;
  return svg;
};

const PomodoroTimerModal = () => {
  const [time, setTime] = useState(new Date());
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(1500); // 25分 (1500秒)
  const [progressImage, setProgressImage] = useState();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const offset = -90.0;
    const th1 = offset + time.getMinutes() * 6.0 + time.getSeconds() * 0.1;
    const th2 = th1 + secondsLeft / 10.0;
    const strokeWidth = 4;
  
    const fgImage = "url(\"data:image/svg+xml;base64," + btoa(createSvg({
      th1: th1,
      th2: th2,
      radius: 76,
      color: "#3f51b5",
      strokeWidth: strokeWidth,
    })) + "\")";

    const bgImage = "url(\"data:image/svg+xml;base64," + btoa(createSvg({
      th1: 0,
      th2: 359.9999,
      radius: 76,
      color: "#d6d6d6",
      strokeWidth: strokeWidth,
    })) + "\")";

    setProgressImage(fgImage + "," + bgImage);
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
      <Box sx={{ position: 'relative', width: "160px", height: "160px" }}>
        {/* プログレスバー */}
        <Box sx={{
          position: 'absolute',
          top: "-4px",
          left: "-4px",
          width: "160px",
          height: "160px",
          backgroundImage: progressImage,
        }}>
          <Typography sx={{ textAlign: "center", mt: 12}}>{formatTime(secondsLeft)}</Typography>
        </Box>

        {/* アナログ時計 */}
        <Box sx={{ position: 'absolute', left: 1, top: 1}}>
          <Clock value={time} />
        </Box>
      </Box>

      {/* スタート・ストップボタン */}
      <Button
        variant="contained"
        color={isRunning ? 'secondary' : 'primary'}
        onClick={() => setIsRunning(!isRunning)}
        sx={{ mt: 3 }}
      >
        {isRunning ? '一時停止' : '開始'}
      </Button>

      {/* リセットボタン */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          setSecondsLeft(1500); // 25分にリセット
          setIsRunning(false);
        }}
        sx={{ mt: 2 }}
      >
        リセット
      </Button>
    </Box>
  );
};

export default PomodoroTimerModal;
