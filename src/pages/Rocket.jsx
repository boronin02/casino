import timer from './../img/Container.png';
import timerImg from './../img/timer.png';
import plus from './../img/plus.png';
import minus from './../img/minus.png';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const Rocket = () => {
    window.scrollTo(0, 0);

    const balance = useSelector((state) => state.balance.value);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [x, setX] = useState(1);
    const [crashed, setCrashed] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [crashPoint, setCrashPoint] = useState(1);
    const [ratios, setRatios] = useState([]);
    const [betMoney, setBetMoney] = useState(50);
    const socketRef = useRef(null);
    const [conclusions, setConclusions] = useState([]);

    useEffect(() => {
        // Установить соединение WebSocket
        socketRef.current = new WebSocket('ws://localhost:8000/ws/crash');

        socketRef.current.onopen = () => {
            console.log('WebSocket соединение установлено');
        };

        socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message)
            if (message.name === "crash") {
                if (message.result === "start") {
                    startRound();
                } else if (message.result === "stop") {
                    endRound();
                }
            }
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket ошибка:', error);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket соединение закрыто');
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const startRound = () => {
        if (balance <= 50) return;

        setCrashed(false);
        setX(1); // Сброс начального значения
        setGameStarted(true);
        setConclusions([])

        fetch('http://localhost:8000/api/game/bet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                bet_amount: betMoney,
            }),
        })
            .then(response => response.json())

        fetch('http://localhost:8000/api/game/crash/result', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const crash = data.crash_point;
                console.log(crash)
                setCrashPoint(crash);

                // Увеличиваем `x` до `crashPoint`
                const interval = setInterval(() => {
                    setX((prevX) => {
                        if (prevX >= crash) {
                            clearInterval(interval);
                            setCrashed(true);
                            setGameStarted(false); // Завершение игры
                            setRatios((prevRatios) => [
                                crash.toFixed(2),
                                ...prevRatios.slice(0, 9),
                            ]);
                            return prevX; // Останавливаем увеличение
                        }
                        return prevX + 0.01; // Увеличиваем `x`
                    });
                }, 10); // Увеличиваем каждые 10 мс
            })
            .catch((error) => console.error('Ошибка получения crashPoint:', error));
    };

    const collectWinnings = () => {
        setConclusions((prev) => [
            { ratio: x.toFixed(2), bet: betMoney },
            ...prev.slice(0, 19),
        ]);
        createGame();
    };

    const createGame = () => {
        if (!token || crashPoint === null) return;

        fetch('http://localhost:8000/api/game/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: 'Crash',
                bet_amount: parseFloat(betMoney),
                coefficient: parseFloat(x.toFixed(2)),
            }),
        })
            .then((response) => response.json())
            .catch((error) => console.log('Error creating game:', error));
    };

    const endRound = () => {
        setGameStarted(false);
        setCrashed(true);
    };

    const changeBet = (amount) => {
        setBetMoney((prev) => Math.max(50, Math.min(balance, prev + amount)));
    };



    return (
        <div className="rocket__container">
            <div className="rocket__content">
                <div className="rocket__left">
                    <div className="history__game">
                        <div className="all__game">Все</div>
                        <div className="my__game">Мои</div>
                    </div>
                    <div className="history__betting">
                        <div className="betting-top">
                            <div className="bettint-top-left">
                                <p className="total-bets">Всего ставок:</p>
                                <p className="total-count">26</p>
                            </div>
                            <div className="last-round">
                                <img src={timer} alt="timer" />
                                <p>Пред. раунд</p>
                            </div>
                        </div>
                        <div className="betting-main">
                            <ul className="history__list">
                                {conclusions.map(({ ratio, bet }, index) => (
                                    <li className="history__item" key={index}>
                                        <p className="name" style={{ width: '58px', color: '#948ac5' }}>Игрок</p>
                                        <p className="count" style={{ width: '60px', color: '#dfe5f2' }}>
                                            {bet}р
                                        </p>
                                        <div className="mult-btn" style={{ width: '83px', color: '#fff' }}>
                                            <p>{ratio}x</p>
                                        </div>
                                        <p className="amount" style={{ width: '58px', color: '#fdbb4e' }}>
                                            {(bet * ratio).toFixed(2)} ₽
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="rocket__center">
                    <div className="rocket__center-top">
                        <ul className="ratio">
                            {ratios.map((ratio, index) => (
                                <li className="ratio__item" key={index}>
                                    {ratio}
                                </li>
                            ))}
                        </ul>
                        <div className="timer__img">
                            <img src={timerImg} alt="timerImg" />
                        </div>
                    </div>
                    <div className="rocket__center-middle">
                        <p className="rocket__center-middle--text">
                            {x.toFixed(2)}
                        </p>
                    </div>
                    <div className="rocket__center-bottom">
                        <div className="rocket__center-bottom-btn">
                            <div className="bottom__btn-top"></div>
                            <div className="bottom__btn-bottom">
                                <div className="bottom__btn-bottom--left">
                                    <div className="top">
                                        <div
                                            onClick={() => changeBet(betMoney > 50 ? -10 : 0)}
                                            className="wrapper__img"
                                        >
                                            <img src={minus} alt="minus" />
                                        </div>
                                        <div className="btn-ratio">
                                            <input
                                                className="btn-ratio__text"
                                                type="number"
                                                value={betMoney}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value, 10) || 0;
                                                    setBetMoney(Math.max(50, Math.min(balance, value)));
                                                }}
                                                min="50"
                                            />
                                        </div>
                                        <div
                                            onClick={() => changeBet(10)}
                                            className="wrapper__img"
                                        >
                                            <img src={plus} alt="plus" />
                                        </div>
                                    </div>
                                    <div className="bottom">
                                        <div
                                            onClick={() => changeBet(-50)}
                                            className="wrapper__text"
                                        >
                                            -50
                                        </div>
                                        <div
                                            onClick={() => changeBet(-100)}
                                            className="wrapper__text"
                                        >
                                            -100
                                        </div>
                                        <div
                                            onClick={() => changeBet(50)}
                                            className="wrapper__text"
                                        >
                                            +50
                                        </div>
                                        <div
                                            onClick={() => changeBet(100)}
                                            className="wrapper__text"
                                        >
                                            +100
                                        </div>
                                    </div>
                                </div>
                                <div className="bottom__btn-bottom--right">
                                    <button
                                        onClick={() => {
                                            if (!gameStarted) startRound();
                                            else collectWinnings();
                                        }}
                                        className={`bottom__btn-bottom--action ${gameStarted ? 'end' : 'start'}`}
                                    >
                                        {gameStarted ? "Забрать" : "Сделать ставку"}
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rocket;
