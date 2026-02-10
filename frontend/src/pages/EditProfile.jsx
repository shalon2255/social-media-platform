import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH CURRENT PROFILE
  // =========================
 useEffect(() => {
  const loadProfile = async () => {
    try {
      const res = await axiosInstance.get("accounts/me/?t=" + new Date().getTime());

      setBio(res.data.bio || "");

      if (res.data.profile_image) {
        const imageUrl = res.data.profile_image.startsWith("http")
          ? res.data.profile_image
          : `${import.meta.env.VITE_API_BASE_URL}${res.data.profile_image}`;

        setPreview(imageUrl);
      } else {
        setPreview(null);
      }

      setProfileImage(null);

    } catch (err) {
      console.error("FETCH PROFILE ERROR:", err);
      alert("Failed to load profile ❌");
    }
  };

  loadProfile();
}, []);

  // =========================
  // IMAGE PREVIEW
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =========================
  // SAVE PROFILE (REAL FIX)
  // =========================
  const handleSave = async () => {
  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("bio", bio || "");

    if (profileImage instanceof File) {
      formData.append("profile_image", profileImage);
    }

    // 🔥 THIS IS WHERE PATCH IS USED
    await axiosInstance.patch("accounts/me/", formData);

    window.dispatchEvent(new Event("profile-updated"));
    navigate("/profile");

  } catch (err) {
    alert("Update failed ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700 mb-3">
            <img
              src={preview || "/default-avatar.png"}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <label className="cursor-pointer px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700">
            Choose Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="Write something about yourself..."
            rows={4}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 bg-gray-800 border border-gray-700 py-3 rounded-xl hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-purple-600 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
