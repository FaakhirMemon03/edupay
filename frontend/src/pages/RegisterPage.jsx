import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, UserPlus } from "lucide-react";

const RegisterPage = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("parent");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: t("signupSuccess") || "Account created successfully!" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage({ type: "error", text: data?.message || t("signupFailed") || "Registration failed." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden p-4">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-accent/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-xl relative z-10 flex flex-col items-center">
        <div className="text-center mb-8 animate-fade-in w-full">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Login</span>
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-elevated mb-6 -rotate-3">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-slate-400 text-lg">Join the EduPay platform for seamless management.</p>
        </div>

        <div className="w-full glass-dark p-8 md:p-10 rounded-[40px] shadow-2xl border border-white/5 animate-fade-in stagger-1">
          {message && (
            <div className={`mb-6 p-4 border rounded-2xl text-sm font-semibold text-center animate-pulse ${message.type === "error"
                ? "bg-danger/10 border-danger/20 text-danger"
                : "bg-success/10 border-success/20 text-success"
              }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-medium mb-2 ml-1" htmlFor="reg-name">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2 ml-1" htmlFor="reg-email">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2 ml-1" htmlFor="reg-password">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 text-sm font-medium mb-2 ml-1" htmlFor="reg-role">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("parent")}
                  className={`py-4 rounded-2xl font-bold transition-all duration-200 border ${role === "parent"
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : "bg-slate-800/30 border-white/5 text-slate-400 hover:bg-slate-800/50"
                    }`}
                >
                  Parent
                </button>
                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`py-4 rounded-2xl font-bold transition-all duration-200 border ${role === "teacher"
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : "bg-slate-800/30 border-white/5 text-slate-400 hover:bg-slate-800/50"
                    }`}
                >
                  Teacher
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 btn-primary h-16 text-lg mt-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={22} />
                  Register Account
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:text-primary-light transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <button
          onClick={toggleLanguage}
          className="mt-8 text-slate-500 text-sm hover:text-slate-300 flex items-center gap-2 transition-colors animate-fade-in stagger-3"
        >
          <span>🌐</span>
          <span>{language === 'en' ? 'Switch to Urdu (اردو)' : 'Switch to English'}</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
