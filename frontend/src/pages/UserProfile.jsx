import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import FollowButton from "../components/FollowButton";
import PostCommentModal from "../components/PostCommentModal";

import {
  User,
  Image as ImageIcon,
  Heart,
  MessageCircle,
} from "lucide-react";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const myUserId = Number(localStorage.getItem("user_id"));
  const isMe = myUserId === Number(userId);

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePost, setActivePost] = useState(null);

  // 🚫 SAFETY: Redirect if user opens own profile here
  useEffect(() => {
    if (isMe) {
      navigate("/profile", { replace: true });
    }
  }, [isMe, navigate]);

  // =========================
  // FETCH OTHER USER PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const [
        userRes,
        postsRes,
        followersRes,
        followingRes,
        followStatusRes,
      ] = await Promise.all([
        axiosInstance.get(`accounts/users/${userId}/`),
        axiosInstance.get(`posts/?user=${userId}`),
        axiosInstance.get(`accounts/followers/${userId}/`),
        axiosInstance.get(`accounts/following/${userId}/`),
        axiosInstance.get(`accounts/is-following/${userId}/`),
      ]);

      setProfileUser(userRes.data);
      setPosts(postsRes.data);
      setFollowersCount(followersRes.data.length);
      setFollowingCount(followingRes.data.length);
      setIsFollowing(followStatusRes.data.is_following);

    } catch (err) {
      console.error("USER PROFILE ERROR:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // =========================
  // LIKE / UNLIKE (OPTIMISTIC)
  // =========================
  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;

        const likes = Number(post.likes) || 0;

        return {
          ...post,
          is_liked: !post.is_liked,
          likes: post.is_liked ? likes - 1 : likes + 1,
        };
      })
    );

    try {
      await axiosInstance.post(`posts/${postId}/like/`);
    } catch (err) {
      console.error("LIKE ERROR:", err.response || err);
    }
  };

  // =========================
  // FOLLOW / UNFOLLOW (OPTIMISTIC + GLOBAL SYNC)
  // =========================
  const handleFollowChange = (followed) => {
    setIsFollowing(followed);
    setFollowersCount((prev) => prev + (followed ? 1 : -1));

    // 🔥 notify Profile.jsx
    window.dispatchEvent(
      new CustomEvent("follow-updated", {
        detail: { targetUserId: Number(userId), followed },
      })
    );

    setTimeout(fetchProfile, 300);
  };

  if (isMe) return null; // redirect already handled

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
                <h1 className="text-2xl font-bold">
                  @{profileUser?.username}
                </h1>

                <p className="text-gray-400 text-sm">
                  {posts.length} Posts · {followersCount} Followers · {followingCount} Following
                </p>
              </div>
            </div>

            {/* ✅ FOLLOW BUTTON ONLY FOR OTHER USERS */}
            {!isMe && (
              <FollowButton
                userId={userId}
                isInitiallyFollowing={isFollowing}
                onFollowChange={handleFollowChange}
              />
            )}
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
              Loading posts...
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
                  className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden"
                >
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {post.caption || "No caption"}
                    </p>

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
                        className="flex items-center gap-1 hover:text-blue-400"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments ?? 0}</span>
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
          onRefresh={fetchProfile}
        />
      )}
    </div>
  );
}
