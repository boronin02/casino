import Balance from "../components/Balance/Balance";
import { useState } from "react";
import './../index.css'

const Transaction = () => {
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