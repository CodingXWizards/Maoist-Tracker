import { FormEvent, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchDatabases } from "@/redux/reducers/databaseSlice";
import { setDatabase, setTable } from "@/redux/reducers/infoSlice";
import { fetchTableNames } from "@/redux/reducers/tableNameSlice";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { generateSummaryCDR, setTableData } from "@/redux/reducers/tableSlice";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import Papa from 'papaparse'
import { saveAs } from 'file-saver';

enum databaseTypes {
  Tower = 'tower',
  CDR = 'cdr',
  IPDR = 'ipdr',
  IMEI = 'imei'
};

export const Sidebar = () => {

  const { loading: loadingDatabase, databases } = useAppSelector(state => state.databases);
  const { loading: loadingTables, tableNames } = useAppSelector(state => state.tableName);
  const { loading: loadingData, table, currTab, tabs } = useAppSelector(state => state.table);

  const { currDatabase, selectedTables } = useAppSelector(state => state.info);
  const [type, setType] = useState<databaseTypes>(databaseTypes.Tower);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDatabases());
  }, []);

  useEffect(() => {
    if (currDatabase)
      dispatch(fetchTableNames(currDatabase));
  }, [currDatabase]);

  const handleValueChange = (value: string) => {
    let selectedTabl = [];
    if (selectedTables && selectedTables.includes(value)) {
      selectedTabl = selectedTables.filter(item => item !== value);
    } else {
      selectedTabl = selectedTables ? [...selectedTables, value] : [value];
    }
    dispatch(setTable(selectedTabl)); // Update this if you need to handle multiple selections differently
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currDatabase && selectedTables) {
      dispatch(generateSummaryCDR({ databaseName: currDatabase, tableNames: selectedTables }));
    }
  }

  const handleXLSXExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(table[currTab || 0]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    XLSX.writeFile(workbook, `${tabs[currTab || 0]}.xlsx`)
  }

  const handleCSVExport = () => {
    const csvContent = Papa.unparse(table[currTab || 0]); // Convert data to CSV string
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, tabs[currTab || 0]);
  }

  return (
    <form onSubmit={handleSubmit} className="w-[200px] h-full border-r border-slate-400 flex text-sm flex-col items-center gap-y-2 p-2">
      <div className="w-full grid grid-cols-2 px-4 justify-between">
        <div className="flex items-center gap-x-2">
          <input type="radio" id="tdr" checked={type == databaseTypes.Tower} onChange={() => setType(databaseTypes.Tower)} />
          <label htmlFor="tdr">TDR</label>
        </div>
        <div className="flex items-center gap-x-2">
          <input type="radio" id="cdr" checked={type == databaseTypes.CDR} onChange={() => setType(databaseTypes.CDR)} />
          <label htmlFor="cdr">CDR</label>
        </div>
        <div className="flex items-center gap-x-2">
          <input type="radio" id="ipdr" checked={type == databaseTypes.IPDR} onChange={() => setType(databaseTypes.IPDR)} />
          <label htmlFor="ipdr">IPDR</label>
        </div>
        <div className="flex items-center gap-x-2">
          <input type="radio" id="imei" checked={type == databaseTypes.IMEI} onChange={() => setType(databaseTypes.IMEI)} />
          <label htmlFor="imei">IMEI</label>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full bg-primary text-primary-foreground p-1.5 rounded-md">{loadingDatabase === 'Pending' ? "loading..." : currDatabase?.split("_").splice(-1) || "Select Database"}</DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-60 overflow-auto">
          {loadingDatabase === 'Pending' && (<DropdownMenuItem>Loading...</DropdownMenuItem>)}
          {loadingDatabase === 'Rejected' && (<DropdownMenuItem>Error Loading...</DropdownMenuItem>)}
          {loadingDatabase === 'Fullfilled' && (
            databases.length === 0
              ? <DropdownMenuItem>No Databases</DropdownMenuItem>
              : databases.map((database: string, index: number) => (
                database.split("_").includes(type) && <DropdownMenuItem key={index} onClick={() => { dispatch(setDatabase(database)); dispatch(setTable(null)); dispatch(setTableData([])) }}>{database.split("_").splice(-1)}</DropdownMenuItem>
              ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full bg-primary text-primary-foreground p-1.5 rounded-md">
          {loadingTables === 'Pending' ? "loading..." : 'Select Tables'}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-60 overflow-auto space-y-1">
          {loadingTables === 'Idle' && <DropdownMenuItem>No Tables</DropdownMenuItem>}
          {loadingTables === 'Pending' && (<DropdownMenuItem>Loading...</DropdownMenuItem>)}
          {loadingTables === 'Rejected' && (<DropdownMenuItem>Error Loading...</DropdownMenuItem>)}
          {loadingTables === 'Fullfilled' && (
            tableNames.length !== 0
              ? <>
                <DropdownMenuItem onClick={() => dispatch(setTable(tableNames))}>All Tables</DropdownMenuItem>
                {tableNames.map((tableName: string, index: number) => (
                  <DropdownMenuItem key={index} onClick={() => handleValueChange(tableName)} className={cn(selectedTables?.includes(tableName) && "bg-slate-800 text-white focus:bg-slate-800 focus:bg-opacity-95 focus:text-white")}>
                    {tableName.split("_").splice(-1)}
                  </DropdownMenuItem>
                ))}
              </>
              : <DropdownMenuItem>No Tables</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button type="submit" size="sm" className="w-full">{loadingData === 'Pending' ? "Loading..." : "Generate Summary"}</Button>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full bg-green-400 text-primary-foreground p-1.5 rounded-md">Export</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleXLSXExport}>XLSX</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCSVExport}>CSV</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
};