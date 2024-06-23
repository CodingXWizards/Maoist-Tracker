import { configureStore } from '@reduxjs/toolkit';

import databaseSlice from '@/redux/reducers/databaseSlice';
import tableNameSlice from './reducers/tableNameSlice';
import infoSlice from './reducers/infoSlice';
import tableSlice from './reducers/tableSlice';

const store = configureStore({
  reducer: {
    databases: databaseSlice,
    tableName: tableNameSlice,
    info: infoSlice,
    table: tableSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
