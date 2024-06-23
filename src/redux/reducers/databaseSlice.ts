import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API

type InitialStateType = {
    databases: string[];
    loading: 'Idle' | 'Fullfilled' | 'Pending' | 'Rejected';
    errors: string | null;
};

const initialState: InitialStateType = {
    databases: [],
    loading: 'Idle',
    errors: null
}

export const fetchDatabases = createAsyncThunk(
    "fetch/databases",
    async () => {
        const { data } = await axios.get(`${url}/databases`);
        return data;
    }
)

const databaseSlice = createSlice({
    name: "databases",
    initialState,
    reducers: {},
    extraReducers: builders => {
        builders.addCase(fetchDatabases.pending, state => {
            state.loading = 'Pending';
        }),
            builders.addCase(fetchDatabases.fulfilled, (state, action) => {
                state.loading = 'Fullfilled';
                state.databases = action.payload;
            }),
            builders.addCase(fetchDatabases.rejected, (state, action) => {
                state.loading = 'Rejected';
                state.errors = action.error.message || 'Failed to fetch databases';
            })
    }
});

export default databaseSlice.reducer;