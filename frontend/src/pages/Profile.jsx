import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import PostCommentModal from "../components/PostCommentModal";

import {
  User,
  Image as ImageIcon,
  MoreVertical,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [activePost, setActivePost] = useState(null);

  // =========================
  // LOGOUT FUNCTION
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_id");

    navigate("/login");
  };

  // =========================
  // FETCH MY PROFILE (BACKEND TRUTH)
  // =========================
  const fetchMyProfile = async () => {
    try {
      setLoading(true);
      setPosts([]); // Clear posts while loading

      const [userRes, postsRes] = await Promise.all([
        axiosInstance.get("/accounts/me/"),
        axiosInstance.get("/posts/?mine=1"),
      ]);

      console.log("✅ Profile Data Updated:", userRes.data);
      console.log("📊 Followers:", userRes.data.followers_count, "Following:", userRes.data.following_count);

      setProfileUser(userRes.data);
      setFollowersCount(userRes.data.followers_count || 0);
      setFollowingCount(userRes.data.following_count || 0);
      
      // Handle both array and paginated response
      if (Array.isArray(postsRes.data)) {
        setPosts(postsRes.data);
      } else if (postsRes.data?.results && Array.isArray(postsRes.data.results)) {
        setPosts(postsRes.data.results);
      } else {
        setPosts([]);
      }

    } catch (err) {
      console.error("❌ PROFILE ERROR:", err.response?.data || err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchMyProfile();
  }, []);

  // sync after follow/unfollow anywhere
  useEffect(() => {
    const sync = () => {
      console.log("🔄 Follow status updated, refreshing profile...");
      fetchMyProfile();
    };
    window.addEventListener("follow-updated", sync);
    return () => window.removeEventListener("follow-updated", sync);
  }, []);

  // sync after profile edit
  useEffect(() => {
    const sync = () => {
      console.log("🔄 Profile edited, refreshing...");
      fetchMyProfile();
    };
    window.addEventListener("profile-updated", sync);
    return () => window.removeEventListener("profile-updated", sync);
  }, []);

  // sync after post creation
  useEffect(() => {
    const sync = () => {
      console.log("🔄 New post created, refreshing...");
      fetchMyProfile();
    };
    window.addEventListener("post-created", sync);
    return () => window.removeEventListener("post-created", sync);
  }, []);

  // Auto refresh followers/following every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      axiosInstance.get("/accounts/me/").then((res) => {
        setFollowersCount(res.data.followers_count || 0);
        setFollowingCount(res.data.following_count || 0);
      }).catch(err => console.error("Auto-refresh error:", err));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // LIKE / UNLIKE (OPTIMISTIC)
  // =========================
  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              is_liked: !post.is_liked,
              likes: post.is_liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );

    try {
      await axiosInstance.post(`/posts/${postId}/like/`);
    } catch (err) {
      console.error("LIKE ERROR:", err.response?.data || err.message);
      // Revert on error
      fetchMyProfile();
    }
  };

  // =========================
  // DELETE POST
  // =========================
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axiosInstance.delete(`/posts/${postId}/`);
      setOpenMenuId(null);
      fetchMyProfile();
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <main className="container mx-auto px-4 py-6">

        {/* PROFILE HEADER */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <User className="w-7 h-7" />
              </div>

              <div>
                <h1 className="text-2xl font-bold pt-3 pe-3">
                  {profileUser?.username ? profileUser.username : "Loading..."}
                </h1>

                <p className="text-gray-400 text-sm ">
                  {posts.length} Posts · {followersCount} Followers · {followingCount} Following
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => navigate("/profile/edit")}
                    className="px-4 py-1 text-xs font-semibold border border-gray-600 rounded-lg hover:bg-white/5 transition"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-1 text-xs font-semibold border border-red-700 text-red-400 rounded-lg hover:bg-red-500/10 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* POSTS */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold">Posts</h2>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              <p className="mt-2">Loading posts…</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              No posts yet 😶
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden relative group"
                >
                  {/* MENU */}
                  <div className="absolute top-2 right-2 z-20">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === post.id ? null : post.id)
                      }
                      className="p-2 rounded-lg bg-black/60 hover:bg-black/80 transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuId === post.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-black border border-gray-700 rounded-lg overflow-hidden shadow-lg z-30">
                        <button
                          onClick={() =>
                            navigate(`/mypost/${post.id}`, {
                              state: { mode: "edit" },
                            })
                          }
                          className="w-full px-3 py-2 text-xs text-left hover:bg-white/10 transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="w-full px-3 py-2 text-xs text-left hover:bg-red-500/20 text-red-400 transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <img
                    src={post.image}
                    alt="post"
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = "/default-post.png";
                    }}
                  />

                  <div className="p-4">
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {post.caption || "No caption"}
                    </p>

                    <div className="flex items-center gap-6 border-t border-gray-800 pt-3">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 hover:text-pink-500 transition text-sm"
                      >
                        <Heart
                          className={`w-5 h-5 transition ${
                            post.is_liked
                              ? "text-pink-500 fill-pink-500"
                              : ""
                          }`}
                        />
                        <span>{post.likes ?? 0}</span>
                      </button>

                      <button
                        onClick={() => setActivePost(post)}
                        className="flex items-center gap-1 hover:text-blue-400 transition text-sm"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments ?? 0}</span>
                      </button>

                      <button className="flex items-center gap-1 hover:text-green-500 transition text-sm">
                        <Share2 className="w-5 h-5" />
                      </button>

                      <button className="flex items-center gap-1 hover:text-yellow-500 transition text-sm ml-auto">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {activePost && (
        <PostCommentModal
          post={activePost}
          onClose={() => setActivePost(null)}
          onRefresh={fetchMyProfile}
        />
      )}
    </div>
  );
}