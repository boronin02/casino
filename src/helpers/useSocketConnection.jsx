import { useEffect } from 'react';

const useSocketConnection = (url, onMessageCallback, onOpenCallback, onCloseCallback, onErrorCallback) => {
    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('WebSocket соединение установлено');
            if (onOpenCallback) onOpenCallback();
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (onMessageCallback) onMessageCallback(message);
        };

        socket.onerror = (error) => {
            console.error('WebSocket ошибка:', error);
            if (onErrorCallback) onErrorCallback(error);
        };

        socket.onclose = () => {
            console.log('WebSocket соединение закрыто');
            if (onCloseCallback) onCloseCallback();
        };

        // Cleanup WebSocket connection
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []); // Dependencies array is empty to run only once on mount
};

export default useSocketConnection;
