import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Image, Menu } from "lucide-react";

export default function AdminSidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-black border-b border-gray-800">
        <h2 className="text-xl font-bold text-purple-400">Admin Panel</h2>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-gray-900 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`
        fixed lg:static top-0 left-0 z-50
        h-full w-72 bg-black border-r border-gray-800
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-purple-400 hidden lg:block">
            Admin Panel
          </h2>

          <nav className="space-y-3">
            <NavLink
              to="/admin"
              end
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-purple-600"
                    : "hover:bg-white/10"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/users"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-purple-600"
                    : "hover:bg-white/10"
                }`
              }
            >
              <Users className="w-5 h-5" />
              Users
            </NavLink>

            <NavLink
              to="/admin/posts"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-purple-600"
                    : "hover:bg-white/10"
                }`
              }
            >
              <Image className="w-5 h-5" />
              Posts
            </NavLink>
          </nav>
        </div>
      </aside>
      <NavLink
  to="/admin/activity"
  className={({ isActive }) =>
    `block px-4 py-2 rounded-xl ${
      isActive ? "bg-purple-600" : "hover:bg-white/10"
    }`
  }
>
  Activity Logs
</NavLink>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
