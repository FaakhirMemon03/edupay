// API Client helper with Automatic Mock Database Fallback
// This ensures that the application is fully functional out-of-the-box

const BASE_URL = "/api";

// Seed Initial Mock Data if needed
const initMockDB = () => {
  if (!localStorage.getItem("edupay_mock_users")) {
    const defaultSchool = { _id: "school1", name: "EduPay Beacon School", address: "Gulshan-e-Iqbal, Karachi", phone: "+92 300 1234567" };
    
    const mockUsers = [
      { _id: "admin1", name: "System Admin", email: "PP@admin.com", role: "admin", schoolId: "school1" },
      { _id: "parent1", name: "Rizwan Ahmed", email: "03001234567@edupay.com", role: "parent", schoolId: "school1" },
      { _id: "parent2", name: "Muhammad Ali", email: "03219876543@edupay.com", role: "parent", schoolId: "school1" }
    ];

    const mockStudents = [
      { _id: "student1", name: "Hamza Rizwan", class: "Class 5", section: "A", parentId: "parent1", schoolId: "school1", monthlyFee: 2500, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: "student2", name: "Aisha Rizwan", class: "Class 3", section: "B", parentId: "parent1", schoolId: "school1", monthlyFee: 2000, createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: "student3", name: "Zainab Ali", class: "Class 6", section: "A", parentId: "parent2", schoolId: "school1", monthlyFee: 3000, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: "student4", name: "Bilal Ahmed", class: "Class 8", section: "C", parentId: "parent2", schoolId: "school1", monthlyFee: 3500, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
    ];

    const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleString("default", { month: "long", year: "numeric" });

    const mockFees = [
      { _id: "fee1", studentId: "student1", schoolId: "school1", month: currentMonth, amount: 2500, fine: 0, status: "unpaid", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: "fee2", studentId: "student2", schoolId: "school1", month: currentMonth, amount: 2000, fine: 0, status: "unpaid", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: "fee3", studentId: "student3", schoolId: "school1", month: currentMonth, amount: 3000, fine: 100, status: "late", dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: "fee4", studentId: "student4", schoolId: "school1", month: currentMonth, amount: 3500, fine: 0, status: "paid", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), paidDate: new Date().toISOString() },
      { _id: "fee5", studentId: "student1", schoolId: "school1", month: lastMonth, amount: 2500, fine: 0, status: "paid", dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), paidDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString() }
    ];

    const mockNotifications = [
      { _id: "n1", userId: "parent1", message: "Assalam-o-Alaikum! Fee for Hamza Rizwan for the month of " + lastMonth + " has been successfully paid.", type: "paid", read: true, createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: "n2", userId: "parent1", message: "Assalam-o-Alaikum! Fee of Rs. 2000 is pending for Aisha Rizwan for the month of " + currentMonth + ". Please pay before the due date.", type: "fee_due", read: false, createdAt: new Date().toISOString() }
    ];

    localStorage.setItem("edupay_school", JSON.stringify(defaultSchool));
    localStorage.setItem("edupay_mock_users", JSON.stringify(mockUsers));
    localStorage.setItem("edupay_mock_students", JSON.stringify(mockStudents));
    localStorage.setItem("edupay_mock_fees", JSON.stringify(mockFees));
    localStorage.setItem("edupay_mock_notifications", JSON.stringify(mockNotifications));
  }
};

initMockDB();

// Dynamic late fee verification in mock database
const verifyMockLateFees = () => {
  const fees = JSON.parse(localStorage.getItem("edupay_mock_fees") || "[]");
  const today = new Date();
  let updated = false;

  const updatedFees = fees.map(f => {
    if (f.status === "unpaid" && new Date(f.dueDate) < today) {
      f.status = "late";
      f.fine = 100;
      updated = true;
    }
    return f;
  });

  if (updated) {
    localStorage.setItem("edupay_mock_fees", JSON.stringify(updatedFees));
  }
};

// Network checker helper
const isBackendOnline = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // short timeout
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "probe", password: "probe" }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return true; // if reachable, return true (even 401/400 count as reachable)
  } catch (err) {
    return false; // failed network
  }
};

const getHeaders = (token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Main API Export
export const apiClient = {
  // Authentication
  login: async (email, password) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to login");
      }
      return await res.json();
    } else {
      // Mock Login Mode
      const users = JSON.parse(localStorage.getItem("edupay_mock_users") || "[]");
      
      // Special admin check
      if (email === "PP@admin.com" && password === "PP@access.com") {
        const admin = users.find(u => u.email === "PP@admin.com");
        return {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          schoolId: admin.schoolId,
          token: "mock-admin-token-12345"
        };
      }

      // Standard user check
      const user = users.find(u => u.email === email && password === "parent123");
      if (user) {
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          schoolId: user.schoolId,
          token: `mock-token-${user._id}`
        };
      } else {
        throw new Error("Invalid email or password (Try: PP@admin.com / PP@access.com or 03001234567@edupay.com / parent123)");
      }
    }
  },

  getProfile: async (token) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/auth/profile`, { headers: getHeaders(token) });
      return await res.json();
    } else {
      const users = JSON.parse(localStorage.getItem("edupay_mock_users") || "[]");
      const userId = token.startsWith("mock-token-") ? token.replace("mock-token-", "") : "admin1";
      const user = users.find(u => u._id === userId) || users[0];
      const school = JSON.parse(localStorage.getItem("edupay_school") || "{}");
      return { ...user, schoolId: school };
    }
  },

  // Students CRUD
  getStudents: async (token) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/students`, { headers: getHeaders(token) });
      return await res.json();
    } else {
      const students = JSON.parse(localStorage.getItem("edupay_mock_students") || "[]");
      const users = JSON.parse(localStorage.getItem("edupay_mock_users") || "[]");
      return students.map(s => {
        const parent = users.find(u => u._id === s.parentId);
        return {
          ...s,
          parentId: parent ? { _id: parent._id, name: parent.name, email: parent.email } : null
        };
      });
    }
  },

  addStudent: async (studentData, token) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/students`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(studentData)
      });
      return await res.json();
    } else {
      const students = JSON.parse(localStorage.getItem("edupay_mock_students") || "[]");
      const users = JSON.parse(localStorage.getItem("edupay_mock_users") || "[]");

      const parentEmail = `${studentData.parentPhone.replace(/\s+/g, "")}@edupay.com`;
      let parent = users.find(u => u.email === parentEmail);
      if (!parent) {
        parent = {
          _id: `parent_${Date.now()}`,
          name: studentData.parentName,
          email: parentEmail,
          role: "parent",
          schoolId: "school1"
        };
        users.push(parent);
        localStorage.setItem("edupay_mock_users", JSON.stringify(users));
      }

      const newStudent = {
        _id: `student_${Date.now()}`,
        name: studentData.name,
        class: studentData.class,
        section: studentData.section,
        parentId: parent._id,
        schoolId: "school1",
        monthlyFee: Number(studentData.monthlyFee) || 2000,
        createdAt: new Date().toISOString()
      };
      students.push(newStudent);
      localStorage.setItem("edupay_mock_students", JSON.stringify(students));

      return {
        ...newStudent,
        parentId: { _id: parent._id, name: parent.name, email: parent.email }
      };
    }
  },

  updateStudent: async (id, studentData, token) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/students/${id}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(studentData)
      });
      return await res.json();
    } else {
      const students = JSON.parse(localStorage.getItem("edupay_mock_students") || "[]");
      const users = JSON.parse(localStorage.getItem("edupay_mock_users") || "[]");

      let index = students.findIndex(s => s._id === id);
      if (index !== -1) {
        students[index].name = studentData.name || students[index].name;
        students[index].class = studentData.class || students[index].class;
        students[index].section = studentData.section || students[index].section;
        students[index].monthlyFee = Number(studentData.monthlyFee) || students[index].monthlyFee;

        if (studentData.parentPhone && studentData.parentName) {
          const parentEmail = `${studentData.parentPhone.replace(/\s+/g, "")}@edupay.com`;
          let parent = users.find(u => u.email === parentEmail);
          if (!parent) {
            parent = {
              _id: `parent_${Date.now()}`,
              name: studentData.parentName,
              email: parentEmail,
              role: "parent",
              schoolId: "school1"
            };
            users.push(parent);
          } else {
            parent.name = studentData.parentName;
          }
          students[index].parentId = parent._id;
          localStorage.setItem("edupay_mock_users", JSON.stringify(users));
        }

        localStorage.setItem("edupay_mock_students", JSON.stringify(students));
        const finalParent = users.find(u => u._id === students[index].parentId);
        return {
          ...students[index],
          parentId: finalParent ? { _id: finalParent._id, name: finalParent.name, email: finalParent.email } : null
        };
      }
      throw new Error("Student not found");
    }
  },

  deleteStudent: async (id, token) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/students/${id}`, {
        method: "DELETE",
        headers: getHeaders(token)
      });
      return await res.json();
    } else {
      let students = JSON.parse(localStorage.getItem("edupay_mock_students") || "[]");
      students = students.filter(s => s._id !== id);
      localStorage.setItem("edupay_mock_students", JSON.stringify(students));
      return { message: "Student removed successfully" };
    }
  },

  // Fees Operations
  getFees: async (token, role) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/fees`, { headers: getHeaders(token) });
      return await res.json();
    } else {
      verifyMockLateFees();
      const fees = JSON.parse(localStorage.getItem("edupay_mock_fees") || "[]");
      const students = JSON.parse(localStorage.getItem("edupay_mock_students") || "[]");

      if (role === "parent") {
        // Mock get user ID from token
        const userId = token.startsWith("mock-token-") ? token.replace("mock-token-", "") : "parent1";
        const childIds = students.filter(s => s.parentId === userId).map(s => s._id);
        const filteredFees = fees.filter(f => childIds.includes(f.studentId));

        return filteredFees.map(f => {
          const student = students.find(s => s._id === f.studentId);
          return {
            ...f,
            studentId: student ? { _id: student._id, name: student.name, class: student.class, section: student.section, monthlyFee: student.monthlyFee } : null
          };
        });
      } else {
        return fees.map(f => {
          const student = students.find(s => s._id === f.studentId);
          return {
            ...f,
            studentId: student ? { _id: student._id, name: student.name, class: student.class, section: student.section, monthlyFee: student.monthlyFee } : null
          };
        });
      }
    }
  },

  generateMonthlyFees: async (token) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/fees/generate`, {
        method: "POST",
        headers: getHeaders(token)
      });
      return await res.json();
    } else {
      const students = JSON.parse(localStorage.getItem("edupay_mock_students") || "[]");
      const fees = JSON.parse(localStorage.getItem("edupay_mock_fees") || "[]");
      const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });

      const dueDate = new Date();
      dueDate.setDate(10);
      if (dueDate < new Date()) {
        dueDate.setMonth(dueDate.getMonth() + 1);
      }

      let createdCount = 0;
      students.forEach(s => {
        const exists = fees.find(f => f.studentId === s._id && f.month === currentMonth);
        if (!exists) {
          fees.unshift({
            _id: `fee_${Date.now()}_${s._id}`,
            studentId: s._id,
            schoolId: "school1",
            month: currentMonth,
            amount: s.monthlyFee,
            fine: 0,
            status: "unpaid",
            dueDate: dueDate.toISOString()
          });
          createdCount++;
        }
      });

      localStorage.setItem("edupay_mock_fees", JSON.stringify(fees));
      return { success: true, message: `Generated fees for ${createdCount} students.` };
    }
  },

  markAsPaid: async (id, token) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/fees/pay/${id}`, {
        method: "PUT",
        headers: getHeaders(token)
      });
      return await res.json();
    } else {
      const fees = JSON.parse(localStorage.getItem("edupay_mock_fees") || "[]");
      const students = JSON.parse(localStorage.getItem("edupay_mock_students") || "[]");
      const index = fees.findIndex(f => f._id === id);

      if (index !== -1) {
        fees[index].status = "paid";
        fees[index].paidDate = new Date().toISOString();
        localStorage.setItem("edupay_mock_fees", JSON.stringify(fees));

        // Add parent notification
        const student = students.find(s => s._id === fees[index].studentId);
        if (student) {
          const notifications = JSON.parse(localStorage.getItem("edupay_mock_notifications") || "[]");
          notifications.unshift({
            _id: `n_${Date.now()}`,
            userId: student.parentId,
            message: `Assalam-o-Alaikum! Fee for ${student.name} for the month of ${fees[index].month} has been successfully paid / فیس کامیابی سے ادا کر دی گئی ہے۔`,
            type: "paid",
            read: false,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem("edupay_mock_notifications", JSON.stringify(notifications));
        }

        return fees[index];
      }
      throw new Error("Fee record not found");
    }
  },

  sendReminder: async (id, token) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/fees/reminder/${id}`, {
        method: "POST",
        headers: getHeaders(token)
      });
      return await res.json();
    } else {
      const fees = JSON.parse(localStorage.getItem("edupay_mock_fees") || "[]");
      const students = JSON.parse(localStorage.getItem("edupay_mock_students") || "[]");
      const fee = fees.find(f => f._id === id);

      if (fee) {
        const student = students.find(s => s._id === fee.studentId);
        if (student) {
          const notifications = JSON.parse(localStorage.getItem("edupay_mock_notifications") || "[]");
          notifications.unshift({
            _id: `n_${Date.now()}`,
            userId: student.parentId,
            message: `Assalam-o-Alaikum! Fee of Rs. ${fee.amount + fee.fine} is pending for ${student.name} for the month of ${fee.month}. Please pay before the due date / آپ کی فیس واجب الادا ہے۔`,
            type: "fee_due",
            read: false,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem("edupay_mock_notifications", JSON.stringify(notifications));
        }
        return { success: true, message: "Reminder sent." };
      }
      throw new Error("Fee record not found");
    }
  },

  // Reports (Admin Dashboard)
  getDashboardStats: async (token) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/reports/dashboard`, { headers: getHeaders(token) });
      return await res.json();
    } else {
      verifyMockLateFees();
      const students = JSON.parse(localStorage.getItem("edupay_mock_students") || "[]");
      const fees = JSON.parse(localStorage.getItem("edupay_mock_fees") || "[]");

      const totalStudents = students.length;
      
      const paidFees = fees.filter(f => f.status === "paid");
      const totalCollected = paidFees.reduce((acc, f) => acc + f.amount + (f.fine || 0), 0);

      const pendingFees = fees.filter(f => f.status === "unpaid" || f.status === "late");
      const totalPending = pendingFees.reduce((acc, f) => acc + f.amount + (f.fine || 0), 0);

      // Group monthly collected fees for chart
      const monthlyObj = {};
      paidFees.forEach(f => {
        monthlyObj[f.month] = (monthlyObj[f.month] || 0) + f.amount + (f.fine || 0);
      });

      const chartData = Object.keys(monthlyObj).map(m => ({
        month: m,
        collected: monthlyObj[m]
      }));

      // If empty chart, fill current month
      if (chartData.length === 0) {
        const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
        chartData.push({ month: currentMonth, collected: 0 });
      }

      // Recent Activity Feed
      const activities = [];
      paidFees.slice(0, 3).forEach(f => {
        const student = students.find(s => s._id === f.studentId);
        activities.push({
          id: f._id,
          type: "payment",
          message: `${student ? student.name : "Ali"} (Class ${student ? student.class : ""}) ne fee pay ki - Rs. ${f.amount + (f.fine || 0)}`,
          time: f.paidDate || f.updatedAt || new Date().toISOString()
        });
      });

      students.slice(-2).forEach(s => {
        activities.push({
          id: s._id,
          type: "student_added",
          message: `${s.name} Class ${s.class}-${s.section} me add hua`,
          time: s.createdAt || new Date().toISOString()
        });
      });

      // Sort by time
      activities.sort((a,b) => new Date(b.time) - new Date(a.time));

      return {
        totalStudents,
        totalCollected,
        totalPending,
        chartData,
        recentActivities: activities.slice(0, 5)
      };
    }
  },

  // Notifications
  getNotifications: async (token) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/notifications`, { headers: getHeaders(token) });
      return await res.json();
    } else {
      const notifications = JSON.parse(localStorage.getItem("edupay_mock_notifications") || "[]");
      const userId = token.startsWith("mock-token-") ? token.replace("mock-token-", "") : "parent1";
      return notifications.filter(n => n.userId === userId);
    }
  },

  markNotificationRead: async (id, token) => {
    const online = await isBackendOnline();
    if (online) {
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: "PUT",
        headers: getHeaders(token)
      });
      return await res.json();
    } else {
      const notifications = JSON.parse(localStorage.getItem("edupay_mock_notifications") || "[]");
      const index = notifications.findIndex(n => n._id === id);
      if (index !== -1) {
        notifications[index].read = true;
        localStorage.setItem("edupay_mock_notifications", JSON.stringify(notifications));
        return notifications[index];
      }
      throw new Error("Notification not found");
    }
  }
};
