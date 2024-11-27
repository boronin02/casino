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
import plus from './plus.png'
import NavProfile from "../NavProfile/NavProfile";

import { useBalance } from "../../helpers/BalanceContext";

function Nav() {
    const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false);
    const [navProfileIsOpen, setNavProfileIsOpen] = useState(false);

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [balance, setBalance] = useBalance();
    const [ws, setWs] = useState(null)

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
            const socket = new WebSocket('ws://localhost:8000')

            socket.onopen = () => {
                socket.send(JSON.stringify({ token }));
            }

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.user_balance) {
                    setBalance(data.user_balance)
                }
            }

            setWs(socket)

            return () => {
                socket.close();
            };
        }
    }, [token, setBalance]);

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

                                    <NavLink
                                        to="/Transaction"
                                        style={{ textDecoration: 'none' }}>
                                        <Button
                                            img={plus}
                                            className="button__account-balance"
                                            text={balance === '0' ? '' : balance}
                                        />
                                    </NavLink>

                                    <Button
                                        className="button__account-balance"
                                        text="Профиль"
                                        onClick={() => setNavProfileIsOpen(true)}
                                    />

                                    {/* <NavProfile /> */}

                                    <Button
                                        className="button__account"
                                        text="Выйти"
                                        onClick={handleLogout}
                                    />

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

                    <NavProfile isOpen={navProfileIsOpen}
                        onClose={() => setNavProfileIsOpen(false)} />
                </div>
            </nav>
        </>
    );
}

export default Nav;
