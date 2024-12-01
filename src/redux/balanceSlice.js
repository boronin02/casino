import { createSlice } from "@reduxjs/toolkit";

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
