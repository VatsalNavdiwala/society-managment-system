import 'package:flutter/material.dart';
import '../data/models/employee_model.dart';

class AdminDashboardViewModel extends ChangeNotifier {
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String _selectedRole = 'Admin';
  String get selectedRole => _selectedRole;

  int _totalStaff = 48;
  int get totalStaff => _totalStaff;

  int _presentToday = 41;
  int get presentToday => _presentToday;

  double _attendanceRate = 85.4;
  double get attendanceRate => _attendanceRate;

  List<EmployeeModel> _recentLogs = [];
  List<EmployeeModel> get recentLogs => _recentLogs;

  AdminDashboardViewModel() {
    fetchDashboardData();
  }

  void switchRole(String role) {
    _selectedRole = role;
    notifyListeners();
  }

  Future<void> fetchDashboardData() async {
    _isLoading = true;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 600));

    _recentLogs = [
      EmployeeModel(
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
        shift: "Day Shift",
        location: "Gate No. 1 Guard Room",
      ),
      EmployeeModel(
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
        shift: "General",
        location: "Main Clubhouse Electrical Room",
      ),
    ];

    _isLoading = false;
    notifyListeners();
  }
}
