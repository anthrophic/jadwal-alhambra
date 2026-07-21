importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyCoO_viP4_7CjDRJIK-f4wOfkgZgM-2ab8",
  authDomain:        "jadwal-alhambra.firebaseapp.com",
  databaseURL:       "https://jadwal-alhambra-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "jadwal-alhambra",
  storageBucket:     "jadwal-alhambra.firebasestorage.app",
  messagingSenderId: "268642441303",
  appId:             "1:268642441303:web:0e851cdd27daf4d1a36b12"
});

const messaging = firebase.messaging();

// Handle notifikasi saat app TIDAK terbuka (background/closed)
messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(
    payload.notification?.title || 'Jadwal Kerja Alhambra',
    {
      body: payload.notification?.body || '🗓️ Jadwal minggu ini sudah diperbarui!',
      icon: '/jadwal-alhambra/alhambra.png',
    }
  );
});

// ── Terima perintah dari admin.html untuk panggil GAS ──────
// Service worker bisa fetch cross-origin tanpa CORS issue
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CALL_GAS') {
    fetch(event.data.url, { mode: 'no-cors' })
      .then(() => {
        if (event.source) event.source.postMessage({ type: 'GAS_OK' });
      })
      .catch(e => {
        if (event.source) event.source.postMessage({ type: 'GAS_ERROR', msg: e.toString() });
      });
  }
});
