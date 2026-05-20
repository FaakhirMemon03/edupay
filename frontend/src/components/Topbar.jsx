import React, { useState } from "react";
import { Menu, Search, Bell, Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const Topbar = ({ setIsOpen, searchQuery, setSearchQuery }) => {
  const { t, toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-neutral-border px-4 py-3 flex items-center gap-3">
      {/* Hamburger (mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 rounded-button hover:bg-gray-100 text-neutral-secondary"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-secondary"
        />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-neutral-border
            rounded-button focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-2 rounded-button text-sm font-medium
            text-neutral-secondary hover:bg-gray-100 border border-neutral-border transition-all"
          title="Toggle Language / زبان تبدیل کریں"
        >
          <Globe size={16} />
          <span className="hidden sm:inline">{t("languageToggle")}</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
