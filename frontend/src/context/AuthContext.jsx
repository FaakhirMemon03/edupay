import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../utils/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("edupay_token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile when token changes or on load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profile = await apiClient.getProfile(token);
        setUser(profile);
        setError(null);
      } catch (err) {
        console.error("Profile load failed:", err);
        // If profile token invalid/expired, log out
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.login(email, password);
      
      localStorage.setItem("edupay_token", data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        schoolId: data.schoolId
      });
      return data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("edupay_token");
    setToken(null);
    setUser(null);
    setError(null);
  };

  const refreshProfile = async () => {
    if (token) {
      try {
        const profile = await apiClient.getProfile(token);
        setUser(profile);
      } catch (err) {
        console.error("Profile refresh failed:", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
        refreshProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isParent: user?.role === "parent",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
