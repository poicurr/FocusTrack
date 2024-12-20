const express = require('express');
const router = express.Router();
const UserSubscription = require('../models/UserSubscription');
const authenticateToken = require('../middleware/authenticateToken');

const webpush = require('web-push');
const PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY;
const PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
  'mailto:poicurr@gmail.com',
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

async function sendNotification(subscription, payload) {
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}

// 購読登録
router.post('/subscribe', authenticateToken, async (req, res) => {
  const { subscription } = req.body;
  if (!subscription) return res.status(400).json({ error: 'Subscription is required' });

  const userId = req.user.id;
  await UserSubscription.findOneAndUpdate(
    { userId: userId },
    {
      endpoint: subscription.endpoint,
      keys: subscription.keys
    },
    { upsert: true }
  );
  res.json({ success: true });
});

// 購読解除
router.post('/unsubscribe', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  await UserSubscription.deleteOne({ userId: userId });
  res.json({ success: true });
});

// 数分後に通知を送信するスケジュール設定
router.post('/schedule', authenticateToken, async (req, res) => {
  const { minutes } = req.body;
  if (!minutes || isNaN(minutes) || minutes <= 0) {
    return res.status(400).json({ error: 'minutes must be a positive number' });
  }

  // DBからユーザーの購読情報を取得
  const userId = req.user.id;
  const userSub = await UserSubscription.findOne({ userId: userId });
  if (!userSub) {
    return res.status(400).json({ error: 'No subscription found for this user' });
  }

  // 本来はQueueやSchedulerを用いるべきですが、ここではsetTimeoutで簡易例示
  setTimeout(async () => {
    try {
      await sendNotification(
        {
          endpoint: userSub.endpoint,
          keys: {
            p256dh: userSub.keys.p256dh,
            auth: userSub.keys.auth
          }
        },
        {
          title: 'Scheduled Notification',
          body: 'Your scheduled notification has arrived!',
          icon: '/favicon.ico',
          url: '/' // 通知クリック時に焦点を当てるURL（クライアント側でフォーカス処理）
        }
      );
    } catch (err) {
      console.error('Failed to send push notification', err);
    }
  }, minutes * 60 * 1000);

  res.json({ success: true });
});

module.exports = router;
