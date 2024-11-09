import React, { useState, useEffect, useRef } from "react";
import "./CircularProgressBar.css";

const INNER_DIAMETER = 280; // 内径
const STROKE_WIDTH = 4; // 線幅
const RADIUS = INNER_DIAMETER / 2; // 半径
const SIZE = INNER_DIAMETER + STROKE_WIDTH * 2; // SVG全体のサイズ
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // 円周の長さ
const DURATION = 1200; // アニメーションの合計時間（ミリ秒）

function CircularProgressBar({ startAngle = -90, endAngle = 270 }) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const requestRef = useRef(null);
  const startTimeRef = useRef(null);

  const startAnimation = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
    requestRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    setIsRunning(false);
    cancelAnimationFrame(requestRef.current);
    requestRef.current = null;
  };

  const animate = () => {
    const elapsed = Date.now() - startTimeRef.current;
    const newProgress = Math.min(elapsed / DURATION, 1);
    setProgress(newProgress);

    if (newProgress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setIsRunning(false);
    }
  };

  const toggleAnimation = () => {
    if (isRunning) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  const totalAngle = endAngle - startAngle;
  const dashOffset = CIRCUMFERENCE * (1 - progress * (totalAngle / 360));

  return (
    <div className="timer-container">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* 背景の円 */}
        <circle
          className="timer-background"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
        />
        {/* 前景の円（進行状況に応じて更新） */}
        <circle
          className="timer-progress"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          style={{
            strokeDashoffset: dashOffset,
            transform: `rotate(${startAngle}deg)`,
          }}
        />
      </svg>
      <button onClick={toggleAnimation}>
        {isRunning ? "Stop" : "Start"}
      </button>
    </div>
  );
}

export default CircularProgressBar;