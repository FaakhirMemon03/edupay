import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const StudentsPage = ({ search }) => {
  const { t } = useLanguage();
  // In a real app, data would be fetched via API; here we show a placeholder table.
  const dummyStudents = [
    { id: 1, name: "Ali Khan", class: "Class 1", parent: "0300-1234567", status: "active" },
    { id: 2, name: "Ayesha Tariq", class: "Class 2", parent: "0300-9876543", status: "active" },
  ];

  const filtered = dummyStudents.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("Students")}</h1>
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-neutral-bg">
          <tr>
            <th className="px-4 py-2 text-left">{t("Name")}</th>
            <th className="px-4 py-2 text-left">{t("Class")}</th>
            <th className="px-4 py-2 text-left">{t("Parent")}</th>
            <th className="px-4 py-2 text-left">{t("Status")}</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(stu => (
            <tr key={stu.id} className="border-t">
              <td className="px-4 py-2">{stu.name}</td>
              <td className="px-4 py-2">{stu.class}</td>
              <td className="px-4 py-2">{stu.parent}</td>
              <td className="px-4 py-2">{stu.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsPage;
