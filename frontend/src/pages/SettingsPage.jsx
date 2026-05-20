import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const SettingsPage = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("settings")}</h1>
      <p>{t("settings")} page content (school details, fee structure, etc.) will be implemented here.</p>
    </div>
  );
};

export default SettingsPage;
