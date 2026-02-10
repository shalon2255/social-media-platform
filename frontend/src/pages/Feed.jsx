import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import PostCommentModal from "../components/PostCommentModal";

import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  User,
  TrendingUp,
  Hash,
  Users,
} from "lucide-react";

// =========================
// TIME FORMATTER FUNCTION
// =========================
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Feed() {
  const navigate = useNavigate();
  const myUserId = Number(localStorage.getItem("user_id"));

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);
  const [showSavedPopup, setShowSavedPopup] = useState(false);

  // =========================
  // FETCH POSTS
  // =========================
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("posts/");
      setPosts(res.data);
    } catch (err) {
      console.log("FEED ERROR:", err.response || err);
      alert("Error loading posts ❌");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // =========================
  // AUTO REFRESH TIME EVERY MINUTE
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // USER NAVIGATION
  // =========================
  const handleUserClick = (user) => {
    const clickedUserId =
      typeof user === "object" && user !== null
        ? Number(user.id)
        : Number(user);

    if (clickedUserId === myUserId) {
      navigate("/profile");
    } else {
      navigate(`/users/${clickedUserId}`);
    }
  };

  // =========================
  // LIKE / UNLIKE
  // =========================
  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const currentLikes = Number(post.likes) || 0;

        return {
          ...post,
          is_liked: !post.is_liked,
          likes: post.is_liked ? currentLikes - 1 : currentLikes + 1,
        };
      })
    );

    try {
      await axiosInstance.post(`posts/${postId}/like/`);
    } catch (err) {
      console.log("LIKE ERROR:", err.response || err);
    }
  };

  // =========================
  // FAKE SAVE POPUP
  // =========================
  const handleFakeSave = () => {
    setShowSavedPopup(true);
    setTimeout(() => setShowSavedPopup(false), 1500);
  };

  return (
    <div className="flex gap-6 h-full">
      {/* LEFT SIDEBAR - Hidden on mobile */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-5 sticky top-0">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Trending Now
          </h3>
          {["#TechLife", "#Photography", "#Vibes", "#AI", "#Coding"].map((tag) => (
            <div
              key={tag}
              className="py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 -mx-2 px-2 rounded cursor-pointer transition"
            >
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <p className="text-gray-300">{tag}</p>
              </div>
              <p className="text-xs text-gray-500 ml-6">12.5K posts</p>
            </div>
          ))}
        </div>
      </aside>

      {/* CENTER - POSTS (One by one) */}
      <main className="flex-1 max-w-2xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-900/30 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition"
              >
                {/* POST HEADER */}
                <div className="p-4 flex items-center justify-between">
                  <div
                    onClick={() => handleUserClick(post.user)}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="font-semibold hover:underline">
                        @{post.user_username}
                      </p>
                      <p className="text-xs text-gray-400">
                        {post.created_at ? formatTimeAgo(post.created_at) : ""}
                      </p>
                    </div>
                  </div>

                  <button>
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* IMAGE - Original size */}
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-auto object-cover"
                />

                {/* CAPTION - Aligned to left edge */}
                <div className="pl-4 pr-4 pt-3 pb-2">
                  <p className="text-sm text-left">
                    <span className="font-semibold">@{post.user_username}</span>{" "}
                    <span className="text-gray-300">{post.caption || "No caption"}</span>
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="pl-4 pr-4 pb-4 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-1 hover:text-pink-500 transition"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          post.is_liked ? "text-pink-500 fill-pink-500" : ""
                        }`}
                      />
                      <span className="text-sm">{post.likes ?? 0}</span>
                    </button>

                    <button
                      onClick={() => setActivePost(post)}
                      className="flex items-center space-x-1 hover:text-blue-500 transition"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-sm">{post.comments ?? 0}</span>
                    </button>

                    <button className="hover:text-green-500 transition">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>

                  <button
                    onClick={handleFakeSave}
                    className="hover:text-yellow-500 transition"
                  >
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No posts found 😢
              </div>
            )}
          </div>
        )}
      </main>

      {/* RIGHT SIDEBAR - Empty space */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        {/* Empty - reserved for future features */}
      </aside>

      {/* COMMENT MODAL */}
      {activePost && (
        <PostCommentModal
          post={activePost}
          onClose={() => setActivePost(null)}
          onRefresh={fetchPosts}
        />
      )}

      {/* SAVED POPUP */}
      {showSavedPopup && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-xl shadow-lg border border-gray-700 z-50">
          ✅ Post saved
        </div>
      )}
    </div>
  );
}