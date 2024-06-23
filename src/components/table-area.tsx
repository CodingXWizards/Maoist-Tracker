import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTableData } from "@/redux/reducers/tableSlice";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect } from "react";

export const TableArea = () => {

  const { currDatabase, selectedTables } = useAppSelector(state => state.info);
  const { loading, table } = useAppSelector(state => state.table);

  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (currDatabase && currTable) {
  //     dispatch(fetchTableData({ databaseName: currDatabase, tableName: currTable }));
  //   }
  // }, [currDatabase, currTable]);

  if (!currDatabase || !selectedTables)
    return (
      <section className="flex flex-grow overflow-auto">
      </section>
    );

  return (
    <section className="flex h-full overflow-auto">
      {loading === 'Pending' && <p>Loading...</p>}
      {loading === 'Fullfilled' && (table.length === 0
        ? <p>No Table Data</p>
        : <Table>
          <TableHeader>
            <TableRow>
              <TableHead>id</TableHead>
              {Object.keys(table[0]).map((head: string, index: number) => (
                <TableHead key={index}>{head}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.map((row: string[], index: number) => (
              <TableRow key={index}>
                <TableCell>{index}</TableCell>
                {Object.values(row).map((col: string, i: number) => (
                  <TableCell key={i}>{col}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>)
      }
    </section>
  );
};