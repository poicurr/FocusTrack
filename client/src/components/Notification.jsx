import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// WebSocketサーバーに接続
const socket = io('http://localhost:8080');

const NotificationDemo = () => {
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useState('');
  const [sms, setSms] = useState('');
  
  useEffect(() => {
    // WebSocketからのメッセージを受け取る
    socket.on('message', message => {
      showInAppNotification(message);
      triggerVibration(); // 通知が来た時にバイブレーション
      playSound(); // 通知音
      changeTabTitle('🔔 New Notification');
    });

    // プッシュ通知の許可を求める
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    // コンポーネントがマウントされたときにサウンド用のオーディオをロード
    const audio = new Audio('/notification_sound.mp3');
    setNotificationSound(audio);
    
    // クリーンアップでタイトルを元に戻す
    return () => {
      document.title = 'Notification Demo';
    };
  }, []);

  // アプリ内通知を表示する関数
  const showInAppNotification = (message) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000); // 5秒後に消す
  };

  // ブラウザのプッシュ通知を表示する関数
  const showPushNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Push Notification', {
        body: 'This is a push notification!',
        icon: '/icon.png',
      });
      triggerVibration(); // プッシュ通知の時にバイブレーションを作動
      playSound(); // プッシュ通知で音を鳴らす
      changeTabTitle('🔔 Push Notification');
    } else {
      alert('プッシュ通知が許可されていません');
    }
  };

  // バイブレーションを作動させる関数
  const triggerVibration = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]); // 200ms振動し、100ms停止し、再び200ms振動
    } else {
      console.log('Vibration APIはサポートされていません');
    }
  };

  // サウンド通知
  const [notificationSound, setNotificationSound] = useState(null);
  const playSound = () => {
    if (notificationSound) {
      notificationSound.play();
    }
  };

  // タイトル変更
  const changeTabTitle = (title) => {
    document.title = title;
    setTimeout(() => {
      document.title = 'Notification Demo'; // 5秒後に元に戻す
    }, 5000);
  };

  // ダイアログ通知
  const showDialogNotification = () => {
    alert('これはアラート通知です！');
  };

  // 背景色を変更する
  const changeBackgroundColor = () => {
    document.body.style.backgroundColor = '#f0e68c'; // 黄色
    setTimeout(() => {
      document.body.style.backgroundColor = ''; // 元に戻す
    }, 5000);
  };

  // メール通知の送信（擬似的に）
  const sendEmailNotification = () => {
    alert(`メール通知が ${email} に送信されました。`);
    setEmail(''); // フォームをリセット
  };

  // SMS通知の送信（擬似的に）
  const sendSmsNotification = () => {
    alert(`SMS通知が ${sms} に送信されました。`);
    setSms(''); // フォームをリセット
  };

  return (
    <div>
      <h1>通知デモページ</h1>

      <section>
        <h2>ブラウザのプッシュ通知</h2>
        <button onClick={showPushNotification}>プッシュ通知を送信</button>
      </section>

      <section>
        <h2>WebSocket通知</h2>
        <p>WebSocketからのメッセージが届くとアプリ内通知が表示され、バイブレーション、音、タブタイトル変更が作動します。</p>
        <div id="notifications">
          {notifications.map((notification, index) => (
            <div key={index} className="notification">{notification}</div>
          ))}
        </div>
      </section>

      <section>
        <h2>アラートダイアログ通知</h2>
        <button onClick={showDialogNotification}>アラートダイアログを表示</button>
      </section>

      <section>
        <h2>背景色変更による通知</h2>
        <button onClick={changeBackgroundColor}>背景色を変更</button>
      </section>

      <section>
        <h2>メール通知</h2>
        <input 
          type="email" 
          value={email} 
          placeholder="メールアドレスを入力" 
          onChange={e => setEmail(e.target.value)} 
        />
        <button onClick={sendEmailNotification}>メールを送信</button>
      </section>

      <section>
        <h2>SMS通知</h2>
        <input 
          type="text" 
          value={sms} 
          placeholder="電話番号を入力" 
          onChange={e => setSms(e.target.value)} 
        />
        <button onClick={sendSmsNotification}>SMSを送信</button>
      </section>

      <style jsx>{`
        .notification {
          padding: 10px;
          background-color: lightblue;
          border: 1px solid blue;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default NotificationDemo;
