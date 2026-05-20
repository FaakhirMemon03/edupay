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
    { id: "students",  label: t("students"),  icon: Users },
    { id: "fees",      label: t("fees"),      icon: CreditCard },
    { id: "reports",   label: t("reports"),   icon: BarChart2 },
    { id: "notifications", label: t("notifications"), icon: Bell },
    { id: "settings",  label: t("settings"),  icon: Settings },
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
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-neutral-border z-30
          flex flex-col transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-button flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary leading-none">EduPay</h1>
              <p className="text-[10px] text-neutral-secondary leading-none mt-0.5">Fee Management</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-neutral-secondary hover:text-neutral-text"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-button text-sm font-medium
                transition-all duration-150 text-left
                ${activePage === id
                  ? "bg-primary text-white shadow-sm"
                  : "text-neutral-secondary hover:bg-primary/5 hover:text-primary"}
              `}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-neutral-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-button bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-text truncate">{user?.name}</p>
              <p className="text-xs text-neutral-secondary capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-button text-sm font-medium
              text-danger hover:bg-danger-light transition-all duration-150"
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
