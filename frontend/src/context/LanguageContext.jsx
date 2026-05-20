import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    appTitle: "EduPay",
    tagline: "School Fee Management System",
    simpleFast: "Simple, Fast, Urdu-friendly",
    dashboard: "Dashboard",
    students: "Students",
    fees: "Fees",
    reports: "Reports",
    settings: "Settings",
    logout: "Logout",
    totalStudents: "Total Students",
    totalRevenue: "Total Revenue",
    pendingFees: "Pending Fees",
    recentActivity: "Recent Activity",
    monthlyCollection: "Monthly Collection",
    addStudent: "Add Student",
    editStudent: "Edit Student",
    deleteStudent: "Delete Student",
    searchPlaceholder: "Search by student name or parent phone...",
    name: "Name",
    class: "Class",
    section: "Section",
    parentName: "Parent Name",
    parentPhone: "Parent Phone Number",
    monthlyFee: "Monthly Fee (PKR)",
    status: "Status",
    paid: "Paid",
    unpaid: "Unpaid",
    late: "Late",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    markPaid: "Mark as Paid",
    sendReminder: "Send Reminder",
    reminderSent: "Reminder Sent!",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    confirmDelete: "Are you sure you want to delete this student?",
    loginTitle: "EduPay Login",
    loginSubtitle: "Sign in to manage your school fees",
    emailLabel: "Email Address / Phone",
    passwordLabel: "Password",
    signIn: "Sign In",
    parentPortal: "Parent Portal",
    myChildren: "My Children Fee Status",
    viewHistory: "View History",
    payNow: "Pay Now",
    notifications: "Notifications",
    alerts: "Alerts",
    noNotifications: "No new notifications",
    generateFees: "Generate Monthly Fees",
    generateFeesTooltip: "Automatically creates fee records for the current month for all registered students.",
    feesGenerated: "Monthly fees generated successfully!",
    schoolName: "School Name",
    address: "Address",
    phone: "Phone",
    updateSettings: "Save Settings",
    settingsUpdated: "Settings updated successfully!",
    currency: "Rs.",
    fine: "Fine",
    dueDate: "Due Date",
    paidDate: "Paid Date",
    languageToggle: "اردو",
    activityPayment: "payment received",
    activityAdded: "student registered"
  },
  ur: {
    appTitle: "ایجو پے",
    tagline: "اسکول فیس مینجمنٹ سسٹم",
    simpleFast: "سادہ، تیز، اور آسان",
    dashboard: "ڈیش بورڈ",
    students: "طلباء",
    fees: "فیسیں",
    reports: "رپورٹیں",
    settings: "سیٹنگز",
    logout: "لاگ آؤٹ",
    totalStudents: "کل طلباء",
    totalRevenue: "کل وصولی",
    pendingFees: "واجب الادا فیس",
    recentActivity: "حالیہ سرگرمیاں",
    monthlyCollection: "ماہانہ فیس جمع",
    addStudent: "طالب علم شامل کریں",
    editStudent: "ترمیم کریں",
    deleteStudent: "حذف کریں",
    searchPlaceholder: "طالب علم کا نام یا فون تلاش کریں...",
    name: "طالب علم کا نام",
    class: "کلاس",
    section: "سیکشن",
    parentName: "والدین کا نام",
    parentPhone: "موبائل نمبر",
    monthlyFee: "ماہانہ فیس (روپے)",
    status: "حیثیت",
    paid: "ادا شدہ",
    unpaid: "غیر ادا شدہ",
    late: "تاخیر",
    actions: "اقدامات",
    edit: "ترمیم",
    delete: "حذف",
    markPaid: "وصولی درج کریں",
    sendReminder: "یاد دہانی بھیجیں",
    reminderSent: "پیغام بھیج دیا گیا ہے!",
    loading: "لوڈ ہو رہا ہے...",
    save: "محفوظ کریں",
    cancel: "کینسل",
    confirmDelete: "کیا آپ واقعی اس طالب علم کو حذف کرنا چاہتے ہیں؟",
    loginTitle: "ایجو پے لاگ ان",
    loginSubtitle: "اسکول فیس کے انتظام کے لیے لاگ ان کریں",
    emailLabel: "ای میل ایڈریس / فون",
    passwordLabel: "پاس ورڈ",
    signIn: "لاگ ان کریں",
    parentPortal: "والدین پورٹل",
    myChildren: "میرے بچوں کی فیس کی تفصیلات",
    viewHistory: "تفصیلات دیکھیں",
    payNow: "فیس ادا کریں",
    notifications: "اطلاعات",
    alerts: "الرٹس",
    noNotifications: "کوئی نئی اطلاع نہیں ہے",
    generateFees: "ماہانہ فیس بنائیں",
    generateFeesTooltip: "اس مہینے کی فیس کا ریکارڈ تمام طلباء کے لیے بناتا ہے۔",
    feesGenerated: "ماہانہ فیس کامیابی سے بنا دی گئی ہے!",
    schoolName: "اسکول کا نام",
    address: "پتہ",
    phone: "فون نمبر",
    updateSettings: "ترتیبات محفوظ کریں",
    settingsUpdated: "سیٹنگز کامیابی سے اپ ڈیٹ ہو گئیں!",
    currency: "روپے",
    fine: "جرمانہ",
    dueDate: "آخری تاریخ",
    paidDate: "ادائیگی کی تاریخ",
    languageToggle: "English",
    activityPayment: "فیس موصول ہو گئی",
    activityAdded: "طالب علم کا اندراج ہوا"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("edupay_lang") || "en";
  });

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === "en" ? "ur" : "en";
      localStorage.setItem("edupay_lang", next);
      return next;
    });
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  // Set direction on HTML tag for RTL support (Urdu is RTL)
  useEffect(() => {
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
