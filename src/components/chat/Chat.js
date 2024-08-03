import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import useAuthStore from '../../stores/useAuthStore';

const Chat = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const token = localStorage.getItem('accessToken');
    const { periodId } = useParams();
    const authData = useAuthStore();

    useEffect(() => {
        const stomp = new Client({
            brokerURL: 'ws://43.202.54.250:8080/chat', // Ensure this is correct
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stomp.onConnect = () => {
            console.log('WebSocket connection opened.');
            const subscriptionDestination = `/topic/period/${periodId}`;
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
    }, [periodId]); // Dependencies to recreate effect when token or periodId changes

    const sendMessage = () => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/ws/init/chat/period/${periodId}`,
                body: JSON.stringify({ content: inputMessage }),
            });
            setInputMessage('');
        } else {
            console.error('WebSocket is not connected');
        }
    };

    return (
        <div>
            <h1>{authData.periodId} 전체 채팅</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        {msg.sender}: {msg.content}
                    </div>
                ))}
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
