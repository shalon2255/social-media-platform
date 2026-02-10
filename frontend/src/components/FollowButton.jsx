import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function FollowButton({
  userId,
  isInitiallyFollowing,
  onFollowChange
}) {
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
  const [loading, setLoading] = useState(false);

  // 🔁 Keep state in sync if parent updates
  useEffect(() => {
    setIsFollowing(isInitiallyFollowing);
  }, [isInitiallyFollowing]);

  const toggleFollow = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.post(
        `accounts/follow/${userId}/`
      );

      setIsFollowing(res.data.followed);

      // 🔥 notify parent (UserProfile)
      if (onFollowChange) {
        onFollowChange(res.data.followed);
      }
    } catch (err) {
      console.error("FOLLOW ERROR:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={toggleFollow}
      className={`px-5 py-2 rounded-xl font-semibold transition-all ${
        isFollowing
          ? "bg-gray-700 hover:bg-gray-600"
          : "bg-blue-600 hover:bg-blue-700"
      } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {loading
        ? "Please wait..."
        : isFollowing
        ? "Unfollow"
        : "Follow"}
    </button>
  );
}
