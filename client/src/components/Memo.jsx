import React from 'react';

const Memo = () => {
  const scheduleNotification = async () => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      // 通知の許可をリクエスト
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('通知が許可されていません');
        return;
      }

      // Service Worker の登録
      const registration = await navigator.serviceWorker.register('/sw.js');

      // 通知スケジュール設定
      registration.showNotification('リマインダー', {
        body: '1分が経過しました！',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA\nAAAAFCAYAAACXU8ZrAAAAGElEQVQYV2NkQAIYBaNgFIygRQUwAAAKAAG9JwcSAAAAAElFTkSuQmCC',
        timestamp: Date.now() + 1 * 60 * 1000
      });
    } else {
      alert('このブラウザは通知機能をサポートしていません');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>1分後に通知</h1>
      <button onClick={scheduleNotification}>通知をスケジュール</button>
    </div>
  );
};

export default Memo;