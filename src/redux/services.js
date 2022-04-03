import axios from 'axios'
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTodosAsync = createAsyncThunk('todos/getTodosAsync', async () => {
    const res = await axios(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`);
    return res.data
})

// Paramaters which will be used in api request
// let endDate = "2022-01-26";
// let startDate = "2022-01-26";

// Fetch Api Data
export const fetchEpiasData1 = createAsyncThunk('/epiasDataByAPI', async (parameterObject) => {

    const res = await axios(`http://localhost:7000/epiasDataByAPI`)
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