import { useEffect, useState } from "react";
import './../index.css';
import Button from "../components/Button/Button";

const Account = () => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const [avatar, setAvatar] = useState();
    const [name, setName] = useState();
    const [login, setLogin] = useState();

    const [gameHistory, setGameHistory] = useState([]);
    const [transactionHistory, setTransactionHistory] = useState([]);

    const [isHistoryGame, setIsHistoryGame] = useState(true);
    const [isDepositView, setIsDepositView] = useState(true); // Переключатель между Пополнением и Снятием

    useEffect(() => {
        if (!token) {
            console.error("Токен отсутствует");
            return;
        }

        fetch('http://localhost:8000/api/account/data', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setAvatar(`http://localhost:8000${data.user_data.avatar_url}`);
                setLogin(data.user_data.login);
                setName(data.user_data.name);
            })
            .catch(error => console.log(error));

        fetch('http://localhost:8000/api/game/history', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => setGameHistory(data.game_history || []))
            .catch(error => console.log(error));

        fetch('http://localhost:8000/api/transaction/history', {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => setTransactionHistory(data.transaction_history || []))
            .catch(error => console.log(error));
    }, [token]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const depositTransactions = transactionHistory.filter(transaction => transaction.type === 'Пополнение');
    const withdrawalTransactions = transactionHistory.filter(transaction => transaction.type === 'Снятие');

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await fetch('http://localhost:8000/api/account/avatar', {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setAvatar(`http://localhost:8000${data.new_avatar_url}`);
            }
        } catch (error) {
            console.error("Ошибка при загрузке аватара", error);
        }
    };

    const renderTransactionHistory = () => {
        const transactions = isDepositView ? depositTransactions : withdrawalTransactions;

        if (transactions.length === 0) {
            return <p>{isDepositView ? "Нет операций по пополнению" : "Нет операций по снятию"}</p>;
        }

        return transactions.map((transaction, index) => (
            <div key={index} className="history__game">
                <p className="game__id">{transaction.type}</p>
                <p className="bet">{transaction.amount}</p>
                <p className="game">{formatDate(transaction.created_date)}</p>
            </div>
        ));
    };

    return (
        <>
            <div className="account">
                <div className="account__data">
                    <div className="avatar-container">
                        <img className="account__img" src={avatar} alt="аватарка" />
                        <div className="overlay">
                            <label htmlFor="avatar-upload">Загрузить фотографию</label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>
                    <div className="account__data--text">
                        <p>Имя: {name}</p>
                        <p>Логин: {login}</p>
                    </div>
                </div>

                <div className="switches">
                    <Button
                        className="button__account-balance"
                        text="История игр"
                        onClick={() => setIsHistoryGame(true)} />
                    <Button
                        className="button__account-balance"
                        text="История транзакций"
                        onClick={() => setIsHistoryGame(false)} />
                </div>

                {!isHistoryGame && (
                    <div className="transaction-switches">
                        <Button
                            className="button__account-balance"
                            text="Пополнения"
                            onClick={() => setIsDepositView(true)} />
                        <Button
                            className="button__account-balance"
                            text="Снятия"
                            onClick={() => setIsDepositView(false)} />
                    </div>
                )}

                {isHistoryGame ? (
                    <div className="history">
                        <h2>История игр</h2>
                        <div className="history__table">
                            <div className="game">Игры</div>
                            <div className="game__id">ID игры</div>
                            <div className="bet">Ставка</div>
                            <div className="coefficient">Коэф.</div>
                            <div className="amount">Профит</div>
                            <div className="game">Дата</div>
                        </div>
                        {gameHistory.length === 0 ? (
                            <p>История игр отсутствует</p>
                        ) : (
                            gameHistory.map((game, index) => (
                                <div key={index} className="history__game">
                                    <p className="game">{game.name}</p>
                                    <p className="game__id">{game.id}</p>
                                    <p className="bet">{game.bet_amount}</p>
                                    <p className="coefficient">{game.coefficient}</p>
                                    <p className="amount">{game.win_amount}</p>
                                    <p className="game">{formatDate(game.created_date)}</p>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="history">
                        <h2>История транзакций</h2>
                        <div className="history__table">
                            <div className="method">Метод</div>
                            <div className="amount">Сумма</div>
                            <div className="data">Дата</div>
                        </div>
                        {renderTransactionHistory()}
                    </div>
                )}
            </div>
        </>
    );
};

export default Account;