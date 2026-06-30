import 'package:flutter/material.dart';
import '../theme/colors.dart';
import '../theme/styles.dart';
import 'dashboard_tab.dart';
import 'scan_tab.dart';
import 'reminders_tab.dart';
import 'chat_tab.dart';
import 'profile_tab.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const DashboardTab(),
    const ScanTab(),
    const RemindersTab(),
    const ChatTab(),
    const ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Current Tab content
          Positioned.fill(
            child: IndexedStack(
              index: _currentIndex,
              children: _tabs,
            ),
          ),

          // Floating Glassmorphic Navigation Bar
          Positioned(
            left: 20,
            right: 20,
            bottom: 24,
            child: AppStyles.glassBlur(
              radius: 100, // Fully pill-shaped
              child: Container(
                height: 64,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: AppStyles.glassDecoration(
                  radius: 100,
                  color: Colors.white.withOpacity(0.75),
                  borderColor: AppColors.outlineVariant.withOpacity(0.3),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildNavItem(0, Icons.dashboard_rounded, "Dashboard"),
                    _buildNavItem(1, Icons.camera_alt_rounded, "Scan"),
                    _buildNavItem(2, Icons.access_time_filled_rounded, "Reminders"),
                    _buildNavItem(3, Icons.forum_rounded, "AI Chat"),
                    _buildNavItem(4, Icons.person_rounded, "Profile"),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;
    final activeColor = AppColors.primary;
    final inactiveColor = AppColors.onSurfaceVariant.withOpacity(0.5);

    return InkWell(
      onTap: () {
        setState(() {
          _currentIndex = index;
        });
      },
      borderRadius: BorderRadius.circular(100),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: isSelected
            ? BoxDecoration(
                color: AppColors.primaryContainer.withOpacity(0.12),
                borderRadius: BorderRadius.circular(100),
              )
            : null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: isSelected ? activeColor : inactiveColor,
              size: 24,
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: AppStyles.labelSm.copyWith(
                fontSize: 9,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? activeColor : inactiveColor,
                letterSpacing: 0,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
