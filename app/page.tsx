import Sidebar from "@/components/sidebar";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <Sidebar />

        <main className="p-6">Finsync FTW</main>
      </div>
    </div>
  );
}
