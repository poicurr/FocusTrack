import React, { useState, useEffect, useRef } from "react";

const CountdownAnimation = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration); // 残り時間
  const [progress, setProgress] = useState(100); // アニメーションの進捗率 (0 ~ 100)
  const requestIdRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const startCountdown = () => {
      startTimeRef.current = Date.now();

      const update = () => {
        const elapsedTime = (Date.now() - startTimeRef.current) / 1000; // 経過時間 (秒)
        const remainingTime = Math.max(duration - elapsedTime, 0); // 残り時間
        setTimeLeft(remainingTime.toFixed(1)); // 小数点以下1桁まで表示
        setProgress((remainingTime / duration) * 100); // 進捗率を更新

        if (remainingTime > 0) {
          requestIdRef.current = requestAnimationFrame(update); // 次のフレームをスケジュール
        }
      };

      requestIdRef.current = requestAnimationFrame(update);
    };

    startCountdown(); // カウントダウン開始

    return () => {
      cancelAnimationFrame(requestIdRef.current); // クリーンアップ時に停止
    };
  }, [duration]);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>Countdown: {timeLeft}s</h1>
      <div
        style={{
          height: "30px",
          width: "300px",
          border: "1px solid #000",
          margin: "20px auto",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            backgroundColor: "green",
            transition: "width 0.1s linear",
          }}
        ></div>
      </div>
    </div>
  );
};

export default CountdownAnimation;
