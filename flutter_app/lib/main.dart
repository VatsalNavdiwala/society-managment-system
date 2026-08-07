import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_colors.dart';
import 'viewmodels/admin_dashboard_viewmodel.dart';
import 'views/dashboard/admin_dashboard_view.dart';

void main() {
  runApp(const SocietyStaffApp());
}

class SocietyStaffApp extends StatelessWidget {
  const SocietyStaffApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AdminDashboardViewModel()),
      ],
      child: MaterialApp(
        title: 'Society Staff OS',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: AppColors.backgroundLight,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.primary,
            primary: AppColors.primary,
            secondary: AppColors.secondary,
          ),
        ),
        home: const AdminDashboardView(),
      ),
    );
  }
}
