import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import useAuthStore from '../../stores/useAuthStore';
import axios from 'axios';
import { baseUrl } from '../../config';
import styles from './Chat.module.scss';

const Chat = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const token = localStorage.getItem('accessToken');
    const { periodId } = useParams();
    const authData = useAuthStore();
    const messagesContainerRef = useRef(null);
    const [initialLoad, setInitialLoad] = useState(true); // 초기 로드 상태를 관리

    // 메시지 리스트를 끝으로 스크롤
    const scrollToBottom = (smooth = false) => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto',
            });
        }
    };

    // 초기 메시지를 로드하는 함수
    const getChats = useCallback(async (shouldScroll = false) => {
        try {
            const response = await axios.get(`${baseUrl}/api/messages/period/${periodId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data);

            // 초기 로드 시에만 스크롤을 맨 아래로 이동
            if (shouldScroll) {
                scrollToBottom();
            }
        } catch (err) {
            console.error(err);
        }
    }, [periodId, token]);

    // WebSocket 설정 및 메시지 수신
    useEffect(() => {
        const stomp = new Client({
            brokerURL: 'wss://teamssc.site/wss/init',
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 5000,
            heartbeatOutgoing: 5000,
        });

        stomp.onConnect = () => {
            console.log('WebSocket connection opened.');
            const subscriptionDestination = `/topic/chat.period.${periodId}`;

            stomp.subscribe(subscriptionDestination, (frame) => {
                try {
                    const parsedMessage = JSON.parse(frame.body);
                    setMessages((prevMessages) => {
                        return [...prevMessages, parsedMessage];
                    });
                } catch (error) {
                    console.error('Message parsing error:', error);
                }
            });

            stomp.onStompError = (frame) => {
                console.error('STOMP Error:', frame);
            };
        };

        stomp.activate();
        setStompClient(stomp);

        // 초기 메시지 로드 시 스크롤을 맨 아래로 이동
        getChats(true);

        // 1초마다 메시지를 가져오지만 스크롤은 움직이지 않도록 설정
        const intervalId = setInterval(() => {
            getChats(false); // 이후 주기적 호출 시에는 스크롤을 건드리지 않음
        }, 1000);

        return () => {
            if (stomp) {
                stomp.deactivate();
            }
            clearInterval(intervalId);
        };
    }, [periodId, token, getChats]);

    // 메시지를 전송하는 함수
    const sendMessage = () => {
        if (stompClient && stompClient.connected) {
            const messageContent = inputMessage;
            stompClient.publish({
                destination: `/app/chat.period.${periodId}`,
                body: JSON.stringify({ content: messageContent }),
            });

            setMessages((prevMessages) => {
                const newMessage = {
                    sender: authData.username,
                    content: messageContent,
                };
                setTimeout(() => scrollToBottom(true), 0); // 메시지 보낸 후 스크롤
                return [...prevMessages, newMessage];
            });

            setInputMessage(''); // 메시지를 보낸 후 입력 필드를 초기화
        } else {
            console.error('WebSocket is not connected');
        }
    };

    return (
        <div>
            <h1>{authData.periodId} 전체 채팅</h1>
            <div
                className={styles.chatList_wrapper}
                style={{ height: '400px', overflowY: 'scroll' }}
                ref={messagesContainerRef}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`${styles.chatMessage} ${
                            msg.sender === authData.username ? styles.sender : styles.receiver
                        }`}
                    >
                        <div className={styles.messageHeader}>{msg.sender}</div>
                        <div
                            className={`${styles.chatBubble} ${
                                msg.sender === authData.username ? styles.sender : styles.receiver
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                <div className={styles.chat_wrapper}>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="채팅을 입력하세요..."
                    />
                    <button type="submit">보내기</button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
