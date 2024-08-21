import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button";
import { fetchTableData, setCurrTab, setLoadedDatabases } from "@/redux/reducers/tableSlice";
import { setLoadingText } from "@/redux/reducers/infoSlice";

export const TableArea = () => {

  const { loading, table, tabs, currTab, loadedDatabases } = useAppSelector(state => state.table);
  const { currDatabase } = useAppSelector(state => state.info);
  const dispatch = useAppDispatch();

  if (tabs.length === 0)
    return (
      <section className="flex h-full overflow-auto">
        <Table>
          <TableBody className="border-b">
            {Array.from({ length: 100 }).map((_, row: number) => (
              <TableRow key={row}>
                {Array.from({ length: 10 }).map((_, col: number) => (
                  <TableCell key={`${row}-${col}`} className="border border-slate-300"><div className="w-20" /></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    );

  const handleNumberClicked = async (tableName: string) => {
    dispatch(setLoadingText(`Fetching ${tableName}`));
    dispatch(setLoadedDatabases(currDatabase));
    if (tabs.includes(tableName)) {
      await dispatch(setCurrTab(tabs.indexOf(tableName)));
    } else {
      await dispatch(fetchTableData({ databaseName: currDatabase || "", tableName }));
    }
    dispatch(setLoadingText(null));
  };

  return (
    <section className="flex h-full overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-slate-100">
          <TableRow>
            <TableHead className="border-r font-bold text-slate-700">ID</TableHead>
            {Object.keys(table[currTab || 0][0]).map((head: string, index: number) => (
              <TableHead key={index} className="whitespace-nowrap font-bold text-slate-700 border-r">{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="border-b">
          {table[currTab || 0].map((row: string[], rowIndex: number) => (
            <TableRow key={`row-${rowIndex}`} className="overflow-hidden">
              <TableCell className="border-r text-slate-600">{++rowIndex}</TableCell>
              {Object.values(row).map((col: string, colIndex: number) => (
                <TableCell key={`col-${colIndex}`} className="border-r p-0">
                  {(colIndex === 0 && tabs[currTab || 0].toString().includes('Summary') && loadedDatabases[currTab || 0]?.split('_')[1] === 'cdr')
                    ? <Button variant="link" onClick={() => handleNumberClicked(col)}>{col ? col.toString() : col}</Button>
                    : <div key={`${rowIndex}-${colIndex}`} className="text-slate-700 max-h-20 overflow-auto p-2">{col ? col.toString() : col}</div>
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};