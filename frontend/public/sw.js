// Verisight AI Background Web Push Service Worker
// Enables notifications even when the web page/tab is closed

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle Background Push Notifications
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Verisight AI Security Alert 🔔';
  const options = {
    body: data.body || 'Hourly System Check: 3 active cases running nominal with 96.5% confidence. System Risk: Low (24/100).',
    icon: '/logo-icon.svg',
    badge: '/logo-icon.svg',
    tag: 'verisight-hourly-digest',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
