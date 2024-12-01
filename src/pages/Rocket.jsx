import timer from './../img/Container.png';
import timerImg from './../img/timer.png';
import plus from './../img/plus.png';
import minus from './../img/minus.png';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const Rocket = () => {

    const balance = useSelector((state) => state.balance.value);

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [x, setX] = useState(1);
    const [crashed, setCrashed] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [crashPoint, setCrashPoint] = useState(null);
    const [ratios, setRatios] = useState([]);
    const [betMoney, setBetMoney] = useState(
        parseInt(localStorage.getItem("betMoney"), 10) || 50
    );
    const gameTimeout = useRef(null);
    const [conclusions, setConclusions] = useState([])

    const startGame = () => {
        clearTimeout(gameTimeout.current);
        setCrashed(false);
        setX(1);
        setCrashPoint(null);

        // Отправляем ставку
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
            .then((response) => response.json())
            .then(() => {
                // Получаем crash_point
                return fetch('http://localhost:8000/api/game/crash/result', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
            })
            .then((response) => response.json())
            .then((data) => {
                setCrashPoint(data.crash_point);
                setGameStarted(true);

                gameTimeout.current = setTimeout(() => {
                    setCrashed(true);
                    setRatios((prevRatios) => [
                        data.crash_point.toFixed(2),
                        ...prevRatios.slice(0, 9),
                    ]);
                }, data.crash_point * 1000);
            })
            .catch((error) => console.log('Error fetching crash result:', error));
    };

    const endGame = () => {
        setConclusions((prevConclusions) => [
            x.toFixed(2),
            ...prevConclusions.slice(0, 15),
        ]);
    }

    // Обновляем коэффициент x в процессе игры
    useEffect(() => {
        if (!gameStarted || crashed || crashPoint === null) return;

        let startTime = null; // Начальное время анимации
        const totalDuration = crashPoint * 1000; // Общее время до crashPoint

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp; // Устанавливаем стартовое время
            const elapsed = timestamp - startTime; // Время, прошедшее с начала

            // Расчёт нового значения x
            const progress = Math.min(elapsed / totalDuration, 1); // От 0 до 1
            const nextX = 1 + progress * (crashPoint - 1); // Интерполяция от 1 до crashPoint

            setX(nextX);

            // Останавливаем анимацию, если достигли crashPoint
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCrashed(true);
            }
        };

        // Запускаем анимацию
        const animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId); // Чистим при размонтировании
    }, [gameStarted, crashed, crashPoint]);




    // Синхронизация баланса с локальным хранилищем
    useEffect(() => {
        localStorage.setItem('betMoney', betMoney);
    }, [betMoney]);

    // Создание игры
    useEffect(() => {
        if (!token || crashPoint === null) return;

        fetch('http://localhost:8000/api/game/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: 'crash',
                coefficient: crashPoint,
                bet_amount: betMoney,
            }),
        })
            .then((response) => response.json())
            .catch((error) => console.log('Error creating game:', error));
    }, [token, crashPoint]);

    const changeBet = (amount) => {
        setBetMoney((prev) => Math.max(0, prev + amount));
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
                                {conclusions.map((ratio, index) => (
                                    <li className="history__item" key={index}>
                                        <p
                                            className="name"
                                            style={{
                                                width: '58px',
                                                color: '#948ac5',
                                            }}
                                        >
                                            Игрок
                                        </p>
                                        <p
                                            className="count"
                                            style={{
                                                width: '60px',
                                                color: '#dfe5f2',
                                            }}
                                        >
                                            500р
                                        </p>
                                        <div
                                            className="mult-btn"
                                            style={{
                                                width: '83px',
                                                color: '#fff',
                                            }}
                                        >
                                            <p>{ratio}x</p>
                                        </div>
                                        <p
                                            className="amount"
                                            style={{
                                                width: '58px',
                                                color: '#fdbb4e',
                                            }}
                                        >
                                            1735 ₽
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
                            {crashed ? crashPoint.toFixed(2) : x.toFixed(2)}
                        </p>
                    </div>

                    <div className="rocket__center-bottom">
                        <div className="rocket__center-bottom-btn">
                            <div className="bottom__btn-top">
                                <div className="btn-top--text">
                                    <p>Автоставка</p>
                                    <p>Автовывод</p>
                                </div>
                                <div className="btn-ratio">
                                    <input type="text" />
                                </div>
                            </div>
                            <div className="bottom__btn-bottom">
                                <div className="bottom__btn-bottom--left">
                                    <div className="top">
                                        <div
                                            onClick={() => changeBet(-10)}
                                            className="wrapper__img"
                                        >
                                            <img src={minus} alt="minus" />
                                        </div>
                                        <p>{betMoney}р</p>
                                        <div
                                            onClick={() => changeBet(10)}
                                            className="wrapper__img"
                                        >
                                            <img src={plus} alt="plus" />
                                        </div>
                                    </div>

                                    <div className="bottom">
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
                                        <div
                                            onClick={() => changeBet(250)}
                                            className="wrapper__text"
                                        >
                                            +250
                                        </div>
                                        <div
                                            onClick={() => changeBet(500)}
                                            className="wrapper__text"
                                        >
                                            +500
                                        </div>
                                    </div>
                                </div>
                                <div className="bottom__btn-bottom--right">
                                    {
                                        gameStarted ? <button onClick={endGame}>Вывод</button> : <button onClick={startGame}>Ставка</button>
                                    }

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
