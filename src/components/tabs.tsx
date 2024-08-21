import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrTab, setTableData, updateTabs } from "@/redux/reducers/tableSlice";
import { cn } from "@/lib/utils";
import { LucideX } from "lucide-react";
import { setLoadingText } from "@/redux/reducers/infoSlice";
import React from "react";

export const Tabs = () => {

    const { tabs, currTab, table } = useAppSelector(state => state.table);
    const dispatch = useAppDispatch();

    const handleTabRemove = async (tab: string, index: number) => {
        dispatch(setLoadingText(`Removing ${tab}`));
        const newTabs = tabs.filter(t => t !== tab);
        await dispatch(setCurrTab(newTabs.length - 1 > 0 ? newTabs.length - 1 : null));
        await dispatch(updateTabs(newTabs));
        await dispatch(setTableData(table.filter((_, i: number) => i !== index)));
        dispatch(setLoadingText(null));
    }

    const handleTabChange = async (tab: string, index: number) => {
        dispatch(setLoadingText(`Switching Tab to ${tab}`));
        await dispatch(setCurrTab(index))
        dispatch(setLoadingText(null));
    }

    return (
        <header className="h-10 border-b flex items-center border-slate-400 p-2 px-4 text-sm">
            {tabs.length !== 0 && tabs.map((tab: string, index: number) => (
                <React.Fragment key={`div-${index}`}>
                    <div className={cn("flex items-center gap-x-2 hover:bg-slate-200 p-1 px-3 pr-2 rounded", currTab === index && "bg-slate-200")}>
                        <button className="" onClick={() => handleTabChange(tab, index)}>{tab}</button>
                        <LucideX onClick={() => handleTabRemove(tab, index)} className="w-5 h-5 text-gray-700 hover:bg-gray-300 rounded p-0.5" />
                    </div>
                    {tabs.length - 1 !== index && <hr className="h-6 border-l border-gray-400 mx-3" />}
                </React.Fragment>
            ))}
        </header>
    );
};
