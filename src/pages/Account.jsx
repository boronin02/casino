import { useEffect, useState } from "react";
import './../index.css'

const Account = () => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const [avatar, setAvatar] = useState()
    const [name, setName] = useState()
    const [login, setLogin] = useState()

    const [gameHistory, setGameHistory] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/account/data', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

            .then(response => response.json())

            .then(data => {
                setAvatar(data.user_data.avatar_url)
                setLogin(data.user_data.login)
                setName(data.user_data.name)
            })

            .catch(error => console.log(error));

        fetch('http://localhost:8000/api/game/history', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

            .then(response => response.json())

            .then(data => {
                setGameHistory(data.game_history)
            })

            .catch(error => console.log(error));
    }, [token])

    return (
        <>
            <div className="account">
                <div className="account__data">
                    <img className="account__img" src={avatar} alt="аватарка" />
                    <div className="account__data--text">
                        <p>{name}</p>
                        <p>{login}</p>
                    </div>
                </div>

                <div className="history">
                    <h2>История игр</h2>
                    <div className="history__table">
                        <div className="game">Game</div>
                        <div className="game__id">Player</div>
                        <div className="bet">Bet</div>
                        <div className="coefficient">Coefficient</div>
                        <div className="amount">Profit</div>
                    </div>
                    {
                        gameHistory && gameHistory.length > 0 ? (
                            gameHistory.map((game, index) => (
                                <div key={index} className="history__game">
                                    <p className="game">{game.name}</p>
                                    <p className="game__id">{game.id}</p>
                                    <p className="bet">{game.bet_amount}</p>
                                    <p className="coefficient">{game.coefficient}</p>
                                    <p className="amount">{game.win_amount}</p>
                                </div>
                            ))
                        ) : (
                            <p>История игр отсутствует</p>
                        )
                    }

                </div>
            </div>
        </>
    );
}

export default Account;