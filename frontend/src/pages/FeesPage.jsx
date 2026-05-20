import React from "react";
import StatusBadge from "../components/StatusBadge.jsx";

const FeesPage = () => {
  // Mock data – replace with API calls later
  const feeRows = [
    { id: 1, student: "Ali Khan", month: "April", amount: 1500, status: "paid" },
    { id: 2, student: "Sara Ahmed", month: "April", amount: 1500, status: "unpaid" },
    { id: 3, student: "Zain Ali", month: "April", amount: 1500, status: "late" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fees Management</h1>
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
        <thead className="bg-neutral-bg">
          <tr>
            <th className="px-4 py-2 text-left">Student</th>
            <th className="px-4 py-2 text-left">Month</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {feeRows.map(row => (
            <tr key={row.id} className="border-b border-neutral-border">
              <td className="px-4 py-2">{row.student}</td>
              <td className="px-4 py-2">{row.month}</td>
              <td className="px-4 py-2">Rs {row.amount}</td>
              <td className="px-4 py-2">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-2 space-x-2">
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Mark as Paid</button>
                <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300">Send Reminder</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeesPage;
