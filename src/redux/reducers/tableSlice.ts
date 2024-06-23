import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API

type InitialStateType = {
    table: string[][];
    loading: 'Idle' | 'Fullfilled' | 'Pending' | 'Rejected';
    errors: string | null;
};

const initialState: InitialStateType = {
    table: [],
    loading: 'Idle',
    errors: null
}

export const fetchTableData = createAsyncThunk(
    "fetch/tableData",
    async (param: { databaseName: string, tableName: string }) => {
        const { data } = await axios.get(`${url}/table_data?database_name=${param.databaseName}&table_name=${param.tableName}`);
        return data;
    }
)

const databaseSlice = createSlice({
    name: "databases",
    initialState,
    reducers: {},
    extraReducers: builders => {
        builders.addCase(fetchTableData.pending, state => {
            state.loading = 'Pending';
        }),
            builders.addCase(fetchTableData.fulfilled, (state, action) => {
                state.loading = 'Fullfilled';
                state.table = action.payload;
            }),
            builders.addCase(fetchTableData.rejected, (state, action) => {
                state.loading = 'Rejected';
                state.errors = action.error.message || 'Failed to fetch table data';
            })
    }
});

export default databaseSlice.reducer;