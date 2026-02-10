import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // =========================
  // CLEAR SEARCH WHEN LEAVING SEARCH PAGE
  // =========================
  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setSearchQuery("");
      setSearchOpen(false);
    }
  }, [location.pathname]);

  // =========================
  // SEARCH NAVIGATION
  // =========================
  const handleSearchNavigate = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col overflow-hidden">
      {/* ================= NAVBAR ================= */}
      <header className="flex-shrink-0 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between gap-3">

            {/* LOGO */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/feed")}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">V</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                VibeConnect
              </h1>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3 flex-1 justify-end">

              {/* ================= DESKTOP SEARCH ================= */}
              <div
                className={`hidden md:flex items-center transition-all duration-300 ${
                  searchOpen ? "w-[420px]" : "w-[200px]"
                }`}
              >
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearchNavigate();
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* DESKTOP NAV */}
              <div className="hidden md:flex items-center gap-2">
                <NavBtn onClick={() => navigate("/feed")}>Feed</NavBtn>
                <NavBtn onClick={() => navigate("/create")}>Create</NavBtn>
                <NavBtn onClick={() => navigate("/profile")}>Profile</NavBtn>
              </div>
            </div>
          </div>

          {/* ================= MOBILE SEARCH ================= */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchNavigate();
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* MOBILE NAV */}
            <div className="flex gap-2 mt-3">
              <NavBtn onClick={() => navigate("/feed")} full>Feed</NavBtn>
              <NavBtn onClick={() => navigate("/create")} full>Create</NavBtn>
              <NavBtn onClick={() => navigate("/profile")} full>Profile</NavBtn>
            </div>
          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT - FULL SCREEN ================= */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */
function NavBtn({ children, onClick, full }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 ${
        full ? "flex-1" : ""
      }`}
    >
      {children}
    </button>
  );
}