import { createSlice } from "@reduxjs/toolkit";

export const fetchBalance = (token) => async (dispatch) => {
    dispatch(startLoading()); // Устанавливаем флаг загрузки
    try {
        const response = await fetch("http://localhost:8000/api/account/balance", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch balance");
        }

        const data = await response.json();
        dispatch(setBalance(data.user_balance)); // Устанавливаем баланс
    } catch (error) {
        console.error("Error fetching balance:", error);
        dispatch(setError(error.message)); // Сохраняем ошибку в состоянии
    } finally {
        dispatch(endLoading()); // Сбрасываем флаг загрузки
    }
};

const balanceSlice = createSlice({
    name: "balance",
    initialState: {
        value: 0,
        isLoading: false,
        error: null,
    },
    reducers: {
        setBalance: (state, action) => {
            state.value = action.payload;
            state.error = null; // Сбрасываем ошибку при успешном запросе
        },
        resetBalance: (state) => {
            state.value = 0;
            state.error = null;
        },
        startLoading: (state) => {
            state.isLoading = true;
        },
        endLoading: (state) => {
            state.isLoading = false;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setBalance, resetBalance, startLoading, endLoading, setError } = balanceSlice.actions;
export default balanceSlice.reducer;
