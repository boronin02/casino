import React, { useEffect, useState } from "react";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import "./Nav.css";
import UserAccess from "../UserAccess/UserAccess";
import { NavLink } from "react-router-dom";

import plus from "./plus.png";
import NavProfile from "../NavProfile/NavProfile";
import { useBalance } from "../../helpers/BalanceContext";

function Nav() {
    const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false);
    const [navProfileIsOpen, setNavProfileIsOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [balance, setBalance] = useBalance(0);

    const handleLoginSuccess = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };


    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8000/balance");

        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "authenticate", token }));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setBalance(message.balance)
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            socket.close();
        };
    }, [setBalance]);

    return (
        <nav className="nav">
            <div className="container-head">
                <NavLink className="logo-link" to="/">
                    <div className="header-left">
                        <h1>сара<span>deep</span></h1>
                    </div>
                </NavLink>
                <div className="header-middle">
                    <a href="#Game" style={{ textDecoration: "none" }}>
                        <Heading className="header-middle-text" text="Игры" level="h2" />
                    </a>
                </div>
                <div className="header-right">
                    {token ? (
                        <>
                            <NavLink to="/Transaction" style={{ textDecoration: "none" }}>
                                <Button
                                    img={plus}
                                    className="button__account-balance"
                                    text={balance === 0 ? "" : balance}
                                />
                            </NavLink>
                            <Button
                                className="button__account-balance"
                                text="Профиль"
                                onClick={() => setNavProfileIsOpen(true)}
                            />
                            <Button
                                className="button__account"
                                text="Выйти"
                                onClick={handleLogout}
                            />
                        </>
                    ) : (
                        <button
                            onClick={() => setModalInfoIsOpen(true)}
                            type="submit"
                            className="button"
                        >
                            <span>Вход</span>
                        </button>
                    )}
                </div>
                <UserAccess
                    isOpen={modalInfoIsOpen}
                    onClose={() => setModalInfoIsOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
                <NavProfile isOpen={navProfileIsOpen} onClose={() => setNavProfileIsOpen(false)} />
            </div>
        </nav>
    );
}

export default Nav;
