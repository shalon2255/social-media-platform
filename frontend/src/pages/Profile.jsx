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

      const [userRes, postsRes] = await Promise.all([
        axiosInstance.get("/api/accounts/me/"),
        axiosInstance.get("posts/?mine=1"),
      ]);

      setProfileUser(userRes.data);
      setFollowersCount(userRes.data.followers_count);
      setFollowingCount(userRes.data.following_count);
      setPosts(postsRes.data);

    } catch (err) {
      console.error("PROFILE ERROR:", err.response || err);
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
    const sync = () => fetchMyProfile();
    window.addEventListener("follow-updated", sync);
    return () => window.removeEventListener("follow-updated", sync);
  }, []);

  // sync after profile edit
  useEffect(() => {
    const sync = () => fetchMyProfile();
    window.addEventListener("profile-updated", sync);
    return () => window.removeEventListener("profile-updated", sync);
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
      await axiosInstance.post(`posts/${postId}/like/`);
    } catch (err) {
      console.error("LIKE ERROR:", err.response || err);
    }
  };

  // =========================
  // DELETE POST
  // =========================
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axiosInstance.delete(`posts/${postId}/`);
      setOpenMenuId(null);
      fetchMyProfile();
    } catch {
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <main className="container mx-auto px-4 py-6">

        {/* PROFILE HEADER */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between">

            {/* LEFT */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700">
                <img
                  src={
                    profileUser?.profile_image
                      ? `${import.meta.env.VITE_API_BASE_URL}${profileUser.profile_image}`
                      : "/default-avatar.png"
                  }
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">
                  @{profileUser?.username}
                </h1>

                <p className="text-gray-400 text-sm mb-3">
                  {posts.length} Posts · {followersCount} Followers · {followingCount} Following
                </p>

                {/* BIO */}
                {profileUser?.bio && (
                  <p className="text-gray-300 text-sm max-w-md">
                    {profileUser.bio}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT - EDIT + LOGOUT */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/profile/edit")}
                className="px-4 py-2 border border-gray-700 rounded-xl hover:bg-white/10"
              >
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-700 text-red-400 rounded-xl hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>

          </div>
        </div>

        {/* POSTS SECTION */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold">Posts</h2>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-400">Loading…</div>
          ) : posts.length === 0 ? (
            <div className="py-10 text-center text-gray-400">No posts yet 😢</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="relative bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden"
                >

                  {/* MENU */}
                  <div className="absolute top-2 right-2 z-20">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === post.id ? null : post.id)
                      }
                      className="p-2 rounded-lg bg-black/60"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuId === post.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-black border border-gray-700 rounded-xl overflow-hidden">
                        <button
                          onClick={() =>
                            navigate(`/mypost/${post.id}`, {
                              state: { mode: "edit" },
                            })
                          }
                          className="w-full px-4 py-3 text-left hover:bg-white/10"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="w-full px-4 py-3 text-left hover:bg-red-500/20 text-red-400"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* IMAGE */}
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full h-48 object-cover"
                  />

                  {/* CONTENT */}
                  <div className="p-4">
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {post.caption || "No caption"}
                    </p>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-6 border-t border-gray-800 pt-3">

                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 hover:text-pink-500"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            post.is_liked
                              ? "text-pink-500 fill-pink-500"
                              : ""
                          }`}
                        />
                        <span>{post.likes ?? 0}</span>
                      </button>

                      <button
                        onClick={() => setActivePost(post)}
                        className="flex items-center gap-1 hover:text-blue-500"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments ?? 0}</span>
                      </button>

                      <Share2 className="w-5 h-5 hover:text-green-500" />
                      <Bookmark className="w-5 h-5 hover:text-yellow-500 ml-auto" />
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