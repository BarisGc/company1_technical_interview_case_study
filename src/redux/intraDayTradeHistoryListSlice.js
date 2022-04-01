import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";

// Paramaters which will be used in api request
let endDate = "2022-01-26";
let startDate = "2022-01-26";

// Fetch Api Data
export const fetchEpiasData1 = createAsyncThunk('intraDayTradeHistoryList/getAllList', async (tableItemLimit) => {
    const res = await axios(`${process.env.REACT_APP_API_ENDPOINT}/transparency/service/market/intra-day-trade-history?endDate=${endDate}&startDate=${startDate}`)
    // console.log("res.data.body.intraDayTradeHistoryList", res.data.body.intraDayTradeHistoryList)

    // Limiting Table Data
    let initialItemArray = res.data.body.intraDayTradeHistoryList;
    let finalItemArray = [];
    for (let i = 0; i < tableItemLimit; i++) {
        finalItemArray.push(initialItemArray[i])
    }

    return finalItemArray
})

// Entity Adapter
let counter = 0;
export const epiasData1Adaptor = createEntityAdapter({
    selectId: (entity) => counter + 1,
})

const initialState = epiasData1Adaptor.getInitialState({
    items: [],
    status: 'idle',
});

export const epiasData1Selectors = epiasData1Adaptor.getSelectors((state) => state.epiasData1);

export const intraDayTradeHistoryListSlice = createSlice({
    name: 'epiasData1',
    initialState,
    reducers: {
        setEpiasData1: epiasData1Adaptor.setOne,
    },
    extraReducers: {
        [fetchEpiasData1.pending]: (state, action) => {
            state.status = 'loading';
        },
        [fetchEpiasData1.fulfilled]: (state, action) => {
            state.items = [...action.payload];
            state.status = 'succeeded';
        },
        [fetchEpiasData1.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    },
});

export const { setEpiasData1 } = intraDayTradeHistoryListSlice.actions;
export default intraDayTradeHistoryListSlice.reducer;