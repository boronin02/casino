import "./../index.css"

import person from "./../img/person.png"
import img1 from "./../img/02.jpg"

import { NavLink } from "react-router-dom"

const Home = () => {
    return (
        <>
            <main>
                <div className="main-container">
                    <div className="main__content">
                        <p>Наша задача - это разными схемами обмануть это <span style={{
                            color: '#5C62EC'
                        }}>грёбаное</span> казино и заработать деньги. Мы не рискуем, мы не входим в азарт. Поставили, <span style={{ color: '#5C62EC' }}>забрали</span>.</p>
                        <img src={person} alt="человек летает" />
                    </div>
                </div>

                <div className="game-container">
                    <div className="game-content">
                        <h1 id="Game" className="game__header">Игры</h1>
                        <ul className="slots">
                            <NavLink to='/rocket'>
                                <li className="slot">
                                    <a>
                                        <img src={img1} alt="превью" />
                                        <p>Ракетка</p>
                                    </a>
                                </li>
                            </NavLink>

                            <li className="slot">
                                <a href="/">
                                    <img src={img1} alt="превью" />
                                    <p>Не ракетка</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </main >
        </>
    );
}

export default Home;