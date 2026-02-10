import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Users, Image, Shield } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_posts: 0,
    total_admins: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("accounts/admin/stats/");
        setStats(res.data);
      } catch (err) {
        console.error("ADMIN STATS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Overview</h2>

      {loading ? (
        <div className="text-gray-400">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* USERS */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-gray-400">Total Users</h2>
              <p className="text-3xl font-bold">
                {stats.total_users}
              </p>
            </div>
            <Users className="w-10 h-10 text-purple-400" />
          </div>

          {/* POSTS */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-gray-400">Total Posts</h2>
              <p className="text-3xl font-bold">
                {stats.total_posts}
              </p>
            </div>
            <Image className="w-10 h-10 text-purple-400" />
          </div>

          {/* ADMINS */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-gray-400">Admin Accounts</h2>
              <p className="text-3xl font-bold">
                {stats.total_admins}
              </p>
            </div>
            <Shield className="w-10 h-10 text-purple-400" />
          </div>

        </div>
      )}

      {/* ================= RECENT ACTIVITY SECTION ================= */}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">
          Recent Activity
        </h3>

        <p className="text-gray-400 mb-4">
          View all user actions including logins, posts, comments, likes.
        </p>

        <button
          onClick={() => navigate("/admin/activity")}
          className="px-4 py-2 bg-purple-600 rounded-xl hover:bg-purple-700 transition"
        >
          View Activity Logs
        </button>
      </div>

    </div>
  );
}
