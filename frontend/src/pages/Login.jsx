import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Zap, Users, Shield } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // LOGIN API CALL USING AXIOS INSTANCE
      const res = await axiosInstance.post("/accounts/login/", {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user_id", res.data.user_id);

      // GET USER DETAILS
      const me = await axiosInstance.get("/accounts/me/");

      alert("Login Success ✅");

      if (me.data.is_admin) {
        localStorage.setItem("is_admin", "true");
        navigate("/admin");
      } else {
        localStorage.setItem("is_admin", "false");
        navigate("/feed");
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert(JSON.stringify(err.response?.data) || "Login Failed ❌");
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT SIDE BRANDING */}
          <div className="hidden lg:flex flex-col justify-center space-y-10 px-8">
            <div className="space-y-6">
              <h1 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400">
                Lunex
              </h1>

              <p className="text-xl text-gray-400 font-light tracking-wide">
                <span className="text-emerald-400 font-mono">&gt;</span> Next-Gen Social Network
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-emerald-500/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-white font-bold text-lg">INSTANT CONNECT</h3>
                    <p className="text-gray-400 text-sm">Real-time messaging</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-cyan-400" />
                  <div>
                    <h3 className="text-white font-bold text-lg">GLOBAL REACH</h3>
                    <p className="text-gray-400 text-sm">Connect worldwide</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-emerald-500/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-white font-bold text-lg">SECURE</h3>
                    <p className="text-gray-400 text-sm">Protected platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE LOGIN FORM */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-8">

              <div className="lg:hidden text-center mb-8">
                <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Lunex
                </h1>
                <p className="text-gray-400 mt-2 font-mono text-sm">
                  &gt; Welcome Back
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-emerald-400 mb-2">
                    Email / Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-emerald-400/50" />
                    <input
                      type="text"
                      placeholder="username or email"
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-black border border-emerald-500/30 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-emerald-400 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-emerald-400/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-black border border-emerald-500/30 rounded-lg text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-emerald-400/50"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 rounded-lg font-bold text-black flex items-center justify-center gap-2"
                >
                  LOGIN
                  <ArrowRight />
                </button>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Don’t have an account?
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-2 px-6 py-2 border border-emerald-500 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition"
                  >
                    Create Account
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
