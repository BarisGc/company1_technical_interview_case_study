import { configureStore } from "@reduxjs/toolkit";

import intraDayTradeHistoryListSlice from "./intraDayTradeHistoryListSlice";

export const store = configureStore({
    reducer: {
        epiasData1: intraDayTradeHistoryListSlice,
    },
});