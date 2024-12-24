import React, { useEffect, useState } from "react";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import Input from "../Input/Input";
import "./UserAccess.css";
import { signUp, signIn } from "./Api";

function UserAccess({ isOpen, onClose, onLoginSuccess }) {
    const [registration, setRegistration] = useState({
        name: '',
        login: '',
        password: '',
        password_again: '',
        balance: 0
    });

    const [login, setLogin] = useState({
        login: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isSignUp, setIsSignUp] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setRegistration({
            ...registration,
            [name]: value
        })

        setLogin({
            ...registration,
            [name]: value
        })

        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const toggleForm = () => setIsSignUp(!isSignUp);

    const handleRegisterBtnClick = (e) => {
        e.preventDefault();
        const newErrors = validateRegistration();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        signUp(registration)
            .then(data => console.log('Успех:', data))
            .catch(error => console.error('Ошибка:', error));

        console.log("Пользователь зарегистрирован:", registration);
    };

    const validateRegistration = () => {
        const newErrors = {};
        if (!registration.name.trim()) newErrors.name = 'Имя не должно быть пустым';
        if (!registration.login.trim()) newErrors.login = 'Логин не должен быть пустым';
        if (!registration.password.trim()) newErrors.password = 'Пароль не должен быть пустым';
        if (!registration.password_again.trim()) newErrors.password_again = 'Повторите пароль';
        if (registration.password !== registration.password_again) {
            newErrors.password_again = "Пароли не совпадают";
        }
        return newErrors;
    };

    const handleLoginBtnClick = (e) => {
        e.preventDefault();
        signIn(login)
            .then(data => {
                const token = data.token;
                setToken(token);
                localStorage.setItem("token", token);
                console.log('Успех:', data);
                onLoginSuccess(token);
                onClose();
                location.reload()
            })
            .catch(error => console.error('Ошибка:', error));
    };

    useEffect(() => {
        console.log('Токен из localStorage:', token);
    }, [token]);

    const onWrapperClick = (event) => {
        if (event.target.classList.contains("container-body")) onClose();
    };

    return (
        <>
            {isOpen && (
                <div onClick={onWrapperClick} className={`container-body`}>
                    <div className={`container ${isSignUp ? "" : "active"}`} id="container">
                        <div className="form-container sign-up">
                            <form>
                                <Heading className='registration-head' text='Создание аккаунта' level='h1' />
                                <Input
                                    className="registration__input"
                                    type="text"
                                    name="name"
                                    placeholder="Имя"
                                    value={registration.name}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    className="registration__input"
                                    type="text"
                                    name="login"
                                    placeholder="Логин"
                                    value={registration.login}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    className="registration__input"
                                    type="password"
                                    name="password"
                                    placeholder="Пароль"
                                    value={registration.password}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    className="registration__input"
                                    type="password"
                                    name="password_again"
                                    placeholder="Повторите пароль"
                                    value={registration.password_again}
                                    onChange={handleInputChange}
                                />
                                <Button
                                    className="button__register"
                                    text="Зарегистрироваться"
                                    onClick={handleRegisterBtnClick}
                                />
                            </form>
                        </div>

                        <div className="form-container sign-in">
                            <form>
                                <Heading className='registration-head' text='Вход в аккаунт' level='h1' />
                                <Input
                                    className="registration__input"
                                    type="text"
                                    name="login"
                                    placeholder="Логин"
                                    value={login.login}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    className="registration__input"
                                    type="password"
                                    name="password"
                                    placeholder="Пароль"
                                    value={login.password}
                                    onChange={handleInputChange}
                                />
                                <Button
                                    className="button__register"
                                    text="Войти"
                                    onClick={handleLoginBtnClick}
                                />
                            </form>
                        </div>

                        <div className="toggle-container">
                            <div className="toggle">
                                <div className="toggle-panel toggle-left">
                                    <Heading className='registration-head welcome' text='С возвращением!' level='h1' />
                                    <p>Введите свои личные данные, чтобы использовать все функции сайта</p>
                                    <Button className="button__register" text="Войти в аккаунт" onClick={toggleForm} />
                                </div>
                                <div className="toggle-panel toggle-right">
                                    <p>Зарегистрируйтесь, указав свои личные данные, чтобы использовать все функции сайта</p>
                                    <Button className="button__register" text="Зарегистрироваться" onClick={toggleForm} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserAccess;
