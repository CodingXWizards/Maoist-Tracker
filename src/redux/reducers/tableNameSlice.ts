import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API

type InitialStateType = {
    tableNames: string[];
    loading: 'Idle' | 'Fullfilled' | 'Pending' | 'Rejected';
    errors: string | null;
};

const initialState: InitialStateType = {
    tableNames: [],
    loading: 'Idle',
    errors: null
}

export const fetchTableNames = createAsyncThunk(
    "fetch/tableNames",
    async (databaseName: string) => {
        const { data } = await axios.get(`${url}/table_names?database_name=${databaseName}`);
        return data;
    }
)

const databaseSlice = createSlice({
    name: "tableNames",
    initialState,
    reducers: {},
    extraReducers: builders => {
        builders.addCase(fetchTableNames.pending, state => {
            state.loading = 'Pending';
        }),
            builders.addCase(fetchTableNames.fulfilled, (state, action) => {
                state.loading = 'Fullfilled';
                state.tableNames = action.payload;
            }),
            builders.addCase(fetchTableNames.rejected, (state, action) => {
                state.loading = 'Rejected';
                state.errors = action.error.message || 'Failed to fetch table names';
            })
    }
});

export default databaseSlice.reducer;