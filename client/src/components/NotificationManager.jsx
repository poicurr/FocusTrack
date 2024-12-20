import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';

// .envファイルなどで設定されたAPIエンドポイントを利用する想定
//const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';
const API_BASE = 'http://localhost:5000';

function NotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [minutes, setMinutes] = useState('1');

  const vapidPublicKey = "BF7zmA3qDrJUOUU2OI5klQ--FxhR2U8Vuh9CPs2pHkRyUjRzLCLu0tqBkA8RWuITQmqruaKOzbJOKD_ZP-Edegc";

  // Service Worker登録
  useEffect(() => {
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.type === 'PLAY_SOUND') {
        playSound();
      }
    });
  }, []);

  async function playSound() {
    const audio = new Audio('./mail2.mp3');
    audio.play().catch(err => console.error(err));
  }

  async function subscribeToPush() {
    if (!('serviceWorker' in navigator)) {
      alert('Service Worker not supported');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    // サーバに購読情報送信
    await axios.post(`${API_BASE}/api/push/subscribe`, { subscription }, {
      withCredentials: true, // クッキーを含めるために必要
    });

    setIsSubscribed(true);
    alert('Subscribed to push notifications');
  }

  async function unsubscribeFromPush() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      await axios.post(`${API_BASE}/api/push/unsubscribe`, {}, {
        withCredentials: true, // クッキーを含めるために必要
      });
      setIsSubscribed(false);
      alert('Unsubscribed from push notifications');
    }
  }

  async function scheduleNotification() {
    if (!minutes || isNaN(minutes)) {
      alert('Please enter a valid number of minutes');
      return;
    }
    await axios.post(`${API_BASE}/api/push/schedule`, { minutes: parseInt(minutes, 10) }, {
      withCredentials: true, // クッキーを含めるために必要
    });
    alert('Notification scheduled');
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Push Notification Demo</h1>
      {!isSubscribed ? (
        <Button variant="contained" color="primary" onClick={subscribeToPush}>
          購読
        </Button>
      ) : (
        <Button variant="contained" color="secondary" onClick={unsubscribeFromPush}>
          購読解除
        </Button>
      )}

      <div style={{ marginTop: 20 }}>
        <TextField
          label="Minutes after which notification will arrive"
          value={minutes}
          onChange={e => setMinutes(e.target.value)}
          type="number"
        />
        <Button variant="contained" style={{ marginLeft: 10 }} onClick={scheduleNotification}>
          通知予約
        </Button>
      </div>
    </div>
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export default NotificationManager;
