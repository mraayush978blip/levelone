// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here and not any other Firebase modules.
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
// In production, these will match your Firebase Web App credentials
const firebaseConfig = {
  projectId: "levelone-54321",
  messagingSenderId: "704045017488",
};

try {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message: ', payload);

    const notificationTitle = payload.notification?.title || 'Levelone Notification';
    const notificationOptions = {
      body: payload.notification?.body || 'New announcement from Levelone',
      icon: '/icon-ninja-round.webp',
      badge: '/icon-ninja-round.webp',
      data: {
        url: payload.data?.url || '/student',
      },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || '/student';

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
    );
  });
} catch (e) {
  console.warn('[firebase-messaging-sw.js] Firebase SW initialization skipped or credentials pending', e);
}
