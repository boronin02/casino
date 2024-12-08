import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Nav from './components/Nav/Nav';
import Transaction from './pages/Transaction';
import Home from './pages/Home';
import Footer from './components/Footer/Footer';
import Rocket from './pages/Rocket';
import Account from './pages/Account';
import Chat from './components/Chat/Chat';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    console.log("Чат открыт:", !isChatOpen); // Отладочная строка
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <Router>
        <div className={`app-container ${isChatOpen ? 'chat-open' : ''}`}>
          <Nav />
          <Routes>
            <Route path="/transaction" element={<Transaction />} />
            <Route path='/' element={<Home />} />
            <Route path='/rocket' element={<Rocket />} />
            <Route path='/account' element={<Account />} />
          </Routes>
          <Footer />


          <button className="chat-toggle" onClick={toggleChat}>
            {isChatOpen ? "Закрыть чат" : "Открыть чат"}
          </button>

          <Chat isChatOpen={isChatOpen} toggleChat={toggleChat} />
        </div>
      </Router>
    </>
  );
}

export default App;
