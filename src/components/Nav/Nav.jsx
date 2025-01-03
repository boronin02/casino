import React, { useEffect, useState } from "react";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import "./Nav.css";
import UserAccess from "../UserAccess/UserAccess";
import { NavLink, useLocation } from "react-router-dom";

import plus from "./plus.png";
import NavProfile from "../NavProfile/NavProfile";
import { useDispatch, useSelector } from "react-redux";
import { setBalance } from "../../redux/balanceSlice";
import { updateBalance } from "../../redux/balanceUtils";

function Nav() {
    const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false);
    const [navProfileIsOpen, setNavProfileIsOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const dispatch = useDispatch();
    // поулучение баланса
    const balance = useSelector((state) => state.balance.value);
    const location = useLocation();

    const handleLoginSuccess = (newToken) => {
        localStorage.setItem("token", newToken);
        dispatch(updateBalance(newToken)); // Обновляем баланс при успешном входе
    };

    useEffect(() => {
        if (token) {
            dispatch(updateBalance(token)); // Обновляем баланс при загрузке
        }
    }, [dispatch, token]);


    return (
        <nav className="nav">
            <div className="container-head">
                <NavLink className="logo-link" to="/">
                    <div className="header-left">
                        <h1>сара<span>deep</span></h1>
                    </div>
                </NavLink>
                <div className="header-middle">
                    {location.pathname === "/" && (
                        <a href="#Game" style={{ textDecoration: "none" }}>
                            <Heading className="header-middle-text" text="Игры" level="h2" />
                        </a>
                    )}
                </div>
                <div className="header-right">
                    {token ? (
                        <>
                            <NavLink to="/Transaction" style={{ textDecoration: "none" }}>
                                <Button
                                    img={plus}
                                    className="button__account-balance"
                                    text={balance === 0 ? "0" : balance}
                                />
                            </NavLink>

                            <Button
                                className="button__account-balance"
                                text="Профиль"
                                onClick={() => setNavProfileIsOpen(true)}
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
