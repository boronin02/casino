import React, { createContext, useContext, useState } from "react";

// Создаём контекст для баланса
const BalanceContext = createContext();

// Провайдер контекста
export const BalanceProvider = ({ children }) => {
    const [balance, setBalance] = useState(0); // Инициализация баланса

    return (
        <BalanceContext.Provider value={[balance, setBalance]}>
            {children}
        </BalanceContext.Provider>
    );
};

// Хук для доступа к контексту
export const useBalance = () => {
    const context = useContext(BalanceContext);
    if (!context) {
        throw new Error("useBalance must be used within a BalanceProvider");
    }
    return context; // Возвращает [balance, setBalance]
};
