import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      // ✅ Use NORMAL posts API
      const res = await axiosInstance.get("/posts/");

      setPosts(res.data);
    } catch (err) {
      console.error("Admin posts error:", err);
      alert("Failed to load posts ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      // ✅ Delete using normal posts endpoint
      await axiosInstance.delete(`/posts/${postId}/`);

      alert("Post deleted ✅");
      fetchPosts();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Posts</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800 rounded-xl">
            <thead className="bg-gray-900">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">User</th>
                <th className="py-3 px-6 text-left">Caption</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-gray-800">
                  <td className="py-4 px-6">{post.id}</td>

                  {/* username comes from PostSerializer */}
                  <td className="py-4 px-6 text-left">
                    @{post.username || post.user}
                  </td>

                  <td className="py-4 px-6 text-left">
                    {post.caption
                      ? post.caption.slice(0, 40)
                      : "No caption"}
                  </td>
                  <td className="py-4 px-6 text-left text-gray-400">
                     {post.created_at}
                      </td>

                  <td className="py-4 px-6 text-left">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
