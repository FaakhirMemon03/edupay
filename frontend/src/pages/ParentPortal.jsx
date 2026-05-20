import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiClient } from "../utils/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import Card from "../components/Card.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const ParentPortal = () => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      if (!token) return;
      try {
        const data = await apiClient.getFees(token, user?.role);
        setFees(data);
      } catch (err) {
        console.error("Failed to load fees", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [token, user]);

  if (loading) {
    return <div className="p-6">{t("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("parentPortal")}</h1>
      {fees.length === 0 ? (
        <p>{t("noNotifications")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fees.map((fee) => (
            <Card
              key={fee._id}
              title="fee"
              value={`Rs. ${fee.amount + (fee.fine || 0)}`}
              icon={null}
              colorClass="bg-primary"
            >
              <div className="mt-2">
                <p className="text-sm">{fee.studentId?.name || "Student"}</p>
                <p className="text-xs text-neutral-secondary">{fee.month}</p>
                <StatusBadge status={fee.status} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentPortal;
