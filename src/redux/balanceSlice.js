import { createSlice } from "@reduxjs/toolkit";

export const fetchBalance = (token) => async (dispatch) => {
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
        dispatch(setBalance(data.user_balance));
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
};

const balanceSlice = createSlice({
    name: "balance",
    initialState: {
        value: 0,
    },
    reducers: {
        setBalance: (state, action) => {
            state.value = action.payload;
        },
        resetBalance: (state) => {
            state.value = 0;
        },
    },
});

export const { setBalance, resetBalance } = balanceSlice.actions;
export default balanceSlice.reducer;
