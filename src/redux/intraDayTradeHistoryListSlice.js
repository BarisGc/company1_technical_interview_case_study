import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Paramaters which will be used in api request
let endDate = "2022-01-26";
let startDate = "2022-01-26";

// Fetch Api Data
export const fetchEpiasData1 = createAsyncThunk('intraDayTradeHistoryList/getAllList', async (parameterObject) => {

    const res = await axios(`${process.env.REACT_APP_API_ENDPOINT}/transparency/service/market/intra-day-trade-history?endDate=${parameterObject.endDate}&startDate=${parameterObject.startDate}`)
    // console.log("res.data.body.intraDayTradeHistoryList", res.data.body.intraDayTradeHistoryList)

    // Limiting Table Data
    let initialItemArray = res.data.body.intraDayTradeHistoryList;
    let finalItemArray = [];
    let dataLimit = (parameterObject.tableItemLimit > initialItemArray.length) || parameterObject.tableItemLimit == null ? initialItemArray.length : parameterObject.tableItemLimit

    // console.log("dataLimit", dataLimit)

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