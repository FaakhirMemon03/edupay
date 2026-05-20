import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import Card from "../components/Card.jsx";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = ({ search }) => {
  const { t } = useLanguage();

  // Placeholder data for chart
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: t("monthlyCollection"),
        data: [5000, 7000, 6000, 8000, 7500],
        backgroundColor: "rgba(37,99,235,0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: t("monthlyCollection") },
    },
  };

  return (
    <div className="space-y-6">
      {/* Upper cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="totalStudents" value={120} icon={null} colorClass="bg-primary" />
        <Card title="totalRevenue" value={"Rs. 1,250,000"} icon={null} colorClass="bg-success" />
        <Card title="pendingFees" value={"Rs. 85,000"} icon={null} colorClass="bg-danger" />
      </div>

      {/* Bar chart */}
      <div className="bg-white p-4 rounded-card shadow-sm">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardPage;
