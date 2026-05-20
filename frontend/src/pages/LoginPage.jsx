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
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-bg p-4">
      {/* Top language toggle bar */}
      <div className="w-full max-w-sm flex justify-end mb-4">
        <button
          onClick={toggleLanguage}
          className="px-4 py-1.5 bg-white rounded-full shadow-sm text-sm font-semibold border border-neutral-border hover:bg-neutral-bg transition duration-200"
        >
          {t("languageToggle")}
        </button>
      </div>

      <div className="w-full max-w-sm bg-white p-6 rounded-card shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">{t("loginTitle")}</h2>
        <p className="text-sm text-neutral-secondary mb-4 text-center">{t("loginSubtitle")}</p>
        {error && <div className="mb-3 text-danger text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="login-email">{t("emailLabel")}</label>
            <input
              id="login-email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="login-password">{t("passwordLabel")}</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-button hover:bg-primary-dark disabled:opacity-50 font-semibold"
          >
            {loading ? t("loading") : t("signIn")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-secondary">
          {t("dontHaveAccount")}{" "}
          <Link to="/register" className="text-primary font-semibold underline hover:text-primary-dark ml-1 mr-1">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
