import Sidebar from "@/components/sidebar";
import Activity from "@/components/Activity";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="relative">
          <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
          <Activity />
        </div>
      </div>
    </div>
  );
}
