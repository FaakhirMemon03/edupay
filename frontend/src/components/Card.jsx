import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const Card = ({ title, value, icon: Icon, colorClass = "bg-primary", extra }) => {
  const { t } = useLanguage();

  return (
    <div className="glass p-6 rounded-[28px] shadow-premium hover:shadow-elevated hover:scale-[1.02] transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{t(title)}</h3>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
          {extra && <div className="mt-2 text-xs font-semibold text-slate-400">{extra}</div>}
        </div>

        <div className={`p-4 rounded-2xl ${colorClass} text-white shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
          {Icon ? <Icon size={24} /> : <div className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
};

export default Card;
