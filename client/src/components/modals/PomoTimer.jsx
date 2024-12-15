import React, { useState, useReducer, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, ButtonGroup } from '@mui/material';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import 'react-circular-progressbar/dist/styles.css';
import './PomoTimer.css';
import CircularProgressBar from './CircularProgressBar';
import RatingModal from './RatingModal';

import { useSettings } from '../SettingsContext';
import axios from 'axios';

const SIZE = 280;
const STROKE_WIDTH = 4;

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

// 各MP3ファイルのURL
const audioFiles = [
  "mail1.mp3",
  "mail2.mp3",
];

let shouldPlaySound = false;

const PomoTimer = (props) => {
  const { taskId, onSubmit } = props;
  const { settings, loading } = useSettings();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [wakeLock, setWakeLock] = useState(null);

  const sound1 = new Audio(audioFiles[0]);
  const sound2 = new Audio(audioFiles[1]);

  // 状態一覧
  const STATES = {
    STOPPED: "Stopped",
    WORK: "Work",
    SHORT_BREAK: "ShortBreak",
    LONG_BREAK: "LongBreak",
    PAUSED: "Paused",
  };

  // アクション一覧
  const ACTIONS = {
    START: "start",
    PAUSE: "pause",
    RESUME: "resume",
    STOP: "stop",
    TIMER_TICK: "timerTick",
    TIMER_COMPLETE: "timerComplete",
  };

  // 初期状態
  const initialState = {
    startAngle: 0,
    endAngle: 0,
    progressColor: 'red',
    previousState: null,
    currentState: STATES.STOPPED,
    isRunning: false,
    workCount: 0,
    timeRemaining: settings.workTime * 60,
  };

  const [state, dispatch] = useReducer(timerReducer, initialState);

  function timerReducer(state, action) {
    switch (action.type) {
      case ACTIONS.START: {
        if (state.currentState === STATES.STOPPED) {
          sound1.play();
          shouldPlaySound = true;
          const startAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1;
          const endAngle = startAngle + state.timeRemaining * 0.1;
          return {
            ...state,
            startAngle: startAngle,
            endAngle: endAngle,
            progressColor: 'red',
            currentState: STATES.WORK,
            isRunning: true
          };
        }
        if (state.currentState === STATES.PAUSED) {
          sound1.play();
          shouldPlaySound = true;
          const startAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1;
          const endAngle = startAngle + state.timeRemaining * 0.1;
          return {
            ...state,
            startAngle: startAngle,
            endAngle: endAngle,
            currentState: state.previousState,
            isRunning: true
          };
        }
        if (state.isRunning) {
          return {
            ...state,
            currentState: STATES.PAUSED,
            isRunning: false,
            previousState: state.currentState
          };
        }
        return state;
      }

      case ACTIONS.STOP: {
        return {
          ...initialState
        };
      }

      case ACTIONS.TIMER_TICK: {
        if (state.timeRemaining > 0) {
          return {
            ...state,
            timeRemaining: state.timeRemaining - action.payload
          };
        }

        if (state.timeRemaining <= 0 && state.currentState === STATES.WORK) {
          if (shouldPlaySound) {
            sound2.play();
            shouldPlaySound = false;
          }

          if (!modalOpen) {
            setModalOpen(true); // WorkTime終了時にモーダルを表示
          }
        }

        if (state.timeRemaining > 0 || state.currentState === STATES.WORK) {
          return state;
        }
      }

      case ACTIONS.TIMER_COMPLETE: {
        if (state.currentState === STATES.WORK) {
          const nextState = state.workCount + 1 >= 4 ? STATES.LONG_BREAK : STATES.SHORT_BREAK;
          const timeRemaining = nextState === STATES.LONG_BREAK ? settings.longBreakTime * 60 : settings.shortBreakTime * 60;
          const startAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1;
          const endAngle = startAngle + timeRemaining * 0.1;
          return {
            ...state,
            startAngle: startAngle,
            endAngle: endAngle,
            progressColor: 'green',
            currentState: nextState,
            timeRemaining: timeRemaining,
            workCount: nextState === STATES.LONG_BREAK ? 0 : state.workCount + 1,
          };
        }
        if (state.currentState === STATES.SHORT_BREAK || state.currentState === STATES.LONG_BREAK) {
          sound1.play();
          shouldPlaySound = true;
          const timeRemaining = settings.workTime * 60;
          const startAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1;
          const endAngle = startAngle + timeRemaining * 0.1;
          return {
            ...state,
            startAngle: startAngle,
            endAngle: endAngle,
            progressColor: 'red',
            currentState: STATES.WORK,
            timeRemaining: timeRemaining
          };
        }
        return state;
      }

      default: {
        console.error("Unknown action type:", action.type);
        return state;
      }
    }
  }

  // requestAnimationFrame用の参照
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(null);

  // mainloop
  const timerLoop = () => {
    const elapsed = (performance.now() - lastTimeRef.current) / 1000; // 秒単位

    if (elapsed >= 1) {
      const secondsToDecrement = Math.floor(elapsed);
      dispatch({ type: ACTIONS.TIMER_TICK, payload: secondsToDecrement });
      lastTimeRef.current += secondsToDecrement * 1000; // 消費した時間分を調整
    }

    if (state.isRunning) {
      animationFrameRef.current = requestAnimationFrame(timerLoop);
    }
  };

  // Wake Lockを取得する関数
  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        const wakeLockObj = await navigator.wakeLock.request("screen");
        setWakeLock(wakeLockObj);
        console.log("Wake Lock acquired");
        wakeLockObj.addEventListener("release", () => {
          console.log("Wake Lock released");
        });
      } else {
        console.warn("Wake Lock API is not supported in this browser.");
      }
    } catch (err) {
      console.error("Failed to acquire Wake Lock:", err);
    }
  };

  // Wake Lockを解除する関数
  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
      console.log("Wake Lock manually released");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    // アナログ時計表示用
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // タスク情報取得
    axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
      withCredentials: true, // クッキーを含めるために必要
    }).then(res => {
      const taskData = res.data;
      setTitle(taskData.title);
      setDescription(taskData.description);
    }).catch(error => {
      if (error.status === 401 || error.status === 403) {
        navigate("/login");
      }
    });

    return () => clearInterval(timer);
  }, []);

  // タイマー開始・停止処理
  useEffect(() => {
    if (state.isRunning) {
      requestWakeLock();
      lastTimeRef.current = performance.now(); // タイマー開始時の基準時間を設定
      animationFrameRef.current = requestAnimationFrame(timerLoop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
    return () => {
      releaseWakeLock();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [state.isRunning]);

  const startPauseResume = () => dispatch({ type: ACTIONS.START });
  const stop = () => dispatch({ type: ACTIONS.STOP });
  const timerComplete = () => dispatch({ type: ACTIONS.TIMER_COMPLETE });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>

      <Typography color="textPrimary" variant='h5'>{title}</Typography>

      <Box sx={{ mt: 3, position: 'relative', width: SIZE + STROKE_WIDTH * 2, height: SIZE + STROKE_WIDTH * 2 }}>

        {/* プログレスバー */}
        <Box sx={{
          position: 'absolute',
          top: 1 - STROKE_WIDTH,
          left: 1 - STROKE_WIDTH,
          width: SIZE + STROKE_WIDTH * 2,
          height: SIZE + STROKE_WIDTH * 2
        }}>
          <CircularProgressBar
            startAngle={state.startAngle}
            endAngle={state.endAngle}
            visible={state.isRunning}
            color={state.progressColor}
          />
        </Box>

        {/* アナログ時計 */}
        <Box sx={{ position: 'absolute', left: 1, top: 1}}>
          <Clock value={time} size={SIZE} />
        </Box>
        <Typography variant="h5" sx={{ textAlign: "center", mt: '65%'}}>
          {formatTime(Math.floor(state.timeRemaining))}
        </Typography>
      </Box>

      <ButtonGroup variant="outlined" aria-label="Basic button group" sx={{ mt: 3 }}>
        {/* start/stop/resumeボタン */}
        <Button
          variant="contained"
          color={state.isRunning ? 'secondary' : 'primary'}
          onClick={startPauseResume}
        >
          {state.isRunning ? "Pause" : state.currentState === STATES.PAUSED ? "Resume" : "Start"}
        </Button>

        {/* Stopボタン */}
        <Button
          variant="outlined"
          color="primary"
          onClick={stop}
        >
          Stop
        </Button>

      </ButtonGroup>

      <Typography color='textSecondary' variant='subtitle1' sx={{ mt: 3 }}>{description}</Typography>

      <RatingModal open={modalOpen} onSubmit={timerComplete} handleClose={() => setModalOpen(false)} />

    </Box>
  );
}

export default PomoTimer;
