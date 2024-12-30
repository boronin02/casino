import { fetchBalance } from "./balanceSlice";
import store from "./store";

export const updateBalance = () => {
    const token = localStorage.getItem("token");
    if (token) {
        store.dispatch(fetchBalance(token));
    } else {
        console.error("Токен отсутствует. Не удалось обновить баланс.");
    }
};
