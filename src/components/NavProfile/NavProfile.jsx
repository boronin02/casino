import "./NavProfile.css"
import Button from "../Button/Button";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const NavProfile = ({ isOpen, onClose }) => {

    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const onWrapperClick = (event) => {
        if (event.target.classList.contains("container-body-account")) onClose();
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
        location.reload()
    };

    return (

        <>
            {
                isOpen && (
                    <div onClick={onWrapperClick} className="container-body-account">
                        <div className="container-account">
                            <NavLink to="/account" style={{ textDecoration: "none" }}>
                                <Button
                                    text="Настройки"
                                    className="container-account-button" />
                            </ NavLink>
                            <Button
                                text="Выйти"
                                className="container-account-button"
                                onClick={handleLogout}
                            />
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default NavProfile;