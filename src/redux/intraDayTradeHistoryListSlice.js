import { createSlice } from "@reduxjs/toolkit";
import { fetchEpiasData1 } from "./services";

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

export { fetchEpiasData1 };
export default intraDayTradeHistoryListSlice.reducer;