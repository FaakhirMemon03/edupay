import React, { useState } from "react";
import { Menu, Search, Bell, Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const Topbar = ({ setIsOpen, searchQuery, setSearchQuery }) => {
  const { t, toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        {/* Hamburger (mobile) */}
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <Menu size={22} />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-xl group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
          />
          <input
            type="text"
            placeholder={t("searchPlaceholder") || "Search student or fee record..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3 text-sm bg-slate-50 border border-slate-200
              rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 focus:bg-white
              transition-all duration-300 placeholder:text-slate-400"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-2 py-1 bg-slate-200/50 rounded-lg border border-slate-300/50 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
            Ctrl K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold
            text-slate-700 bg-white border border-slate-200 shadow-premium hover:shadow-elevated hover:bg-slate-50 transition-all duration-300"
          title="Toggle Language / زبان تبدیل کریں"
        >
          <Globe size={18} className="text-primary" />
          <span className="hidden sm:inline font-urdu text-base leading-none translate-y-0.5">اردو</span>
          <span className="hidden sm:inline border-l border-slate-200 h-4 mx-1"></span>
          <span className="hidden sm:inline">English</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-danger border-2 border-white rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
