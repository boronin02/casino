import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ isChatOpen, toggleChat }) => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('Отключено');
    const socketRef = useRef(null);
    const token = localStorage.getItem('token') || null;

    useEffect(() => {
        if (!token) return;

        socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat?token=${token}`);

        socketRef.current.onopen = () => {
            console.log('WebSocket соединение установлено');
            setStatus('Подключено');
        };

        socketRef.current.onmessage = (event) => {
            try {
                const rawMessage = JSON.parse(event.data);

                if (rawMessage.message) {
                    const parsedMessage = JSON.parse(rawMessage.message);
                    const fullAvatarUrl = `http://localhost:8000${rawMessage.avatar_url}`;
                    const message = {
                        name: rawMessage.name,
                        avatar_url: fullAvatarUrl,
                        ...parsedMessage,
                    };

                    setMessages((prev) => {
                        const updatedMessages = [...prev, message].slice(-15);
                        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
                        return updatedMessages;
                    });
                }
            } catch (error) {
                console.error('Ошибка парсинга сообщения:', error);
            }
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket соединение закрыто');
            setStatus('Отключено');
        };

        socketRef.current.onerror = (error) => {
            console.error('Ошибка WebSocket:', error);
            setStatus('Ошибка');
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [token]);

    const sendMessage = () => {
        if (!input.trim() || !socketRef.current || status !== 'Подключено') return;

        const message = {
            text: input,
            event: 'message',
            id: Date.now(),
            sender: 'user',
        };

        socketRef.current.send(JSON.stringify(message));

        setInput('');
    };

    return (
        <div className={`chat-container ${isChatOpen ? 'open' : ''}`}>
            <div className="chat-header">
                <h2>Чат</h2>
                <span className={`status ${status === 'Подключено' ? 'online' : 'offline'}`}>
                    {status}
                </span>
            </div>
            <div className="chat-content">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user' : 'server'}`}>
                            <img src={msg.avatar_url} alt={msg.name} className="avatar" />
                            <div className="mess">
                                <span className="chat-username">{msg.name}</span>
                                <span className="chat-text">{msg.text}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Введите сообщение..."
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage}>Отправить</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
