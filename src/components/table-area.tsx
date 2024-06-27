import { useAppSelector } from "@/redux/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const TableArea = () => {

  const { loading, table } = useAppSelector(state => state.table);

  if (table.length === 0)
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

  return (
    <section className="flex h-full overflow-auto">
      {loading === 'Pending' && <p>Loading...</p>}
      {loading === 'Fullfilled' && (table.length === 0
        ? <p>No Table Data</p>
        : <Table>
          <TableHeader className="sticky top-0 bg-slate-100">
            <TableRow>
              <TableHead className="border-r font-bold text-slate-700">ID</TableHead>
              {Object.keys(table[0]).map((head: string, index: number) => (
                <TableHead key={index} className="whitespace-nowrap font-bold text-slate-700 border-r">{head}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="border-b">
            {table.map((row: string[], rowIndex: number) => (
              <TableRow key={rowIndex} className="overflow-hidden">
                <TableCell key={`id-${rowIndex}`} className="border-r text-slate-600">{++rowIndex}</TableCell>
                {Object.values(row).map((col: string, colIndex: number) => (
                  <TableCell className="border-r p-0">
                    <div key={`${rowIndex}-${colIndex}`} className="text-slate-700 max-h-20 overflow-auto p-4">{col.toString()}</div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>)
      }
    </section>
  );
};