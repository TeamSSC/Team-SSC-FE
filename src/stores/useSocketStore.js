// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';
// import create from 'zustand';

// const useSocketStore = create((set) => {
//     let stompClient;

//     return {
//         messages: [],
//         connect: (url) => {
//             const socket = new SockJS(url);
//             stompClient = Stomp.over(socket);
//             stompClient.connect(
//                 {},
//                 (frame) => {
//                     console.log('Connected: ' + frame);

//                     stompClient.subscribe('/topic/messages', (message) => {
//                         console.log('Received message:', message.body);
//                         const messageContent = JSON.parse(message.body);
//                         set((state) => ({
//                             messages: [...state.messages, messageContent],
//                         }));
//                     });
//                 },
//                 (error) => {
//                     console.error('WebSocket connection error:', error);
//                 }
//             );
//         },
//         sendMessage: (destination, message) => {
//             if (stompClient && stompClient.connected) {
//                 const payload = JSON.stringify(message);
//                 console.log('Sending message:', payload);
//                 stompClient.send(destination, {}, payload);
//             } else {
//                 console.error('WebSocket is not connected');
//             }
//         },
//         disconnect: () => {
//             if (stompClient) {
//                 stompClient.disconnect(() => {
//                     console.log('Disconnected from WebSocket');
//                 });
//             }
//         },
//     };
// });

// export default useSocketStore;
