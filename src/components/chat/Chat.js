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
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // 메시지 리스트를 끝으로 스크롤
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 초기 메시지를 로드하는 함수
    const getChats = useCallback(async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/messages/period/${periodId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(response.data); // 초기 메시지를 받아오기
            scrollToBottom(); // 메시지를 로드한 후 스크롤을 하단으로 이동
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

            console.log(`Subscribing to ${subscriptionDestination}`);

            stomp.subscribe(subscriptionDestination, (frame) => {
                console.log('Message received:', frame.body);
                try {
                    const parsedMessage = JSON.parse(frame.body);
                    console.log('Parsed Message:', parsedMessage);

                    // 실시간으로 수신한 메시지를 상태에 추가
                    setMessages((prevMessages) => {
                        const updatedMessages = [...prevMessages, parsedMessage];
                        console.log('Updated Messages:', updatedMessages);
                        return updatedMessages;
                    });

                    // 메시지를 수신한 후 스크롤을 하단으로 이동
                    scrollToBottom();
                } catch (error) {
                    console.error('Message parsing error:', error);
                }
            });

            stomp.onStompError = (frame) => {
                console.error('STOMP Error:', frame);
            };
        };

        stomp.activate();
        getChats(); // 초기 메시지 로드
        setStompClient(stomp);

        return () => {
            if (stomp) {
                stomp.deactivate();
            }
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
            console.log('Message sent:', messageContent);

            // 메시지를 보낸 후 상태 업데이트
            setMessages((prevMessages) => {
                const newMessage = {
                    sender: authData.username,
                    content: messageContent,
                };
                const updatedMessages = [...prevMessages, newMessage];
                console.log('Updated Messages after send:', updatedMessages);
                return updatedMessages;
            });

            setInputMessage(''); // 메시지를 보낸 후 입력 필드를 초기화
            setTimeout(scrollToBottom, 0);
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
                <div ref={messagesEndRef} />
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
