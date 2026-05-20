import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";

import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import StudentsPage from "./pages/StudentsPage.jsx";
import FeesPage from "./pages/FeesPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ParentPortal from "./pages/ParentPortal.jsx";

// Simple PrivateRoute guard
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const Layout = ({ children }) => {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close sidebar on larger screens automatically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Map page identifiers to components
  const pageMap = {
    dashboard: <DashboardPage search={searchQuery} />, // pass search for possible filter use
    students: <StudentsPage search={searchQuery} />,   
    fees: <FeesPage search={searchQuery} />,          
    reports: <ReportsPage />,
    notifications: <NotificationsPage />,
    settings: <SettingsPage />,
  };

  return (
    <div className="flex min-h-screen bg-neutral-bg font-sans">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Topbar setIsOpen={setIsSidebarOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="flex-1 p-6 overflow-auto">
          {pageMap[activePage] || children}
        </main>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <AuthProvider>
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/parent"
            element={
              <PrivateRoute>
                <ParentPortal />
              </PrivateRoute>
            }
          />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </LanguageProvider>
  </AuthProvider>
);

export default AppWrapper;
