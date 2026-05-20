import React from "react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const StatusBadge = ({ status }) => {
  const { t } = useLanguage();

  const config = {
    paid: {
      label: t("paid"),
      icon: <CheckCircle size={12} />,
      className: "bg-success-light text-success border border-green-200",
    },
    unpaid: {
      label: t("unpaid"),
      icon: <Clock size={12} />,
      className: "bg-danger-light text-danger border border-red-200",
    },
    late: {
      label: t("late"),
      icon: <AlertCircle size={12} />,
      className: "bg-warning-light text-warning border border-yellow-200",
    },
  };

  const { label, icon, className } = config[status] || config.unpaid;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}
    >
      {icon}
      {label}
    </span>
  );
};

export default StatusBadge;
