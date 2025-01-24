import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import './App.css';
import Nav from './components/Nav/Nav';
import Transaction from './pages/Transaction';
import Home from './pages/Home';
import Footer from './components/Footer/Footer';
import Rocket from './pages/Rocket';
import Account from './pages/Account';
import Chat from './components/Chat/Chat';
import SlotWheel from './pages/SlotWheel';
import Fruits from './pages/Fruits';

// Создаем контекст для WebSocket
export const WebSocketContext = createContext(null);

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [socket, setSocket] = useState(null);
  const [socketWheel, setSocketWheel] = useState(null)

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/crash');
    const wsWheel = new WebSocket('ws://localhost:8000/ws/wheel');

    ws.onopen = () => {
      console.log('WebSocket соединение установлено');
    };

    wsWheel.onopen = () => {
      //console.log('WebSocket wheel соединение установлено');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Получено сообщение:', message);
    };

    wsWheel.onmessage = (event) => {
      const messageWheel = JSON.parse(event.data);
      //console.log('Получено сообщение wheel:', messageWheel);
    };

    ws.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
    };

    wsWheel.onerror = (error) => {
      //console.error('WebSocket wheel ошибка:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket соединение закрыто');
    };

    wsWheel.onclose = () => {
      //console.log('WebSocket wheel соединение закрыто');
    };

    setSocket(ws);
    setSocketWheel(wsWheel); // Устанавливаем второй сокет

    // Закрываем оба соединения при размонтировании
    return () => {
      ws.close();
      wsWheel.close();
    };
  }, []);


  return (<>

    <WebSocketContext.Provider value={{ socket, socketWheel }}>
      <Router future={{ v7_relativeSplatPath: true }}>
        <div className={`app-container ${isChatOpen ? 'chat-open' : ''}`}>
          <Nav />
          <Routes>
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/" element={<Home />} />
            <Route path="/rocket" element={<Rocket />} />
            <Route path="/account" element={<Account />} />
            <Route path='/slotWheel' element={<SlotWheel />} />
            <Route path='/fruits' element={<Fruits />} />
          </Routes>
          <Footer />

          {token && (
            <button className="chat-toggle" onClick={toggleChat}>
              {isChatOpen ? "Закрыть чат" : "Открыть чат"}
            </button>
          )}

          <Chat isChatOpen={isChatOpen} toggleChat={toggleChat} />
        </div>
      </Router>
    </WebSocketContext.Provider>

  </>
  );
}

export default App;
