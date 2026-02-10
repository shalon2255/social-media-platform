import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Clock, User, Activity } from "lucide-react";

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get("accounts/admin/activity/");

      setLogs(res.data);
    } catch (err) {
      console.error("ACTIVITY LOG ERROR:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load activity log ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Activity Logs</h2>

      {loading && (
        <p className="text-gray-400">Loading activity logs...</p>
      )}

      {error && (
        <div className="bg-red-900/20 text-red-400 p-4 rounded-xl border border-red-800">
          {error}
        </div>
      )}

      {!loading && logs.length === 0 && !error && (
        <p className="text-gray-400">No activity recorded yet.</p>
      )}

      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="bg-purple-900/20 p-3 rounded-xl text-purple-400">
              <Activity />
            </div>

            <div className="flex-1">
              <p className="text-white font-semibold">
                {log.message}
              </p>

              <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {log.username}
                </span>

                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
