import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex bg-gray-950 text-white">
      
      {/* SIDEBAR - Fixed width */}
      <aside className="w-72 h-full border-r border-gray-800 overflow-y-auto bg-black flex-shrink-0">
        <AdminSidebar />
      </aside>

      {/* MAIN CONTENT - Takes remaining space */}
      <main className="flex-1 h-full flex flex-col">
        
        {/* TOP BAR */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-black flex-shrink-0">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700 transition"
          >
            Exit Admin
          </button>
        </header>

        {/* PAGE CONTENT - Full width, scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-950 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}