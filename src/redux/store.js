import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk"; // Исправленный импорт
import balanceReducer from "./balanceSlice";

const store = configureStore({
    reducer: {
        balance: balanceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Добавляем thunk
});

export default store;
