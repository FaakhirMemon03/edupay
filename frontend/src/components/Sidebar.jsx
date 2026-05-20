import React from "react";
import {
  LayoutDashboard, Users, CreditCard, BarChart2,
  Settings, LogOut, GraduationCap, X, Bell
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { id: "students", label: t("students"), icon: Users },
    { id: "fees", label: t("fees"), icon: CreditCard },
    { id: "reports", label: t("reports"), icon: BarChart2 },
    { id: "notifications", label: t("notifications"), icon: Bell },
    { id: "settings", label: t("settings"), icon: Settings },
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-slate-900 z-50
          flex flex-col transform transition-all duration-300 ease-in-out border-r border-white/5
          lg:translate-x-0 lg:ml-0
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">EduPay</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Portal Active</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold
                transition-all duration-200 group
                ${activePage === id
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"}
              `}
            >
              <Icon size={20} className={`${activePage === id ? "text-white" : "text-slate-500 group-hover:text-primary-light"} transition-colors`} />
              {label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-6">
          <div className="bg-slate-800/50 rounded-[24px] p-4 border border-white/5 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-accent flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{user?.role || "Administrator"}</p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold
              text-slate-400 hover:bg-danger/10 hover:text-danger border border-transparent hover:border-danger/20 transition-all duration-200"
          >
            <LogOut size={18} />
            {t("logout")}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
