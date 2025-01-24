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
                                <div className="slot__link">
                                    <img src={img1} alt="превью" />
                                    <p>Ракетка</p>
                                </div>
                            </li>
                        </NavLink>

                        <NavLink to='/slotWheel' style={{ textDecoration: 'none' }}>
                            <li className="slot">
                                <div style={{ textDecoration: 'none' }}>
                                    <img src={img1} alt="превью" />
                                    <p>Колесо (в разработке)</p>
                                </div>
                            </li>
                        </NavLink>

                        <NavLink to='/fruits' style={{ textDecoration: 'none' }}>
                            <li className="slot">
                                <div style={{ textDecoration: 'none' }}>
                                    <img src={img1} alt="превью" />
                                    <p>Фрукты</p>
                                </div>
                            </li>
                        </NavLink>
                    </ul>
                </div>
            </div>
        </main>

    );
};

export default Home;
