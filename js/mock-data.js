/* ==========================================================================
   Society Staff Management System - Enterprise Mock Dataset (52+ Screens)
   ========================================================================== */

const MockData = {
  societyInfo: {
    name: "Greenwood Heights & Towers Co-Op Housing Society",
    regNo: "HSG/MUM/2019/9482",
    address: "Plot 42, Palm Beach Road, Sector 15, Navi Mumbai - 400705",
    adminName: "Vikramaditya Sharma",
    adminRole: "Society President & Admin",
    adminAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  },

  // Current Logged-In User State per Role
  userProfiles: {
    Admin: {
      id: "ADM-001",
      name: "Vikramaditya Sharma",
      role: "Admin",
      designation: "Society Board President & Admin",
      department: "Board & Management",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      email: "president@greenwoodheights.org",
      phone: "+91 98200 11223",
      faceRegistered: true
    },
    Management: {
      id: "MGT-101",
      name: "Rajesh K. Verma",
      role: "Management",
      designation: "Chief Operations & Facility Manager",
      department: "Operations Management",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      email: "ops.mgr@greenwoodheights.org",
      phone: "+91 98201 44829",
      faceRegistered: true
    },
    Employee: {
      id: "EMP-101",
      name: "Ramesh Pawar",
      role: "Employee",
      designation: "Head Security Supervisor",
      department: "Security",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      email: "r.pawar@greenwoodheights.org",
      phone: "+91 98192 10293",
      faceRegistered: true,
      salary: "₹28,500"
    }
  },

  employees: [
    {
      id: "EMP-101",
      name: "Ramesh Pawar",
      designation: "Head Security Supervisor",
      department: "Security",
      status: "Present",
      phone: "+91 98192 10293",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      salary: "₹28,500",
      faceRegistered: true,
      checkInTime: "08:00 AM",
      checkOutTime: "05:00 PM",
      shift: "Day Shift (08:00 - 17:00)",
      location: "Gate No. 1 Guard Room",
      joiningDate: "12 Jan 2021"
    },
    {
      id: "EMP-102",
      name: "Suresh N. Patil",
      designation: "Senior Electrician",
      department: "Maintenance",
      status: "Present",
      phone: "+91 97690 33412",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      salary: "₹32,000",
      faceRegistered: true,
      checkInTime: "08:45 AM",
      checkOutTime: "Pending",
      shift: "General (09:00 - 18:00)",
      location: "Main Clubhouse Electrical Room",
      joiningDate: "05 Mar 2020"
    },
    {
      id: "EMP-103",
      name: "Pooja Deshmukh",
      designation: "Facility Supervisor",
      department: "Housekeeping",
      status: "Present",
      phone: "+91 91234 56789",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      salary: "₹26,000",
      faceRegistered: true,
      checkInTime: "09:05 AM",
      checkOutTime: "Pending",
      shift: "General (09:00 - 18:00)",
      location: "Tower A Lobby",
      joiningDate: "18 Aug 2022"
    },
    {
      id: "EMP-104",
      name: "Ganesh Kadam",
      designation: "Plumbing Specialist",
      department: "Maintenance",
      status: "Late",
      phone: "+91 98920 11234",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
      salary: "₹25,500",
      faceRegistered: true,
      checkInTime: "10:15 AM",
      checkOutTime: "Pending",
      shift: "General (09:00 - 18:00)",
      location: "Pump House B2",
      joiningDate: "01 Nov 2021"
    },
    {
      id: "EMP-105",
      name: "Sunita Yadav",
      designation: "Garden & Landscape Head",
      department: "Gardening",
      status: "On Leave",
      phone: "+91 93210 99887",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
      salary: "₹22,000",
      faceRegistered: true,
      checkInTime: "-",
      checkOutTime: "-",
      shift: "General (08:30 - 17:30)",
      location: "-",
      joiningDate: "10 Apr 2022"
    },
    {
      id: "EMP-106",
      name: "Amit Solanki",
      designation: "Night Security Guard",
      department: "Security",
      status: "Absent",
      phone: "+91 90041 55667",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
      salary: "₹24,000",
      faceRegistered: true,
      checkInTime: "-",
      checkOutTime: "-",
      shift: "Night (20:00 - 05:00)",
      location: "-",
      joiningDate: "14 Jun 2023"
    }
  ],

  departments: [
    { name: "Security", head: "Ramesh Pawar", staffCount: 16, budget: "₹4.5L/mo" },
    { name: "Maintenance", head: "Suresh N. Patil", staffCount: 12, budget: "₹3.8L/mo" },
    { name: "Housekeeping", head: "Pooja Deshmukh", staffCount: 14, budget: "₹3.2L/mo" },
    { name: "Gardening", head: "Sunita Yadav", staffCount: 6, budget: "₹1.4L/mo" }
  ],

  dashboardStats: {
    totalEmployees: 48,
    presentToday: 41,
    absentToday: 3,
    lateToday: 2,
    onLeaveToday: 2,
    attendancePercentage: 85.4,
    monthlyPayrollTotal: "₹12,45,000",
    payrollPaidCount: 42,
    payrollPendingCount: 6,
    pendingLeaveRequests: 4,
    lowStockAlertsCount: 3
  },

  attendanceLogs: [
    { id: "LOG-901", name: "Ramesh Pawar", time: "08:00 AM", status: "Present", confidence: "99.8%", method: "AI Face Scan", gate: "Gate 1 Camera" },
    { id: "LOG-902", name: "Suresh N. Patil", time: "08:45 AM", status: "Present", confidence: "99.2%", method: "AI Face Scan", gate: "Clubhouse Scanner" },
    { id: "LOG-903", name: "Pooja Deshmukh", time: "09:05 AM", status: "Present", confidence: "98.9%", method: "AI Face Scan", gate: "Lobby Tower A" },
    { id: "LOG-904", name: "Ganesh Kadam", time: "10:15 AM", status: "Late", confidence: "99.4%", method: "AI Face Scan", gate: "Gate 2 Camera" }
  ],

  leaveRequests: [
    {
      id: "LR-301",
      employeeName: "Sunita Yadav",
      department: "Gardening",
      leaveType: "Casual Leave",
      startDate: "07 Aug 2026",
      endDate: "09 Aug 2026",
      totalDays: 3,
      reason: "Family function in hometown",
      status: "Approved",
      appliedOn: "04 Aug 2026"
    },
    {
      id: "LR-302",
      employeeName: "Amit Solanki",
      department: "Security",
      leaveType: "Sick Leave",
      startDate: "07 Aug 2026",
      endDate: "08 Aug 2026",
      totalDays: 2,
      reason: "High fever & medical rest recommended",
      status: "Pending",
      appliedOn: "06 Aug 2026"
    },
    {
      id: "LR-303",
      employeeName: "Santosh Shinde",
      department: "Housekeeping",
      leaveType: "Annual Leave",
      startDate: "12 Aug 2026",
      endDate: "18 Aug 2026",
      totalDays: 7,
      reason: "Annual vacation with family",
      status: "Pending",
      appliedOn: "05 Aug 2026"
    }
  ],

  inventoryItems: [
    { id: "INV-01", name: "LED Floodlight 100W", category: "Electrical", stock: 6, minThreshold: 10, status: "Low Stock", vendor: "Havells India", price: "₹2,400", unit: "Pcs" },
    { id: "INV-02", name: "Industrial Floor Cleaner Disinfectant (20L)", category: "Cleaning", stock: 18, minThreshold: 5, status: "In Stock", vendor: "Taski Chemicals", price: "₹1,850", unit: "Cans" },
    { id: "INV-03", name: "PVC Heavy Pipe 2 inch", category: "Plumbing", stock: 4, minThreshold: 8, status: "Low Stock", vendor: "Supreme Pipes", price: "₹650", unit: "Pcs" },
    { id: "INV-04", name: "Lawn Mower Blade Replacement", category: "Gardening", stock: 2, minThreshold: 3, status: "Low Stock", vendor: "Bosch Tools", price: "₹3,200", unit: "Sets" },
    { id: "INV-05", name: "Security Guard Register Books", category: "Stationery", stock: 25, minThreshold: 5, status: "In Stock", vendor: "Neelgagan Printers", price: "₹180", unit: "Books" },
    { id: "INV-06", name: "Submersible Water Pump 5HP", category: "Equipment", stock: 3, minThreshold: 1, status: "In Stock", vendor: "Kirloskar Brothers", price: "₹38,000", unit: "Units" }
  ],

  vendors: [
    { name: "Havells India Ltd.", category: "Electrical", contact: "+91 98210 55443", rating: "4.8 ★", status: "Active" },
    { name: "Taski Hygiene Supplies", category: "Cleaning", contact: "+91 98900 12345", rating: "4.9 ★", status: "Active" },
    { name: "Supreme Pipes & Fittings", category: "Plumbing", contact: "+91 97680 99887", rating: "4.6 ★", status: "Active" }
  ],

  holidays: [
    { date: "15 Aug 2026", title: "Independence Day", type: "National Holiday" },
    { date: "27 Aug 2026", title: "Ganesh Chaturthi", type: "Festival Holiday" },
    { date: "02 Oct 2026", title: "Gandhi Jayanti", type: "National Holiday" },
    { date: "01 Nov 2026", title: "Diwali Laxmi Pujan", type: "Festival Holiday" }
  ],

  notifications: [
    { id: "N-1", title: "Monthly Payroll Generated", desc: "Payroll for August 2026 has been finalized. 42 slips generated.", time: "10 mins ago", category: "Salary", icon: "ri-bank-card-line", unread: true },
    { id: "N-2", title: "Low Stock Alert: LED Lights", desc: "Electrical inventory reached minimum threshold (6 pcs remaining).", time: "1 hour ago", category: "Inventory", icon: "ri-error-warning-line", unread: true },
    { id: "N-3", title: "New Leave Application", desc: "Amit Solanki requested 2 days Sick Leave.", time: "3 hours ago", category: "Leave", icon: "ri-calendar-event-line", unread: false },
    { id: "N-4", title: "AI Face Log Variance", desc: "Ganesh Kadam marked late arrival at 10:15 AM via Gate 2.", time: "Yesterday", category: "Attendance", icon: "ri-user-unfollow-line", unread: false }
  ]
};
