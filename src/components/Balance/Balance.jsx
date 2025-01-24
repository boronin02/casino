import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBalance } from "../../redux/balanceUtils";
import Input from "../Input/Input";
import Button from "../Button/Button";
import "./Balance.css"

function Balance({ token }) {
    const dispatch = useDispatch();

    const [balance, setBalance] = useState({
        type: '',
        amount: ''
    });

    function handleInputChange(event) {
        const { name, value } = event.target;
        setBalance((prevBalance) => ({
            ...prevBalance,
            [name]: name === 'amount' ? parseFloat(value) : value
        }));
    }

    function handleRegisterBtnClick() {
        if (!token) return;

        const sendTransaction = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/transaction/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        type: balance.type,
                        amount: balance.amount
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! статус: ${response.status}`);
                }

                const data = await response.json();
                console.log('Ответ от сервера:', data);

                // Обновляем баланс после успешного запроса
                dispatch(updateBalance(token));
            } catch (error) {
                console.log('Ошибка:', error);
            }
        };

        sendTransaction();
    }


    return (
        <>
            <div className="balance__container">
                <select
                    className="balance__select"
                    name="type"
                    value={balance.type}
                    onChange={handleInputChange} >
                    <option value="" disabled>Выберите тип транзакции</option>
                    <option value="Пополнение">Пополнение</option>
                    <option value="Снятие">Снятие</option>
                </select>
                <Input
                    className="balance__input"
                    type="number"
                    name="amount"
                    placeholder="Сумма"
                    value={balance.amount}
                    onChange={handleInputChange}
                />
                <Button
                    className="button__register-balance"
                    text="Отправить"
                    onClick={handleRegisterBtnClick}
                />
            </div>
        </>
    );
}

export default Balance;
