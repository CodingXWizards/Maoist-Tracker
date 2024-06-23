import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
    currDatabase: string | null;
    selectedTables: string[] | null;
}

const initialState: InitialStateType = {
    currDatabase: null,
    selectedTables: null
}

const infoSlice = createSlice({
    name: "info",
    initialState,
    reducers: {
        setDatabase: (state, action) => {
            state.currDatabase = action.payload
        },
        setTable: (state, action) => {
            state.selectedTables = action.payload
        },
    }
});

export default infoSlice.reducer;
export const {setDatabase, setTable} = infoSlice.actions;
