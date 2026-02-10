import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  X,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PostCommentModal({ post, onClose, onRefresh }) {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // ✅ Logged-in user id from JWT
  const token = localStorage.getItem("access");
  const myUserId = token
    ? JSON.parse(atob(token.split(".")[1]))?.user_id
    : null;

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [post.id]);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(
        `posts/${post.id}/comments/`
      );
      setComments(res.data);
    } catch (err) {
      console.log("FETCH COMMENTS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // 💬 POST COMMENT
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      setPosting(true);
      const res = await axiosInstance.post(
        `posts/${post.id}/comments/`,
        { text }
      );

      setComments((prev) => [res.data, ...prev]);
      setText("");
      onRefresh(); // update count in feed/profile
    } catch {
      alert("Failed to post comment ❌");
    } finally {
      setPosting(false);
    }
  };

  // ✏️ UPDATE COMMENT
  const handleUpdate = async (commentId) => {
    if (!editingText.trim()) return;

    try {
      await axiosInstance.patch(
        `posts/comments/${commentId}/`,
        { text: editingText }
      );

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, text: editingText } : c
        )
      );

      setEditingId(null);
      setEditingText("");
      setOpenMenuId(null);
    } catch {
      alert("Failed to update comment ❌");
    }
  };

  // 🗑 DELETE COMMENT
  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await axiosInstance.delete(`posts/comments/${commentId}/`);
      setComments((prev) =>
        prev.filter((c) => c.id !== commentId)
      );
      setOpenMenuId(null);
      onRefresh(); // update count
    } catch {
      alert("Failed to delete comment ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-gray-900 w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden flex relative">

        {/* ❌ CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        {/* 🖼 LEFT — POST */}
        <div className="w-1/2 bg-black flex flex-col">
          <img
            src={post.image}
            alt="post"
            className="w-full h-full object-cover"
          />

          <div className="p-4 border-t border-gray-800">
            <p className="text-gray-300 mb-3">
              <span
                onClick={() => navigate(`/profile/${post.user_username}`)}
                className="font-semibold cursor-pointer hover:underline"
              >
                @{post.user_username}
              </span>{" "}
              {post.caption}
            </p>

            <div className="flex gap-5 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post.likes ?? 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.comments ?? 0}
              </span>
              <Share2 className="w-4 h-4" />
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 💬 RIGHT — COMMENTS */}
        <div className="w-1/2 flex flex-col border-l border-gray-800">

          {/* COMMENTS LIST */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 text-left">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-400">No comments yet</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start justify-between text-sm text-gray-300 leading-snug"
                >
                  {/* COMMENT TEXT */}
                  <div className="pr-2">
                    <span
                      onClick={() =>
                        navigate(`/profile/${c.user_username}`)
                      }
                      className="font-semibold text-white cursor-pointer hover:underline"
                    >
                      @{c.user_username}
                    </span>

                    {editingId === c.id ? (
                      <>
                        <input
                          value={editingText}
                          onChange={(e) =>
                            setEditingText(e.target.value)
                          }
                          className="ml-2 bg-black border border-gray-700 rounded px-2 py-1 text-white text-sm"
                        />
                        <button
                          onClick={() => handleUpdate(c.id)}
                          className="ml-2 text-purple-400 hover:underline"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <span>{` ${c.text}`}</span>
                    )}
                  </div>

                  {/* ✅ 3 DOT MENU — ONLY OWNER */}
                  {Number(c.user) === Number(myUserId) && (
                    <div className="relative shrink-0">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === c.id ? null : c.id
                          )
                        }
                        className="p-1 hover:bg-gray-800 rounded"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>

                      {openMenuId === c.id && (
                        <div className="absolute right-0 mt-1 w-28 bg-black border border-gray-700 rounded-lg overflow-hidden z-30">
                          <button
                            onClick={() => {
                              setEditingId(c.id);
                              setEditingText(c.text);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-white/10"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="w-full px-3 py-2 text-left hover:bg-red-500/20 text-red-400"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* INPUT */}
          <div className="p-4 border-t border-gray-800 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 rounded-lg bg-black border border-gray-700 text-white"
            />
            <button
              onClick={handleSend}
              disabled={posting || !text.trim()}
              className="px-4 py-2 rounded-lg bg-purple-600 disabled:opacity-50"
            >
              {posting ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
