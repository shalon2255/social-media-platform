import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { MoreVertical, Trash2, Edit3, X } from "lucide-react";

export default function MyPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState("");

  const fetchPost = async () => {
    try {
      const res = await axiosInstance.get(`posts/${id}/`);
      setPost(res.data);
      setCaption(res.data.caption);
    } catch {
      alert("Post not found ❌");
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axiosInstance.delete(`posts/${id}/`);
      alert("Post deleted ✅");
      navigate("/profile");
    } catch {
      alert("Delete failed ❌");
    }
  };

  const handleUpdate = async () => {
    try {
      await axiosInstance.patch(`posts/${id}/`, { caption });
      alert("Post updated ✅");
      setIsEditing(false);
      fetchPost();
    } catch {
      alert("Update failed ❌");
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto text-white">
      <div className="relative bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">

        {/* Image */}
        <img src={post.image} alt="post" className="w-full h-80 object-cover" />

        {/* 3 dots */}
        {post.is_owner && (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"
          >
            <MoreVertical />
          </button>
        )}

        {/* Menu */}
        {showMenu && (
          <div className="absolute top-12 right-3 bg-black border border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 w-full"
            >
              <Edit3 size={16} /> Edit
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 hover:bg-red-600 w-full text-red-400"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}

        {/* Caption */}
        <div className="p-4">
          {isEditing ? (
            <>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white"
              />

              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-emerald-500 rounded-xl text-black"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-700 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-300">{post.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}
