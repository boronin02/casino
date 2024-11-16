import Balance from "../components/Balance/Balance";
import { useState } from "react";
import Button from "../components/Button/Button";
import Heading from "../components/Heading/Heading";
import './../index.css'

import { NavLink } from "react-router-dom";

const Transaction = () => {
    const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const handleLoginSuccess = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <>
            <Balance token={token} />
        </>
    );
}

export default Transaction;