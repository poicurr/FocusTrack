// public/sw.js
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://example.com') // 通知クリック時の遷移先 URL
  );
});