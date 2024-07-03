import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "./ui/button";
import { setCurrTab } from "@/redux/reducers/tableSlice";
import { cn } from "@/lib/utils";

export const Tabs = () => {

    const { tabs, currTab } = useAppSelector(state => state.table);
    const dispatch = useAppDispatch();

    return (
        <header className="h-10 border-b flex items-center border-slate-400 p-2 pt-4 text-sm">
            {tabs.length === 0
                ? <></>
                : tabs.map((tab: string, index: number) => (
                    <Button
                        key={index}
                        size="sm"
                        variant="ghost"
                        className={cn(
                            "rounded-md rounded-b-none hover:bg-transparent text-slate-600",
                            tab === tabs[currTab || 0] && "border border-b-0 border-slate-400 text-slate-800 bg-white hover:bg-white font-semibold",
                        )}
                        onClick={() => dispatch(setCurrTab(index))}
                    >{tab}</Button>
                ))
            }
        </header>
    );
};
