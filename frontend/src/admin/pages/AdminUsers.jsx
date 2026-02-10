import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem("user_id");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("accounts/admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axiosInstance.delete(`accounts/admin/users/${id}/`);
      alert("User deleted successfully ✅");
      fetchUsers();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-800 rounded-xl overflow-hidden">
         <thead className="bg-black text-gray-300">
  <tr>
    <th className="p-4 pl-5 text-left">ID</th>
    <th className="p-4 text-left">Username</th>
    <th className="p-4 text-left">Email</th>
    <th className="p-4 text-left">Role</th>
    <th className="p-4 text-left">Status</th>
    <th className="p-4 pr-5 text-right">Action</th>
  </tr>
</thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-800 hover:bg-gray-900/50 transition"
              >
                <td className="p-4 pl-5 text-left">{user.id}</td>

                <td className="p-4 text-left font-semibold">@{user.username}</td>

                <td className="p-4 text-left  text-gray-400">{user.email}</td>

                <td className="p-4 text-left">
                  {user.is_staff ? (
                    <span className="px-3 py-1  bg-purple-600/20 text-purple-400 rounded-lg">
                      Admin
                    </span>
                  ) : (
                    <span className="px-3 py-1  bg-blue-600/20 text-blue-400 rounded-lg">
                      User
                    </span>
                  )}
                </td>

                <td className="py-4 px-6 text-left">
  {user.is_active ? (
    <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg">
      Active
    </span>
  ) : (
    <span className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg">
      Blocked
    </span>
  )}
</td>


                <td className="p-4 text-right">
                  {String(user.id) === String(currentUserId) ? (
                    <span className="text-gray-500">You</span>
                  ) : (
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl transition"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
