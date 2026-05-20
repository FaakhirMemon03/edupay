import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { t, toggleLanguage } = useLanguage();
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
      const data = await res.ok ? await res.json() : null;
      if (res.ok) {
        setMessage({ type: "success", text: t("signupSuccess") });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const errMsg = data?.message || t("signupFailed");
        setMessage({ type: "error", text: errMsg });
      }
    } catch (err) {
      setMessage({ type: "error", text: t("signupFailed") });
    } finally {
      setLoading(false);
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
        <h2 className="text-2xl font-bold mb-4 text-center">{t("signupTitle")}</h2>
        {message && (
          <div className={`mb-3 text-sm text-center ${message.type === "error" ? "text-danger" : "text-success"}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="reg-name">{t("name")}</label>
            <input id="reg-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="reg-email">{t("emailLabel")}</label>
            <input id="reg-email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="reg-password">{t("passwordLabel")}</label>
            <input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="reg-role">Role</label>
            <select id="reg-role" value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-button hover:bg-primary-dark disabled:opacity-50 font-semibold">
            {loading ? t("loading") : t("signUp")}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-neutral-secondary">
          {t("alreadyHaveAccount")}{" "}
          <Link to="/login" className="text-primary font-semibold underline hover:text-primary-dark ml-1 mr-1">
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
