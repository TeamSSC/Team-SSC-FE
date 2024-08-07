import React, { useEffect, useState, useRef } from 'react';
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
    useEffect(() => {
        const stomp = new Client({

            brokerURL: 'ws://3.38.181.152:8080/ws/init', // Ensure this is correct
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: 10000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
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
                    setMessages((prevMessages) => [...prevMessages, parsedMessage]);
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
        return () => {
            if (stomp) {
                stomp.deactivate();
            }
        };
    }, []);

    useEffect(() => {
        getChats();
    }, []);

    const sendMessage = () => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/app/chat.period.${periodId}`,
                body: JSON.stringify({ content: inputMessage }),
            });
            getChats();
            setInputMessage('');
        } else {
            console.error('WebSocket is not connected');
        }
    };

    const getChats = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/messages/period/${periodId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // console.log(response.data);
            setMessages(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div>
            <h1>{authData.periodId} 전체 채팅</h1>
            <div
                className={styles.chatList_wrapper}
                style={{ height: '200px', overflowY: 'scroll' }}
                ref={messagesContainerRef}
            >
                {messages.map((msg, index) => (
                    <div key={index}>
                        {msg.sender}: {msg.content}
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