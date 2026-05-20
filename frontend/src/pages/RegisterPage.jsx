import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("parent");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Attempt to register via the backend. This endpoint currently requires admin auth.
      // In the mock environment it will still create a user without a token.
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: t("signupSuccess") || "Account created. You can now log in." });
        // redirect to login after a short pause
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage({ type: "error", text: data.message || t("signupFailed") || "Signup failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-bg">
      <div className="w-full max-w-sm bg-white p-6 rounded-card shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">{t("signupTitle") || "Sign Up"}</h2>
        {message && (
          <div className={`mb-3 text-${message.type === "error" ? "danger" : "success"}`}> {message.text} </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">{t("name")}</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">{t("emailLabel")}</label>
            <input id="email" type="text" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">{t("passwordLabel")}</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="role">Role</label>
            <select id="role" value={role} onChange={e => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-border rounded-button focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-button hover:bg-primary-dark">{t("signUp") || "Sign Up"}</button>
        </form>
        <p className="mt-4 text-center text-sm">
          {t("alreadyHaveAccount") || "Already have an account?"} <a href="/login" className="text-primary underline">{t("login")}</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
