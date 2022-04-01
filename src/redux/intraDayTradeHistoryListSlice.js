import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Paramaters which will be used in api request
let endDate = "2022-02-08";
let startDate = "2022-02-07";

// Fetch Api Data
export const fetchEpiasData1 = createAsyncThunk('intraDayTradeHistoryList/getAllList', async (tableItemLimit) => {
    const res = await axios(`${process.env.REACT_APP_API_ENDPOINT}/transparency/service/market/intra-day-trade-history?endDate=${endDate}&startDate=${startDate}`)
    // console.log("res.data.body.intraDayTradeHistoryList", res.data.body.intraDayTradeHistoryList)

    // Limiting Table Data
    let initialItemArray = res.data.body.intraDayTradeHistoryList;
    let finalItemArray = [];
    let dataLimit = (tableItemLimit > initialItemArray.length) || tableItemLimit == null ? initialItemArray.length : tableItemLimit
    console.log("dataLimit", dataLimit)
    for (let i = 0; i < dataLimit; i++) {
        finalItemArray.push(initialItemArray[i])
    }

    return finalItemArray
})


export const intraDayTradeHistoryListSlice = createSlice({
    name: 'epiasData1',
    initialState: {
        items: [],
        status: 'idle',
    },
    reducers: { //blank because i have used "createAsyncThunk + extraReducers"
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

export default intraDayTradeHistoryListSlice.reducer;