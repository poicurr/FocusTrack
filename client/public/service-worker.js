self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const { title, body, icon, url } = data;
    console.dir(data);
    const options = {
      body,
      icon: icon || '/favicon.ico',
      data: { url: url || '/' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // 既存タブに焦点を当てる
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // 見つからない場合、新しいタブを開く
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
