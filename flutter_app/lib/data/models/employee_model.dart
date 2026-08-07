class EmployeeModel {
  final String id;
  final String name;
  final String designation;
  final String department;
  final String status;
  final String phone;
  final String avatar;
  final String salary;
  final bool faceRegistered;
  final String checkInTime;
  final String checkOutTime;
  final String shift;
  final String location;

  EmployeeModel({
    required this.id,
    required this.name,
    required this.designation,
    required this.department,
    required this.status,
    required this.phone,
    required this.avatar,
    required this.salary,
    required this.faceRegistered,
    required this.checkInTime,
    required this.checkOutTime,
    required this.shift,
    required this.location,
  });

  factory EmployeeModel.fromJson(Map<String, dynamic> json) {
    return EmployeeModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      designation: json['designation'] ?? '',
      department: json['department'] ?? '',
      status: json['status'] ?? 'Present',
      phone: json['phone'] ?? '',
      avatar: json['avatar'] ?? '',
      salary: json['salary'] ?? '',
      faceRegistered: json['faceRegistered'] ?? false,
      checkInTime: json['checkInTime'] ?? '-',
      checkOutTime: json['checkOutTime'] ?? '-',
      shift: json['shift'] ?? '',
      location: json['location'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'designation': designation,
    'department': department,
    'status': status,
    'phone': phone,
    'avatar': avatar,
    'salary': salary,
    'faceRegistered': faceRegistered,
    'checkInTime': checkInTime,
    'checkOutTime': checkOutTime,
    'shift': shift,
    'location': location,
  };
}
