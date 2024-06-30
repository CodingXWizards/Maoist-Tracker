import { BottomBar } from "@/components/bottom-bar";
import { Sidebar } from "@/components/sidebar";
import { TableArea } from "@/components/table-area";

const App = () => {
  return (
    <main className="flex h-screen w-full">
      <Sidebar />
      <section className="flex flex-col w-[calc(100vw-240px)] h-full">
        <TableArea />
        <BottomBar />
      </section>
    </main>
  );
};

export default App;