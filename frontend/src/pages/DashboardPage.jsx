import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useOutletContext } from "react-router-dom";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Tooltip, Legend, ArcElement
} from "chart.js";
import { TrendingUp, Users, CreditCard, AlertCircle, ArrowUpRight } from "lucide-react";

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Tooltip, Legend, ArcElement
);

const StatCard = ({ title, value, icon: Icon, trend, colorClass, delay }) => (
  <div className={`glass p-6 rounded-[28px] shadow-premium hover:shadow-elevated transition-all duration-300 animate-fade-in ${delay}`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${colorClass} text-white shadow-lg`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-success/10 text-success`}>
          <TrendingUp size={12} />
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">{title}</p>
    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
  </div>
);

const DashboardPage = () => {
  const { t } = useLanguage();
  const { searchQuery } = useOutletContext();

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Collection",
        data: [120000, 150000, 140000, 190000, 175000, 210000],
        backgroundColor: "#6366f1",
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 12,
      }
    },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, border: { display: false } }
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h2>
          <p className="text-slate-500 font-medium font-urdu text-lg mt-1">خوش آمدید! یہاں آپ کے سکول کے مالیات کا خلاصہ ہے۔</p>
        </div>
        <button className="btn-primary animate-fade-in">
          <ArrowUpRight size={20} />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="1,280"
          icon={Users}
          trend="+12%"
          colorClass="bg-primary"
          delay="stagger-1"
        />
        <StatCard
          title="Revenue (PKR)"
          value="4.2M"
          icon={TrendingUp}
          trend="+8.5%"
          colorClass="bg-success"
          delay="stagger-2"
        />
        <StatCard
          title="Pending Fees"
          value="PKR 85k"
          icon={AlertCircle}
          trend="-2.4%"
          colorClass="bg-warning"
          delay="stagger-3"
        />
        <StatCard
          title="Defaulters"
          value="14"
          icon={CreditCard}
          colorClass="bg-danger"
          delay="stagger-3"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8 rounded-[32px] shadow-premium h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-bold text-slate-800">Monthly Revenue Flow</h4>
            <select className="bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-600 px-4 py-2 focus:ring-0">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[280px]">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="glass p-8 rounded-[32px] shadow-premium flex flex-col justify-center items-center text-center">
          <div className="w-48 h-48 mb-6">
            <Doughnut
              data={{
                labels: ["Paid", "Unpaid"],
                datasets: [{
                  data: [85, 15],
                  backgroundColor: ["#6366f1", "#e2e8f0"],
                  borderWidth: 0,
                }]
              }}
              options={{ cutout: '80%', plugins: { legend: { display: false } } }}
            />
          </div>
          <h4 className="text-2xl font-black text-slate-900 mb-1">85% Collected</h4>
          <p className="text-slate-500 text-sm font-medium">Overall target for May 2026</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
