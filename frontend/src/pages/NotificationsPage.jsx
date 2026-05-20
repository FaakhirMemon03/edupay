import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const NotificationsPage = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("notifications")}</h1>
      <p>{t("noNotifications")}</p>
    </div>
  );
};

export default NotificationsPage;
