importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// Récupère la configuration Firebase depuis les variables d'environnement
// Nous les récupérons directement depuis le SW car elles seront remplacées au build
firebase.initializeApp({
  apiKey: "REPLACE_AT_BUILD_TIME_API_KEY",
  authDomain: "REPLACE_AT_BUILD_TIME_AUTH_DOMAIN",
  projectId: "REPLACE_AT_BUILD_TIME_PROJECT_ID",
  storageBucket: "REPLACE_AT_BUILD_TIME_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_AT_BUILD_TIME_MESSAGING_SENDER_ID",
  appId: "REPLACE_AT_BUILD_TIME_APP_ID",
});

const messaging = firebase.messaging();

// Gère les messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gestion des clics sur notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Ajouter un comportement personnalisé au clic
  const urlToOpen = new URL('/dashboard', self.location.origin).href;
  
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    // Vérifier si une fenêtre existe déjà
    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i];
      // Si une fenêtre existe avec l'URL cible, focus dessus
      if (client.url === urlToOpen && 'focus' in client) {
        return client.focus();
      }
    }
    // Si aucune fenêtre ne correspond, ouvrir une nouvelle
    if (clients.openWindow) {
      return clients.openWindow(urlToOpen);
    }
  });
  
  event.waitUntil(promiseChain);
});
