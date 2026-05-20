import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { t } = useLanguage();
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
        setMessage({ type: "success", text: "Account created successfully! Redirecting to login..." });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Signup failed. Please try again." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server not reachable. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-bg">
      <div className="w-full max-w-sm bg-white p-6 rounded-card shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">{t("signupTitle") || "Sign Up"}</h2>
        <p className="text-sm text-neutral-secondary mb-4 text-center">Create your EduPay account</p>
        {message && (
          <div className={`mb-3 text-sm ${message.type === "error" ? "text-danger" : "text-success"}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="reg-name">{t("name") || "Full Name"}</label>
            <input id="reg-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="reg-email">{t("emailLabel") || "Email"}</label>
            <input id="reg-email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="reg-password">{t("passwordLabel") || "Password"}</label>
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
            className="w-full bg-primary text-white py-2 rounded-button hover:bg-primary-dark disabled:opacity-50">
            {loading ? "Creating account..." : (t("signUp") || "Sign Up")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {t("alreadyHaveAccount") || "Already have an account?"}{" "}
          <Link to="/login" className="text-primary font-semibold underline">{t("login") || "Login"}</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
