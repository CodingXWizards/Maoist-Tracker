import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTableNames } from "@/redux/reducers/tableNameSlice";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { setTable } from "@/redux/reducers/infoSlice";

export const BottomBar = () => {

  const { currDatabase } = useAppSelector(state => state.info);
  const { loading, tableNames } = useAppSelector(state => state.tableName);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currDatabase)
      dispatch(fetchTableNames(currDatabase));
  }, [currDatabase]);

  if (!currDatabase) return <footer className="h-14 w-full border-t border-slate-400 flex items-center px-4">
    <p>No Tables</p>
  </footer>


  return (
    <footer className="h-14 no-scrollbar w-full border-t border-slate-400 flex items-center gap-x-2 px-2 overflow-x-auto">
      {loading === 'Pending' && <p> No Tables</p>}
      {loading === 'Fullfilled' && tableNames.length === 0
        ? <p>No Tables</p>
        : tableNames.map((tableName: string, index: number) => (
          <Button key={index} size='sm' onClick={()=> dispatch(setTable(tableName))}>{tableName.split("_").splice(-1)}</Button>
        ))
      }
    </footer >
  );
};