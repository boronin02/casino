import timer from './../img/Container.png';
import timerImg from './../img/timer.png';
import plus from './../img/plus.png';
import minus from './../img/minus.png';
import { useEffect, useRef, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBalance } from "../redux/balanceUtils";
import { WebSocketContext } from '../App';

const Rocket = () => {

    window.scrollTo(0, 0);
    const dispatch = useDispatch();

    const balance = useSelector((state) => state.balance.value);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [x, setX] = useState(1);
    const [crashed, setCrashed] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [crashPoint, setCrashPoint] = useState(1);
    const [ratios, setRatios] = useState(() => {
        const savedRatios = localStorage.getItem('ratios');
        return savedRatios ? JSON.parse(savedRatios) : []; // Загружаем из localStorage или создаем пустой массив
    });
    const [betMoney, setBetMoney] = useState(50);
    const [conclusions, setConclusions] = useState([]);
    const [betPlaced, setBetPlaced] = useState(false);
    const [canCollect, setCanCollect] = useState(true);

    const { socket } = useContext(WebSocketContext);
    const isClicked = useRef(false);

    const intervalRef = useRef(null); // Ссылка на интервал
    const xRef = useRef(x);

    useEffect(() => {
        xRef.current = x; // Обновляем референс на каждое изменение x
    }, [x]);

    useEffect(() => {
        if (socket) {
            console.log('Rocket: WebSocket доступен');

            const handleMessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.name === "crash") {
                    if (message.status === "start") startRound();
                    else if (message.status === "stop") endRound();
                }
            };

            socket.addEventListener('message', handleMessage);
            return () => socket.removeEventListener('message', handleMessage);
        }
    }, [socket]);

    const sendBet = () => {
        dispatch(updateBalance(token));
        if (isClicked.current) return;
        isClicked.current = true;
        setBetPlaced(true);

        fetch('http://localhost:8000/api/game/bet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ bet_amount: betMoney }),
        }).catch((error) => console.error('Ошибка отправки ставки:', error));
    };

    const startRound = () => {
        setCrashed(false);
        setX(1);
        setGameStarted(true);
        setConclusions([]); // Обновление списка при старте новой игры

        intervalRef.current = setInterval(() => {
            setX((prevX) => prevX + 0.01); // Увеличиваем значение X
        }, 18); // Каждые 100 мс (10 шагов за секунду)
    };

    useEffect(() => {
        if (!gameStarted && crashed) {
            console.log("Финальное значение X:", x.toFixed(2));
        }
    }, [gameStarted, crashed, x]);

    useEffect(() => {
        // Сохраняем `ratios` в localStorage при каждом его изменении
        localStorage.setItem('ratios', JSON.stringify(ratios));
    }, [ratios]);


    const endRound = () => {
        const finalX = xRef.current.toFixed(2); // Берем актуальное значение
        setGameStarted(false);
        setCrashed(true);
        isClicked.current = false;
        setCanCollect(true);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        // Добавляем текущий коэффициент в `ratios`
        setRatios((prev) => {
            const updatedRatios = [parseFloat(finalX), ...prev].slice(0, 19);
            return updatedRatios;
        });

        dispatch(updateBalance(token));
    };

    const collectWinnings = () => {
        if (!canCollect) return;
        setCanCollect(false);

        setConclusions((prev) => [
            { ratio: x.toFixed(2), bet: betMoney },
            ...prev.slice(0, 19),
        ]);
        createGame();
        dispatch(updateBalance(token));
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
        }).catch((error) => console.log('Error creating game:', error));
        dispatch(updateBalance(token));
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
                                <p className="total-count">{conclusions.length}</p>
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
                                        <p className="count" style={{ width: '60px', color: '#dfe5f2' }}>{bet}р</p>
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
                            {gameStarted ? x.toFixed(2) : 'Ожидание ставок'}
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
                                        onClick={sendBet}
                                        disabled={balance <= 50}
                                        className={`${gameStarted ? "bottom__btn-bottom--action" : ''}`}
                                    >
                                        Сделать ставку
                                    </button>
                                    <button
                                        onClick={collectWinnings}
                                        disabled={!betPlaced || !gameStarted || !canCollect} // Запрещаем забирать, если ставка не сделана, игра не началась или можно уже забирать
                                        className={`${!gameStarted ? "bottom__btn-bottom--action" : ''}`}
                                    >
                                        Забрать
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
