import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) {
      alert("Login first ❌");
      return;
    }

    if (!image) {
      alert("Select image ❌");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      await axiosInstance.post("posts/", formData);

      alert("Post Uploaded ✅");
      navigate("/feed");
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      alert(JSON.stringify(err.response?.data) || "Upload Failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <form
        onSubmit={handleUpload}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h1 className="text-2xl font-bold mb-4">📸 Create Post</h1>

        <input
          type="file"
          className="w-full mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <textarea
          className="w-full bg-white/10 rounded-xl p-3 outline-none"
          placeholder="Write caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-semibold text-black">
          Upload
        </button>
      </form>
    </div>
  );
}
