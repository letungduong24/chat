import { useDispatch } from 'react-redux';
import { setOnlineUsers } from '../redux/slices/messageSlice';
import { io } from 'socket.io-client';

let socket = null;

export const useSocket = (userId) => {
    const dispatch = useDispatch();

    if (!socket || !socket.connected) {
        socket = io(import.meta.env.VITE_SERVER_URL, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            query: { userId }
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('getOnlineUsers', (userIds) => {
            console.log('Online Users:', userIds);
            dispatch(setOnlineUsers(userIds)); 
        });
    }

    return () => {
        if (socket) {
            socket.disconnect();
            console.log('🔌 Socket đã ngắt kết nối');
            socket = null;
        }
    };
};
