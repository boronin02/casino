import React, { useState } from "react";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import "./Header.css";
import UserAccess from "../UserAccess/UserAccess";

function Header() {
    const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false);

    return (
        <>
            <div className="container-head">
                <div className="header-left">
                    <Heading text="СарадиП" level="h1" />
                </div>
                <div className="header-middle">
                    <a>
                        <Heading
                            className="header-middle-text"
                            text="Главная"
                            level="h2" />
                    </a>
                    <a>
                        <Heading
                            className="header-middle-text"
                            text="Слоты"
                            level="h2" />
                    </a>
                    <a>
                        <Heading
                            className="header-middle-text"
                            text="Ракетка"
                            level="h2" />
                    </a>
                    <a>
                        <Heading
                            className="header-middle-text"
                            text="Карточки"
                            level="h2" />
                    </a>
                    <a>
                        <Heading
                            className="header-middle-text"
                            text="FAQ"
                            level="h2" />
                    </a>
                </div>
                <div className="header-right">
                    <Button
                        className="account-wrapper"
                        text="Авторизоваться"
                        onClick={() => setModalInfoIsOpen(true)}
                    />
                </div>

                <UserAccess
                    isOpen={modalInfoIsOpen}
                    onClose={() => setModalInfoIsOpen(false)} />
            </div>
        </>
    );
}

export default Header;
