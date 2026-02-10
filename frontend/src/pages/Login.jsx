import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Zap, Users, Shield } from "lucide-react";
import axios from "axios";
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
    const res = await axios.post("http://127.0.0.1:8000/api/accounts/login/", {
      username: formData.username,
      password: formData.password,
    });

    // Save tokens
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    localStorage.setItem("user_id", res.data.user_id);

    // After login check if admin
    const me = await axios.get(
      "http://127.0.0.1:8000/api/accounts/me/",
      {
        headers: {
          Authorization: `Bearer ${res.data.access}`,
        },
      }
    );

    alert("Login Success ✅");

    // 🔥 Admin check
    if (me.data.is_admin) {
      localStorage.setItem("is_admin", "true");
      navigate("/admin");
    } else {
      localStorage.setItem("is_admin", "false");
      navigate("/feed");
    }

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);
    alert(JSON.stringify(err.response?.data) || "Login Failed ❌");
  }
};

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 255, 157, 0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0, 255, 157, 0.03) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #00ff9d 0%, transparent 70%)",
            top: "20%",
            left: "10%",
            transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px)`,
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)",
            bottom: "10%",
            right: "10%",
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
          }}
        />
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,255,157,0.1) 0px, transparent 2px, transparent 4px, rgba(0,255,157,0.1) 4px)",
            animation: "scan 8s linear infinite",
          }}
        ></div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Cyberpunk Branding */}
          <div className="hidden lg:flex flex-col justify-center space-y-10 px-8">
            {/* Logo with Neon Effect */}
            <div className="space-y-6">
              <div className="relative">
                <h1 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 relative">
                  VIBE
                  <span className="block text-6xl mt-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text">
                    CONNECT
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-20 blur-2xl"></div>
                </h1>
              </div>
              <p className="text-xl text-gray-400 font-light tracking-wide">
                <span className="text-emerald-400 font-mono">&gt;</span> Next-Gen Social Network
              </p>
            </div>

            {/* Feature Cards - Cyberpunk Style */}
            <div className="space-y-4">
              <div className="group relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-6 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1 font-mono">INSTANT_CONNECT</h3>
                    <p className="text-gray-400 text-sm">Real-time messaging and live updates</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>

              <div className="group relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1 font-mono">GLOBAL_REACH</h3>
                    <p className="text-gray-400 text-sm">Connect with millions worldwide</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>

              <div className="group relative bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-6 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1 font-mono">SECURE_VAULT</h3>
                    <p className="text-gray-400 text-sm">End-to-end encrypted conversations</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-300"></div>

              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black border border-emerald-500/30 rounded-2xl p-8 md:p-10">
                {/* Mobile Logo */}
                <div className="lg:hidden text-center mb-8">
                  <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    VIBECONNECT
                  </h1>
                  <p className="text-gray-400 mt-2 font-mono text-sm">&gt; Join the network</p>
                </div>

               <form onSubmit={handleSubmit} className="space-y-5">
  <div>
    <label className="block text-sm font-mono text-emerald-400 mb-2 uppercase tracking-wider">
      Email / Username
    </label>
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
      <div className="relative flex items-center">
        <Mail className="absolute left-4 w-5 h-5 text-emerald-400/50" />
        <input
          type="text"
          placeholder="username or email"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-emerald-500/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:bg-black/70 transition-all font-mono"
        />
      </div>
    </div>
  </div>

  <div>
    <label className="block text-sm font-mono text-emerald-400 mb-2 uppercase tracking-wider">
      Password
    </label>
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
      <div className="relative flex items-center">
        <Lock className="absolute left-4 w-5 h-5 text-emerald-400/50" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className="w-full pl-12 pr-12 py-3.5 bg-black/50 border border-emerald-500/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:bg-black/70 transition-all font-mono"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 text-emerald-400/50 hover:text-emerald-400 transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  </div>
<button type="submit" className="relative w-full group overflow-hidden">

    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"></div>
    <div className="relative py-4 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg font-bold text-black font-mono text-lg tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02]">
      ENTER_SYSTEM
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
  
<div className="mt-6 text-center">
  <p className="text-gray-400 text-sm">
    Don’t have an account?
  </p>

  <button
    onClick={() => navigate("/")}
    className="mt-2 px-6 py-2 border border-emerald-500 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition"
  >
    Create Account
  </button>
</div>

</form>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
