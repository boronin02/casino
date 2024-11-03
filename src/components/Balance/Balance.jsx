import React, { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";

function Balance({ token }) {
    const [balance, setBalance] = useState({
        type: '',
        amount: 0
    });

    function handleInputChange(event) {
        const { name, value } = event.target;
        setBalance({
            ...balance,
            [name]: name === 'amount' ? parseFloat(value) : value
        });
    }

    function handleRegisterBtnClick() {
        console.log('Токен перед отправкой:', token);
        console.log(balance);
        fetch('http://localhost:8000/api/transaction', {
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
                    throw new Error(`HTTP error! статус: ${response.status}`); // Ловим ошибки HTTP
                }
                return response.json();
            })
            .then(data => console.log(data))
            .catch(error => console.log('Ошибка:', error));
    }

    return (
        <>
            <Input
                className="balance__input"
                type="text"
                name="type"
                placeholder="Тип транзакции"
                value={balance.type}
                onChange={handleInputChange}
            />
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
        </>
    );
}

export default Balance;
