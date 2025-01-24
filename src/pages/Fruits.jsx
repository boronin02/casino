import plus from './../img/plus.png';
import minus from './../img/minus.png';
import dillImage from './../img/dill.jpg'; // Укроп
import cabbageImage from './../img/cabbageImage.jpg'; // Капуста
import tomatoImage from './../img/tomatoImage.jpg'; // Помидор
import carrotImage from './../img/carrotImage.jpg'; // Морковка
import cucumberImage from './../img/cucumberImage.jpg'; // Огурец
import potatoImage from './../img/potatoImage.png'; // Картошка
import vodkaImage from './../img/vodkaImage.jpg'; // Водка

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { updateBalance } from "../redux/balanceUtils";

// Объект с картинками для каждого элемента
const foodImages = {
    "Укроп": dillImage,
    "Капуста": cabbageImage,
    "Морковка": carrotImage,
    "Огурец": cucumberImage,
    "Помидор": tomatoImage,
    "Картошка": potatoImage,
    "Водка": vodkaImage,
};

const Fruits = () => {
    const dispatch = useDispatch();
    const balance = useSelector((state) => state.balance.value);

    const [betMoney, setBetMoney] = useState(50);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [fruitsResult, setFruitsResult] = useState(["?", "?", "?"]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);
    const isClicked = useRef(false);

    // Обновляем баланс при загрузке компонента
    useEffect(() => {
        if (token) {
            dispatch(updateBalance(token));
        }
    }, [token, dispatch]);

    // Получение результата игры
    const fetchFruitsResult = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/game/fruits/result", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const data = await response.json();
            return {
                result: data.fruits_result.result || ["?", "?", "?"],
                coef: data.fruits_result.multiplier,
            };
        } catch (error) {
            console.error("Failed to fetch fruits result:", error);
            return { result: ["?", "?", "?"] };
        }
    };

    // Отправка данных ставки и множителя на сервер
    const sendGameData = async (betMoney, multiplier) => {
        try {
            const response = await fetch('http://localhost:8000/api/game/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: 'Fruits',
                    bet_amount: betMoney,
                    coefficient: multiplier,
                }),
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            console.log("Game data sent:", data);
            dispatch(updateBalance(token));
        } catch (error) {
            console.error("Error sending game data:", error);
        }
    };

    // Запуск игры
    const spinFruits = async () => {
        if (isClicked.current || balance < betMoney) return;

        isClicked.current = true;
        setIsSpinning(true);
        setIsGameActive(true);
        setFruitsResult(["?", "?", "?"]);

        await sendBet();

        const { result, coef } = await fetchFruitsResult();
        if (result) {
            setTimeout(() => setFruitsResult([result[0], "?", "?"]), 1000);
            setTimeout(() => setFruitsResult([result[0], result[1], "?"]), 2000);
            setTimeout(() => {
                setFruitsResult(result);
                setIsSpinning(false);
                setIsGameActive(false);
                sendGameData(betMoney, coef); // Отправка данных ставки и множителя на сервер
                isClicked.current = false;
            }, 3000);
        } else {
            setIsSpinning(false);
            setIsGameActive(false);
            isClicked.current = false;
        }
    };

    // Отправка ставки на сервер
    const sendBet = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/game/bet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ bet_amount: betMoney }),
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);
            dispatch(updateBalance(token)); // Обновляем баланс после отправки ставки
        } catch (error) {
            console.error("Error sending bet:", error);
        }
    };

    // Изменение ставки
    const changeBet = (amount) => {
        setBetMoney((prev) => {
            const newBet = prev + amount;
            return Math.max(50, Math.min(balance, newBet));
        });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Закусончик</h1>
            <div
                className="center-container"
                style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "left",
                    gap: "250px", // Расстояние между окнами и таблицей
                    color: "white",
                    marginLeft: "50px"
                }}
            >
                {/* Таблица слева */}
                <div
                    className="left-info__panel"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        textAlign: "left",
                        fontFamily: "'Manrope', sans-serif"
                    }}

                >
                    <p>Укроп-Укроп-Укроп: 2x</p>
                    <p>Капуста-Капуста-Капуста: 3x</p>
                    <p>Морковка-Морковка-Морковка: 4x</p>
                    <p>Огурец-Огурец-Огурец: 5x</p>
                    <p>Помидор-Помидор-Помидор: 6x</p>
                    <p>Картошка-Картошка-Картошка: 7x</p>
                    <p>Водка-Водка-Водка: 8x</p>
                </div>

                {/* Центр - окна */}
                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {fruitsResult.map((fruit, index) => (
                        <div
                            key={index}
                            style={{
                                padding: "10px 20px",
                                border: "2px solid #ccc",
                                borderRadius: "5px",
                                backgroundColor: "#f9f9f9",
                                width: "200px",
                                height: "200px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "20px",
                                fontWeight: "bold",
                                animation: isSpinning ? "spin 0.2s linear infinite" : "none",
                            }}
                        >
                            {foodImages[fruit] ? (
                                <img
                                    src={foodImages[fruit]}
                                    alt={fruit}
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        objectFit: "contain",
                                        borderRadius: "10px",
                                    }}
                                />
                            ) : (
                                fruit
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="rocket__center-bottom" style={{ marginTop: "50px" }}>
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
                                <div onClick={() => changeBet(-50)} className="wrapper__text">-50</div>
                                <div onClick={() => changeBet(-100)} className="wrapper__text">-100</div>
                                <div onClick={() => changeBet(50)} className="wrapper__text">+50</div>
                                <div onClick={() => changeBet(100)} className="wrapper__text">+100</div>
                            </div>
                        </div>
                        <div className="bottom__btn-bottom--right">
                            <button
                                onClick={spinFruits}
                                disabled={isGameActive || balance < 50}
                            >
                                {isGameActive || balance < 50 ? "Нельзя сделать ставку" : "Сделать ставку"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Fruits;
