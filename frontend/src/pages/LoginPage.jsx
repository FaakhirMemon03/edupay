import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      // error handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-accent/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-elevated mb-6 rotate-3">
            <span className="text-white text-3xl font-bold">Edu</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-lg">
            Manage your school payments with ease.
          </p>
        </div>

        <div className="glass-dark p-8 rounded-[32px] shadow-2xl border border-white/5 animate-fade-in stagger-1">
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2 ml-1" htmlFor="login-email">
                Email Address
              </label>
              <input
                id="login-email"
                type="text"
                placeholder="admin@edupay.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2 ml-1" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-14 text-lg mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-bold hover:text-primary-light transition-colors">
                Create account
              </Link>
            </p>
            <button
              onClick={toggleLanguage}
              className="text-slate-500 text-xs hover:text-slate-300 flex items-center gap-2 transition-colors"
            >
              <span>🌐</span>
              <span>{language === 'en' ? 'Switch to Urdu' : 'Switch to English'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
