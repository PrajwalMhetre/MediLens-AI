import 'package:flutter/material.dart';
import 'package:medilens_ai/core/theme/colors.dart';
import 'package:medilens_ai/core/theme/styles.dart';
import 'package:medilens_ai/features/chat/presentation/chat_tab.dart';
import 'package:medilens_ai/features/dashboard/presentation/dashboard_tab.dart';
import 'package:medilens_ai/features/profile/presentation/profile_tab.dart';
import 'package:medilens_ai/features/reminders/presentation/reminders_tab.dart';
import 'package:medilens_ai/features/scan/presentation/scan_tab.dart';

/// InheritedWidget so child screens can call MainShell.of(context).switchTab(index)
class MainShellScope extends InheritedWidget {
  final void Function(int index) switchTab;

  const MainShellScope({
    super.key,
    required this.switchTab,
    required super.child,
  });

  @override
  bool updateShouldNotify(covariant MainShellScope oldWidget) => false;
}

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  /// Access the shell scope from any descendant widget
  static MainShellScope? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<MainShellScope>();
  }

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell>
    with SingleTickerProviderStateMixin {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const DashboardTab(),
    const ScanTab(),
    const RemindersTab(),
    const ChatTab(),
    const ProfileTab(),
  ];

  void _switchTab(int index) {
    if (index >= 0 && index < _tabs.length) {
      setState(() {
        _currentIndex = index;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MainShellScope(
      switchTab: _switchTab,
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: Stack(
          children: [
            // Current Tab content
            Positioned.fill(
              child: IndexedStack(index: _currentIndex, children: _tabs),
            ),

            // Gradient fade vignette above floating nav bar
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              height: 110,
              child: IgnorePointer(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        AppColors.background.withValues(alpha: 0.0),
                        AppColors.background.withValues(alpha: 0.6),
                        AppColors.background.withValues(alpha: 0.95),
                      ],
                      stops: const [0.0, 0.4, 1.0],
                    ),
                  ),
                ),
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
                    color: Colors.white.withValues(alpha: 0.75),
                    borderColor:
                        AppColors.outlineVariant.withValues(alpha: 0.3),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildNavItem(0, Icons.dashboard_rounded, "Dashboard"),
                      _buildNavItem(1, Icons.camera_alt_rounded, "Scan"),
                      _buildNavItem(
                        2,
                        Icons.access_time_filled_rounded,
                        "Reminders",
                      ),
                      _buildNavItem(3, Icons.forum_rounded, "AI Chat"),
                      _buildNavItem(4, Icons.person_rounded, "Profile"),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;
    final activeColor = AppColors.primary;
    final inactiveColor = AppColors.onSurfaceVariant.withValues(alpha: 0.5);

    return InkWell(
      onTap: () => _switchTab(index),
      borderRadius: BorderRadius.circular(100),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutCubic,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: isSelected
            ? BoxDecoration(
                color: AppColors.primaryContainer.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(100),
              )
            : null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedScale(
              scale: isSelected ? 1.15 : 1.0,
              duration: const Duration(milliseconds: 250),
              curve: Curves.easeOutBack,
              child: Icon(
                icon,
                color: isSelected ? activeColor : inactiveColor,
                size: 24,
              ),
            ),
            const SizedBox(height: 2),
            AnimatedDefaultTextStyle(
              duration: const Duration(milliseconds: 250),
              style: AppStyles.labelSm.copyWith(
                fontSize: 9,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? activeColor : inactiveColor,
                letterSpacing: 0,
              ),
              child: Text(label),
            ),
          ],
        ),
      ),
    );
  }
}
