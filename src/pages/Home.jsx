import React, { useState } from "react";
import "./../index.css";

import person from "./../img/person.png";
import img1 from "./../img/02.jpg";

import { NavLink } from "react-router-dom";

const Home = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className={`home-container ${isChatOpen ? "chat-open" : ""}`}>
            <main>
                <div className="main-container">
                    <div className="main__content">
                        <p>
                            Наша задача - это разными схемами обмануть это{" "}
                            <span style={{ color: "#5C62EC" }}>грёбаное</span> казино и заработать деньги. Мы не рискуем, мы не входим в азарт. Поставили,{" "}
                            <span style={{ color: "#5C62EC" }}>забрали</span>
                        </p>
                        <img src={person} alt="человек летает" />
                    </div>
                </div>

                <div className="game-container">
                    <div className="game-content">
                        <h1 id="Game" className="game__header">Игры</h1>
                        <ul className="slots">
                            <NavLink to='/rocket' style={{ textDecoration: 'none' }}>
                                <li className="slot">
                                    <a className="slot__link">
                                        <img src={img1} alt="превью" />
                                        <p>Ракетка</p>
                                    </a>
                                </li>
                            </NavLink>

                            <li className="slot">
                                <a href="/" style={{ textDecoration: 'none' }}>
                                    <img src={img1} alt="превью" />
                                    <p>Не ракетка</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </main>

            {/* Кнопка открытия чата */}
            <button className="chat-toggle" onClick={toggleChat}>
                {isChatOpen ? "Закрыть чат" : "Открыть чат"}
            </button>

            {/* Контейнер чата */}
            <div className="chat-container">
                <div className="chat-header">
                    <h2>Чат</h2>
                </div>
                <div className="chat-content">
                    {/* Здесь будет содержимое чата */}
                    <p>Добро пожаловать в чат!</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
