import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ isChatOpen, toggleChat }) => {
    const [messages, setMessages] = useState([]); // Список сообщений
    const [input, setInput] = useState(''); // Ввод пользователя
    const [status, setStatus] = useState('Отключено'); // Статус WebSocket
    const socketRef = useRef(null); // Ссылка на WebSocket
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:8000/chat', 'protocol', {
            headers: { 'Authorization': `Bearer ${token}`, }
        });

        //socketRef.current = new WebSocket(`ws://localhost:8000/api/chat?token=${token}`)

        socketRef.current.onopen = () => {
            console.log('WebSocket соединение установлено');
            setStatus('Подключено');
        };

        socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prev) => [...prev, message]);
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
    }, []);

    const sendMessage = () => {
        if (input.trim() && socketRef.current) {
            const message = { text: input, sender: 'user', timestamp: Date.now() };
            socketRef.current.send(JSON.stringify(message)); // Отправляем сообщение на сервер
            setMessages((prev) => [...prev, message]); // Отображаем отправленное сообщение
            setInput(''); // Очищаем поле ввода
        }
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
                            <span className="chat-text">{msg.text}</span>
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
