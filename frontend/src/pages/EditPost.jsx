import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { ArrowLeft, Save } from "lucide-react";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`posts/${id}/`);
      setCaption(res.data.caption || "");
    } catch (err) {
      console.log("EDIT POST ERROR:", err);
      alert("Post not found ❌");
      navigate("/feed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.patch(`posts/${id}/`, { caption });
      alert("Post updated ✅");
      navigate(`/post/${id}`);
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      alert("Update failed ❌");
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (loading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  return (
    <div className="text-white max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-xl font-bold">Edit Post</h1>
      </div>

      <form
        onSubmit={handleUpdate}
        className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6"
      >
        <label className="block mb-2 text-gray-300 font-semibold">
          Caption
        </label>

        <textarea
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none text-white"
          rows="4"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button
          type="submit"
          className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-semibold text-black flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </form>
    </div>
  );
}
