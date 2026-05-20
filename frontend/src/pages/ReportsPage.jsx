import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const ReportsPage = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("reports")}</h1>
      <p>{t("reports")} page content goes here.</p>
    </div>
  );
};

export default ReportsPage;
