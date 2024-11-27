import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import "./Balance.css"

function Balance({ token }) {
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
        console.log('Токен перед отправкой:', token);
        fetch('http://localhost:8000/api/transaction/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: balance.type,
                amount: balance.amount
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! статус: ${response.status}`);
                }
                return response.json();
            })
            .then(data => console.log(data))
            .catch(error => console.log('Ошибка:', error));
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
                    className="button__register button"
                    text="Отправить"
                    onClick={handleRegisterBtnClick}
                />
            </div>
        </>
    );
}

export default Balance;
