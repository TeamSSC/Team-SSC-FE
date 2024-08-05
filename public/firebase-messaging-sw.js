importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: 'AIzaSyC0Ng53iV_EWCzsx6sskLUCpuQwBECx2z8',
    authDomain: 'team-ssc.firebaseapp.com',
    projectId: 'team-ssc',
    storageBucket: 'team-ssc.appspot.com',
    messagingSenderId: '271211309276',
    appId: '1:271211309276:web:61e7d84bc19a1be69b2c19',
    measurementId: 'G-X4RP5GZL9P',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
