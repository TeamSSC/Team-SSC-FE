import React, { useEffect, useState } from 'react';
import { requestFirebaseNotificationPermission, onMessageListener } from '../../firebase';
import axios from 'axios';
import { baseUrl } from '../../config';

const Alarm = () => {
    const [notification, setNotification] = useState({ title: '', body: '' });
    const [targetToken, setTargetToken] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [fcmToken, setFcmToken] = useState('');

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        // FCM 토큰 요청
        requestFirebaseNotificationPermission()
            .then((token) => {
                console.log('FCM Token:', token);
                setFcmToken(token);
                // 여기에서 토큰을 서버로 보내 저장할 수 있습니다.
            })
            .catch((err) => {
                console.error('FCM 토큰 요청 실패:', err);
            });

        // 메시지 수신 리스너 설정
        onMessageListener()
            .then((payload) => {
                console.log('알림 수신:', payload);
                setNotification({
                    title: payload.notification.title,
                    body: payload.notification.body,
                });
            })
            .catch((err) => console.error('메시지 수신 실패:', err));
    }, []);

    const postAlarm = async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/api/notifications/message/period/${1}`,
                {
                    content: 'content',
                },
                { headers: { Authorization: `Bearer ${token}` }, fcmToken: fcmToken }
            );
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1>React FCM Notification</h1>

            <button onClick={() => postAlarm()}></button>

            {notification.title && (
                <div>
                    <h2>{notification.title}</h2>
                    <p>{notification.body}</p>
                </div>
            )}
        </div>
    );
};

export default Alarm;
