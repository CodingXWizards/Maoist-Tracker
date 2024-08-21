import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_API

type InitialStateType = {
    table: string[][][];
    loadedDatabases: string[],
    tabs: string[];
    currTab: number | null;
    loading: 'Idle' | 'Fullfilled' | 'Pending' | 'Rejected';
    errors: string | null;
};

const initialState: InitialStateType = {
    table: [],
    tabs: [],
    loadedDatabases: [],
    currTab: null,
    loading: 'Idle',
    errors: null
}

export const fetchTableData = createAsyncThunk(
    "fetch/tableData",
    async (param: { databaseName: string, tableName: string }) => {
        const { data } = await axios.get(`${url}/table_data?database_name=${param.databaseName}&table_name=${param.tableName}`);
        return [data, param.tableName];
    }
)

export const generateSummaryCDR = createAsyncThunk(
    "generate/cdr",
    async (param: { databaseName: string, tableNames: string[] }) => {
        const { data } = await axios.post(`${url}/generate_summary`, { database_name: param.databaseName, table_names: param.tableNames });
        return data;
    }
)

const databaseSlice = createSlice({
    name: "databases",
    initialState,
    reducers: {
        setLoadedDatabases: (state, action) => {
            state.loadedDatabases.push(action.payload);
        },
        setTableData: (state, action) => {
            state.table = action.payload;
        },
        updateTabs: (state, action) => {
            state.tabs = action.payload;
        },
        setCurrTab: (state, action) => {
            state.currTab = action.payload;
        }
    },
    extraReducers: builders => {
        builders.addCase(fetchTableData.pending, state => {
            state.loading = 'Pending';
        }),
            builders.addCase(fetchTableData.fulfilled, (state, action) => {
                state.loading = 'Fullfilled';
                state.table.push(action.payload[0]);
                state.tabs.push(action.payload[1]);
                state.currTab = state.table.length - 1;
            }),
            builders.addCase(fetchTableData.rejected, (state, action) => {
                state.loading = 'Rejected';
                state.errors = action.error.message || 'Failed to fetch table data';
            }),

            builders.addCase(generateSummaryCDR.pending, state => {
                state.loading = 'Pending';
            }),
            builders.addCase(generateSummaryCDR.fulfilled, (state, action) => {
                state.loading = 'Fullfilled';
                state.table.push(action.payload);
                state.tabs.push(`Summary ${state.tabs.filter(tab => tab.toString().includes("Summary")).length + 1}`);
                state.currTab = state.table.length - 1;
            }),
            builders.addCase(generateSummaryCDR.rejected, (state, action) => {
                state.loading = 'Rejected';
                state.errors = action.error.message || 'Failed to fetch table data';
            })
    }
});

export default databaseSlice.reducer;
export const { setTableData, setCurrTab, updateTabs, setLoadedDatabases } = databaseSlice.actions