import React, { useEffect, useState } from "react";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import "./Nav.css";
import UserAccess from "../UserAccess/UserAccess";
import Balance from "../Balance/Balance";
import Transaction from "../../pages/Transaction";

import { NavLink } from "react-router-dom"

import balanceImg from "./balance.png"
import transImg from "./trans.png"

function Nav() {
    const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [balance, setBalance] = useState(null)

    const handleLoginSuccess = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    useEffect(() => {
        if (token) {
            fetch('http://localhost:8000/api/account/balance', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

                .then(response => response.json())
                .then(data => setBalance(data.balance))
        }
    }, [token])



    return (
        <>
            <nav className="nav">
                <div className="container-head">
                    <NavLink className='logo-link' to='/'>
                        <div className="header-left">
                            <h1>сара<span>deep</span></h1>
                        </div>
                    </NavLink>
                    <div className="header-middle">
                        <a>
                            <Heading
                                className="header-middle-text"
                                text="Главная"
                                level="h2" />
                        </a>
                        <a href="#Game" style={{ textDecoration: 'none' }}>
                            <Heading
                                className="header-middle-text"
                                text="Игры"
                                level="h2" />
                        </a>
                    </div>
                    <div className="header-right">
                        {
                            token ? (
                                <>
                                    <Button
                                        img={transImg}
                                        className="button__account-balance "
                                        text={balance === null ? '' : balance}
                                    />

                                    <NavLink
                                        to="/Transaction"
                                        style={{ textDecoration: 'none' }}>
                                        <Button
                                            img={balanceImg}
                                            className="button__account-balance"
                                            text="Кошелёк"
                                        />
                                    </NavLink>

                                    <Button
                                        className="button__account-balance"
                                        text="Профиль"
                                        onClick={handleLogout}
                                    />


                                    {/* <Button
                                        className="button__account"
                                        text="Выйти"
                                        onClick={handleLogout}
                                    /> */}

                                </>
                            ) : (
                                <>
                                    <button onClick={() => setModalInfoIsOpen(true)} type="submit" className="button"><span>Вход</span></button>
                                </>
                            )
                        }
                    </div>

                    <UserAccess
                        isOpen={modalInfoIsOpen}
                        onClose={() => setModalInfoIsOpen(false)}
                        onLoginSuccess={handleLoginSuccess}
                    />
                </div>
            </nav>
        </>
    );
}

export default Nav;
