import { useAppSelector } from "@/redux/hooks";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export const BottomBar = () => {

  const { currDatabase } = useAppSelector(state => state.info);
  const { table, currTab } = useAppSelector(state => state.table);


  if (!currDatabase) return <footer className="h-14 w-full border-t border-slate-400 flex items-center px-4">
  </footer>


  return (
    <footer className="h-10 no-scrollbar w-full border-t text-sm border-slate-400 flex items-center justify-between gap-x-2 px-2 overflow-x-auto">
      <p>DATABASE: {currDatabase.split("_").slice(-1)}</p>
      <p>TOTAL ENTRIES: {currTab ? table[currTab].length : 0}</p>
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-blue-600 text-primary-foreground p-1 px-3 rounded-md">Columns</DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-60 overflow-auto">
          {table.length !== 0
            ? Object.keys(table[0]).map((col: string, index: number) => (
              <DropdownMenuItem key={index} className="w-60">{col}</DropdownMenuItem>
            ))
            : <DropdownMenuItem>No Columns</DropdownMenuItem>
          }
        </DropdownMenuContent>
      </DropdownMenu>
    </footer >
  );
};