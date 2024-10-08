import { BottomBar } from "@/components/bottom-bar";
import { Sidebar } from "@/components/sidebar";
import { TableArea } from "@/components/table-area";
import { Tabs } from "./components/tabs";
import { Loader } from "./components/loader";

const App = () => {
  return (
    <main className="flex h-screen w-full">
      <Sidebar />
      <section className="flex flex-col w-[calc(100vw-200px)] h-full">
        <Tabs />
        <TableArea />
        <BottomBar />
      </section>
      <Loader />
    </main>
  );
};

export default App;