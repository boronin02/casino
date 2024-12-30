import { fetchBalance } from "./balanceSlice";

export const updateBalance = (token) => (dispatch) => {
    if (token) {
        dispatch(fetchBalance(token)); // Убедитесь, что fetchBalance работает правильно
    } else {
        console.error("Токен отсутствует. Не удалось обновить баланс.");
    }
};
