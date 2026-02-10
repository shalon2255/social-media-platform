import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { User } from "lucide-react";

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `accounts/search/?q=${query}`
        );
        setUsers(res.data);
      } catch (err) {
        console.error("SEARCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto text-white">
      <h1 className="text-xl font-bold mb-4 text-center">
        Search Results for “{query}”
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Searching...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-400">No users found</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => navigate(`/users/${user.id}`)}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-gray-800 hover:bg-gray-800 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>

              <p className="font-semibold">@{user.username}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
