import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// 환경 변수에서 Firebase 설정 정보 가져오기
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// FCM 초기화
const messaging = getMessaging(app);

// VAPID Key
const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;

// FCM 토큰 요청 함수
export const requestFirebaseNotificationPermission = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: vapidKey });
        console.log('FCM Token:', token);
        return token;
    } catch (err) {
        console.error('Unable to get permission to notify.', err);
        throw err;
    }
};

// 메시지 리스너 설정
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
