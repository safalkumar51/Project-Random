import { io } from 'socket.io-client';

export const socket = io('http://10.0.2.2:4167', {
    transports: ['websocket'],
    autoConnect: false,
});

export const initSocket = (authToken) => {
    if (!socket.connected) {
        socket.connect();
    }

    // Remove existing listener to avoid duplicate emissions
    socket.off('connect');

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        if (authToken) {
            socket.emit('join', authToken);
        } else {
            console.warn('No auth token found');
        }
    });
};
