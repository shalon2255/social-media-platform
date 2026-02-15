import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  X,
  MoreVertical,
  ArrowLeft,
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
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  window.addEventListener("keydown", handleEscape);
  document.body.style.overflow = "hidden";

  return () => {
    window.removeEventListener("keydown", handleEscape);
    document.body.style.overflow = "auto";
  };
}, [onClose]);
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
    onRefresh();

  } catch (err) {
    console.error("COMMENT ERROR:", err);
    alert("Failed to post comment ❌");
  } finally {
    setPosting(false);
  }
};


  const handleUpdate = async (commentId) => {
    if (!editingText.trim()) return;

    try {
          await axiosInstance.patch(
      `comments/${commentId}/`,
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


  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await axiosInstance.delete(`comments/${commentId}/`);

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
    <>

       {/* MOBILE: Full Screen View */}
<div
  className="lg:hidden fixed inset-0 bg-black/70 z-50 flex flex-col"
  onClick={onClose}
>
  {/* INNER WRAPPER (prevents inside click from closing) */}
  <div
    className="flex flex-col bg-gray-900 h-full"
    onClick={(e) => e.stopPropagation()}
  >

    {/* MOBILE HEADER */}
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h2 className="text-lg font-bold">Comments</h2>
      <div className="w-6"></div>
    </div>

    {/* MOBILE POST PREVIEW */}
    <div className="border-b border-gray-800">
      <img
        src={post.image}
        alt="post"
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <p className="text-sm text-gray-300">
          <span
            onClick={() => navigate(`/profile/${post.user_username}`)}
            className="font-semibold text-white cursor-pointer hover:underline"
          >
            @{post.user_username}
          </span>{" "}
          <span className="text-gray-400">{post.caption}</span>
        </p>

        <div className="flex gap-4 text-gray-400 text-xs mt-3">
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

    {/* MOBILE COMMENTS LIST */}
    <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4 space-y-2 text-left">
      {loading ? (
        <p className="text-gray-400 text-center py-4">Loading...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No comments yet</p>
      ) : (
        comments.map((c) => (
          <div
            key={c.id}
            className="flex items-start justify-between text-sm text-gray-300 leading-snug pb-3 border-b border-gray-800 last:border-0"
          >
            <div className="pr-2 flex-1">
              <span
                onClick={() => navigate(`/profile/${c.user_username}`)}
                className="font-semibold text-white cursor-pointer hover:underline"
              >
                @{c.user_username}
              </span>

              {editingId === c.id ? (
                <>
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="ml-2 bg-black border border-gray-700 rounded px-2 py-1 text-white text-sm w-full mt-1"
                  />
                  <button
                    onClick={() => handleUpdate(c.id)}
                    className="ml-2 text-purple-400 hover:underline text-xs mt-1"
                  >
                    Save
                  </button>
                </>
              ) : (
                <span className="text-gray-300">{` ${c.text}`}</span>
              )}
            </div>

            {Number(c.user) === Number(myUserId) && (
              <div className="relative shrink-0 ml-2">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === c.id ? null : c.id)
                  }
                  className="p-1 bg-gray-800 hover:bg-gray-700 rounded transition"
                >
                  <MoreVertical className="w-4 h-4 text-gray-300" />
                </button>

                {openMenuId === c.id && (
                  <div className="absolute right-0 mt-1 w-28 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-50 shadow-lg">
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditingText(c.text);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-200 hover:bg-purple-600/30 transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-600/30 transition"
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

    {/* MOBILE INPUT */}
    <div className="p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
      />
      <button
        onClick={handleSend}
        disabled={posting || !text.trim()}
        className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition text-sm font-semibold"
      >
        {posting ? "..." : "Send"}
      </button>
    </div>

  </div>
</div>


      {/* DESKTOP: Side-by-side View */}
    <div className="hidden lg:flex fixed inset-0 bg-black/80 z-50 items-center justify-center p-4">


  <button
    onClick={onClose}
    className="absolute right-80 top-20 text-white hover:text-red-500 transition"
  >
    <X className="w-8 h-8" />
  </button>

        <div className="bg-gray-900 w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden flex relative">

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
            <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4 space-y-2 text-left">
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : comments.length === 0 ? (
                <p className="text-gray-400">No comments yet</p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start justify-between text-sm text-gray-300 leading-snug pb-2"
                  >
                    {/* COMMENT TEXT */}
                    <div className="pr-2 flex-1">
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
                            className="ml-2 bg-black border border-gray-700 rounded px-2 py-1 text-white text-sm w-full mt-1"
                          />
                          <button
                            onClick={() => handleUpdate(c.id)}
                            className="ml-2 text-purple-400 hover:underline text-xs mt-1"
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-300">{` ${c.text}`}</span>
                      )}
                    </div>

                    {/* ✅ 3 DOT MENU — ONLY OWNER */}
                    {Number(c.user) === Number(myUserId) && (
                      <div className="relative shrink-0 ml-2">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === c.id ? null : c.id
                            )
                          }
                          className="p-1 bg-gray-800 hover:bg-gray-700 rounded transition cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-300" />
                        </button>

                        {openMenuId === c.id && (
                          <div className="absolute right-0 mt-1 w-28 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-50 shadow-lg">
                            <button
                              onClick={() => {
                                setEditingId(c.id);
                                setEditingText(c.text);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-gray-200 hover:bg-purple-600/30 transition"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-600/30 transition"
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
                className="flex-1 px-3 py-2 rounded-lg bg-black border border-gray-700 text-white focus:outline-none focus:border-purple-500 transition"
              />
              <button
                onClick={handleSend}
                disabled={posting || !text.trim()}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition font-semibold"
              >
                {posting ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}