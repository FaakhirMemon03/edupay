import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const Card = ({ title, value, icon: Icon, colorClass = "bg-primary", extra }) => {
  const { t } = useLanguage();

  return (
    <div className={`flex items-center gap-4 p-4 rounded-card shadow-sm ${colorClass} text-white`}>
      {Icon && <Icon size={28} className="flex-shrink-0" />}
      <div className="flex-1">
        <h3 className="text-xs font-medium uppercase opacity-80">{t(title)}</h3>
        <p className="text-2xl font-bold mt-1.5">{value}</p>
        {extra && <div className="mt-1 text-xs opacity-90">{extra}</div>}
      </div>
    </div>
  );
};

export default Card;
