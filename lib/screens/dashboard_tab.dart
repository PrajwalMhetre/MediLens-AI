import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/colors.dart';
import '../theme/styles.dart';
import '../providers/app_state.provider.dart';
import 'medicine_details_screen.dart';

class DashboardTab extends StatelessWidget {
  const DashboardTab({super.key});

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<AppStateProvider>(context);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppStyles.paddingContainer),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 60),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Hello,",
                        style: AppStyles.bodyLg.copyWith(
                          color: AppColors.onSurfaceVariant.withOpacity(0.6),
                        ),
                      ),
                      Text(
                        state.userName,
                        style: AppStyles.titleMd.copyWith(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: AppColors.onBackground,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppColors.surfaceContainerLowest,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.outlineVariant.withOpacity(0.4), width: 1.5),
                      image: const DecorationImage(
                        image: AssetImage("assets/images/home_dashboard.png"),
                        fit: BoxFit.cover,
                      ),
                      boxShadow: AppStyles.level1Shadow,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Search Bar
              Container(
                height: 48,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(100),
                  border: Border.all(color: AppColors.outlineVariant.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.search_rounded, color: AppColors.outline),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: "Search medications, reminders...",
                          hintStyle: AppStyles.bodyMd.copyWith(color: AppColors.outline),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                    const Icon(Icons.mic_none_rounded, color: AppColors.outline),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Adherence progress card (Glassmorphic)
              AppStyles.glassBlur(
                radius: AppStyles.radiusXl,
                child: Container(
                  padding: const EdgeInsets.all(AppStyles.spaceLg),
                  decoration: AppStyles.glassDecoration(
                    radius: AppStyles.radiusXl,
                    color: Colors.white.withOpacity(0.7),
                    borderColor: AppColors.primaryContainer.withOpacity(0.2),
                  ),
                  child: Row(
                    children: [
                      // Adherence Progress Ring
                      SizedBox(
                        width: 72,
                        height: 72,
                        child: CustomPaint(
                          painter: AdherenceRingPainter(
                            progress: state.todayAdherenceProgress,
                            color: AppColors.primaryContainer,
                            backgroundColor: AppColors.outlineVariant.withOpacity(0.25),
                          ),
                          child: Center(
                            child: Text(
                              "${(state.todayAdherenceProgress * 100).toInt()}%",
                              style: AppStyles.titleMd.copyWith(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: AppColors.primary,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Daily Adherence",
                              style: AppStyles.titleMd.copyWith(
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                color: AppColors.onSurface,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              state.todayAdherenceProgress == 1.0
                                  ? "Perfect! All medications checked off for today."
                                  : "Keep it up! You've taken ${state.reminders.where((r) => r.isTaken).length} of ${state.reminders.length} doses.",
                              style: AppStyles.bodyMd.copyWith(
                                color: AppColors.onSurfaceVariant,
                                height: 1.3,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 28),

              // Quick Actions
              Text(
                "Quick Actions",
                style: AppStyles.titleMd.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.onBackground,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildQuickAction(
                    context,
                    Icons.qr_code_scanner_rounded,
                    "Scan Medicine",
                    AppColors.primary,
                    AppColors.primaryContainer.withOpacity(0.12),
                  ),
                  _buildQuickAction(
                    context,
                    Icons.add_alarm_rounded,
                    "Add Reminder",
                    AppColors.secondary,
                    AppColors.secondaryFixed.withOpacity(0.3),
                  ),
                  _buildQuickAction(
                    context,
                    Icons.chat_bubble_outline_rounded,
                    "Consult AI",
                    AppColors.tertiary,
                    AppColors.tertiaryFixed.withOpacity(0.3),
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Active Medications Header
              Text(
                "Active Medications",
                style: AppStyles.titleMd.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.onBackground,
                ),
              ),
              const SizedBox(height: 12),

              // Active Medications List
              if (state.medicines.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 32),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerLowest,
                    borderRadius: BorderRadius.circular(AppStyles.radiusLg),
                    border: Border.all(color: AppColors.outlineVariant.withOpacity(0.3)),
                  ),
                  child: Center(
                    child: Text(
                      "No active medications found. Scan a label to add.",
                      style: AppStyles.bodyMd.copyWith(color: AppColors.outline),
                    ),
                  ),
                )
              else
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  padding: EdgeInsets.zero,
                  itemCount: state.medicines.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final med = state.medicines[index];
                    return InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => MedicineDetailsScreen(medicine: med),
                          ),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.all(AppStyles.spaceMd),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceContainerLowest,
                          borderRadius: BorderRadius.circular(AppStyles.radiusLg),
                          border: Border.all(color: AppColors.outlineVariant.withOpacity(0.3)),
                          boxShadow: AppStyles.level1Shadow,
                        ),
                        child: Row(
                          children: [
                            // Blister pack / drug photo representation
                            Container(
                              width: 56,
                              height: 56,
                              decoration: BoxDecoration(
                                color: AppColors.surfaceContainerLow,
                                borderRadius: BorderRadius.circular(AppStyles.radiusMd),
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(AppStyles.radiusMd),
                                child: Image.asset(
                                  med.imageAsset,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) =>
                                      const Icon(Icons.medication_rounded, color: AppColors.primary, size: 28),
                                ),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        med.name,
                                        style: AppStyles.titleMd.copyWith(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                          color: AppColors.onSurface,
                                        ),
                                      ),
                                      if (med.activeAllergiesConflict) ...[
                                        const SizedBox(width: 8),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: AppColors.errorContainer,
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: const Text(
                                            "Conflict",
                                            style: TextStyle(
                                              fontSize: 9,
                                              color: AppColors.onErrorContainer,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ]
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    "${med.dosage} • ${med.frequency}",
                                    style: AppStyles.bodyMd.copyWith(color: AppColors.onSurfaceVariant),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(Icons.chevron_right_rounded, color: AppColors.outline),
                          ],
                        ),
                      ),
                    );
                  },
                ),

              // Bottom space to let items scroll past the floating bottom shell nav
              const SizedBox(height: 110),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickAction(BuildContext context, IconData icon, String label, Color color, Color bgColor) {
    return InkWell(
      onTap: () {
        // Find main shell and redirect
        // We'll show a snackbar or advice to click the tab bar for high-fidelity demos
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Use the bottom navigation bar to open $label tab."),
            duration: const Duration(seconds: 1),
            behavior: SnackBarBehavior.floating,
          ),
        );
      },
      borderRadius: BorderRadius.circular(AppStyles.radiusLg),
      child: Container(
        width: 100,
        padding: const EdgeInsets.all(AppStyles.spaceSm),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(AppStyles.radiusLg),
          border: Border.all(color: AppColors.outlineVariant.withOpacity(0.3)),
          boxShadow: AppStyles.level1Shadow,
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: bgColor,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: AppStyles.labelSm.copyWith(
                fontSize: 11,
                color: AppColors.onSurface,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

// Custom Painter for Adherence Progress Ring
class AdherenceRingPainter extends CustomPainter {
  final double progress;
  final Color color;
  final Color backgroundColor;

  AdherenceRingPainter({
    required this.progress,
    required this.color,
    required this.backgroundColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;
    const strokeWidth = 8.0;

    final bgPaint = Paint()
      ..color = backgroundColor
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    final progressPaint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    // Draw background circle
    canvas.drawCircle(center, radius - strokeWidth / 2, bgPaint);

    // Draw progress arc
    final double sweepAngle = 2 * 3.1415926535 * progress;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius - strokeWidth / 2),
      -3.1415926535 / 2, // Start at 12 o'clock
      sweepAngle,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant AdherenceRingPainter oldDelegate) {
    return oldDelegate.progress != progress ||
        oldDelegate.color != color ||
        oldDelegate.backgroundColor != backgroundColor;
  }
}
