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
    axiosInstance
      .get("accounts/profile/edit/")
      .then((res) => {
        setBio(res.data.bio || "");
        setPreview(res.data.profile_image || null);
      })
      .catch((err) => {
        console.error("FETCH PROFILE ERROR:", err);
        alert("Failed to load profile ❌");
      });
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
  // SAVE PROFILE (FIXED)
  // =========================
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("bio", bio || "");

    // append ONLY if user selected new image
    if (profileImage instanceof File) {
      formData.append("profile_image", profileImage);
    }

    try {
      setLoading(true);
      await axiosInstance.put("accounts/profile/edit/", formData);
      navigate("/profile");
    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err);
      alert("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

        {/* IMAGE */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={preview || "/default-avatar.png"}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* BIO */}
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full bg-black border border-gray-700 rounded-xl p-3 mb-4"
          placeholder="Bio..."
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-purple-600 py-3 rounded-xl hover:bg-purple-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
