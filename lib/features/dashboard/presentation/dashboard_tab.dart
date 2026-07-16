import 'package:flutter/material.dart';
import 'package:medilens_ai/app/state/app_state_provider.dart';
import 'package:medilens_ai/core/constants/app_assets.dart';
import 'package:medilens_ai/core/theme/colors.dart';
import 'package:medilens_ai/core/theme/styles.dart';
import 'package:medilens_ai/features/medicine/presentation/medicine_details_screen.dart';
import 'package:medilens_ai/features/shell/presentation/main_shell.dart';
import 'package:provider/provider.dart';

class DashboardTab extends StatefulWidget {
  const DashboardTab({super.key});

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab>
    with SingleTickerProviderStateMixin {
  late AnimationController _entryController;
  late Animation<double> _fadeIn;
  late Animation<Offset> _slideUp;

  @override
  void initState() {
    super.initState();
    _entryController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _fadeIn = CurvedAnimation(
      parent: _entryController,
      curve: Curves.easeOut,
    );

    _slideUp = Tween<Offset>(
      begin: const Offset(0, 0.08),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _entryController,
      curve: Curves.easeOutCubic,
    ));

    _entryController.forward();
  }

  @override
  void dispose() {
    _entryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<AppStateProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: FadeTransition(
        opacity: _fadeIn,
        child: SlideTransition(
          position: _slideUp,
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppStyles.paddingContainer,
              ),
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
                              color: AppColors.onSurfaceVariant.withValues(
                                alpha: 0.6,
                              ),
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
                          border: Border.all(
                            color:
                                AppColors.outlineVariant.withValues(alpha: 0.4),
                            width: 1.5,
                          ),
                          image: const DecorationImage(
                            image: AssetImage(AppAssets.homeDashboard),
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
                      color:
                          AppColors.surfaceContainerLow.withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(100),
                      border: Border.all(
                        color:
                            AppColors.outlineVariant.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                            Icons.search_rounded, color: AppColors.outline),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            decoration: InputDecoration(
                              hintText: "Search medications, reminders...",
                              hintStyle: AppStyles.bodyMd.copyWith(
                                color: AppColors.outline,
                              ),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                        const Icon(
                          Icons.mic_none_rounded,
                          color: AppColors.outline,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Adherence progress card (Glassmorphic)
                  _AdherenceCard(state: state),
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
                        AppColors.primaryContainer.withValues(alpha: 0.12),
                        1, // Scan tab index
                      ),
                      _buildQuickAction(
                        context,
                        Icons.add_alarm_rounded,
                        "Add Reminder",
                        AppColors.secondary,
                        AppColors.secondaryFixed.withValues(alpha: 0.3),
                        2, // Reminders tab index
                      ),
                      _buildQuickAction(
                        context,
                        Icons.chat_bubble_outline_rounded,
                        "Consult AI",
                        AppColors.tertiary,
                        AppColors.tertiaryFixed.withValues(alpha: 0.3),
                        3, // Chat tab index
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
                        borderRadius:
                            BorderRadius.circular(AppStyles.radiusLg),
                        border: Border.all(
                          color: AppColors.outlineVariant.withValues(
                              alpha: 0.3),
                        ),
                      ),
                      child: Center(
                        child: Text(
                          "No active medications found. Scan a label to add.",
                          style: AppStyles.bodyMd.copyWith(
                            color: AppColors.outline,
                          ),
                        ),
                      ),
                    )
                  else
                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      padding: EdgeInsets.zero,
                      itemCount: state.medicines.length,
                      separatorBuilder: (context, index) =>
                          const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final med = state.medicines[index];
                        return _MedicineCard(medicine: med);
                      },
                    ),

                  // Bottom space to let items scroll past the floating bottom shell nav
                  const SizedBox(height: 110),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuickAction(
    BuildContext context,
    IconData icon,
    String label,
    Color color,
    Color bgColor,
    int tabIndex,
  ) {
    return InkWell(
      onTap: () {
        final shell = MainShell.of(context);
        if (shell != null) {
          shell.switchTab(tabIndex);
        }
      },
      borderRadius: BorderRadius.circular(AppStyles.radiusLg),
      child: Container(
        width: 100,
        padding: const EdgeInsets.all(AppStyles.spaceSm),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(AppStyles.radiusLg),
          border: Border.all(
            color: AppColors.outlineVariant.withValues(alpha: 0.3),
          ),
          boxShadow: AppStyles.level1Shadow,
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration:
                  BoxDecoration(color: bgColor, shape: BoxShape.circle),
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

/// Adherence card with animated glow when 100%
class _AdherenceCard extends StatefulWidget {
  final AppStateProvider state;
  const _AdherenceCard({required this.state});

  @override
  State<_AdherenceCard> createState() => _AdherenceCardState();
}

class _AdherenceCardState extends State<_AdherenceCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _glowController;
  late Animation<double> _glowAnimation;

  @override
  void initState() {
    super.initState();
    _glowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    );
    _glowAnimation = Tween<double>(begin: 0.04, end: 0.15).animate(
      CurvedAnimation(parent: _glowController, curve: Curves.easeInOut),
    );
    if (widget.state.todayAdherenceProgress >= 1.0) {
      _glowController.repeat(reverse: true);
    }
  }

  @override
  void didUpdateWidget(covariant _AdherenceCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.state.todayAdherenceProgress >= 1.0 &&
        !_glowController.isAnimating) {
      _glowController.repeat(reverse: true);
    } else if (widget.state.todayAdherenceProgress < 1.0) {
      _glowController.stop();
      _glowController.value = 0;
    }
  }

  @override
  void dispose() {
    _glowController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = widget.state;

    return AnimatedBuilder(
      animation: _glowAnimation,
      builder: (context, child) {
        return AppStyles.glassBlur(
          radius: AppStyles.radiusXl,
          child: Container(
            padding: const EdgeInsets.all(AppStyles.spaceLg),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.7),
              borderRadius: BorderRadius.circular(AppStyles.radiusXl),
              border: Border.all(
                color: state.todayAdherenceProgress >= 1.0
                    ? AppColors.primaryContainer.withValues(
                        alpha: _glowAnimation.value + 0.2)
                    : AppColors.primaryContainer.withValues(alpha: 0.2),
                width: state.todayAdherenceProgress >= 1.0 ? 2 : 1,
              ),
              boxShadow: state.todayAdherenceProgress >= 1.0
                  ? [
                      BoxShadow(
                        color: AppColors.primaryContainer.withValues(
                            alpha: _glowAnimation.value),
                        blurRadius: 20,
                        spreadRadius: 2,
                      ),
                    ]
                  : null,
            ),
            child: child,
          ),
        );
      },
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
                backgroundColor:
                    AppColors.outlineVariant.withValues(alpha: 0.25),
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
                Row(
                  children: [
                    Text(
                      "Daily Adherence",
                      style: AppStyles.titleMd.copyWith(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.onSurface,
                      ),
                    ),
                    if (state.todayAdherenceProgress >= 1.0) ...[
                      const SizedBox(width: 8),
                      const Icon(Icons.check_circle_rounded,
                          color: AppColors.primaryContainer, size: 20),
                    ],
                  ],
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
    );
  }
}

/// Medicine card with subtle hover/tap animation
class _MedicineCard extends StatelessWidget {
  final dynamic medicine;
  const _MedicineCard({required this.medicine});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                MedicineDetailsScreen(medicine: medicine),
          ),
        );
      },
      borderRadius: BorderRadius.circular(AppStyles.radiusLg),
      child: Container(
        padding: const EdgeInsets.all(AppStyles.spaceMd),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(AppStyles.radiusLg),
          border: Border.all(
            color: AppColors.outlineVariant.withValues(alpha: 0.3),
          ),
          boxShadow: AppStyles.level1Shadow,
        ),
        child: Row(
          children: [
            // Hero-wrapped image for transition to details
            Hero(
              tag: 'med_image_${medicine.name}',
              child: Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow,
                  borderRadius:
                      BorderRadius.circular(AppStyles.radiusMd),
                ),
                child: ClipRRect(
                  borderRadius:
                      BorderRadius.circular(AppStyles.radiusMd),
                  child: Image.asset(
                    medicine.imageAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        const Icon(
                      Icons.medication_rounded,
                      color: AppColors.primary,
                      size: 28,
                    ),
                  ),
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
                        medicine.name,
                        style: AppStyles.titleMd.copyWith(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppColors.onSurface,
                        ),
                      ),
                      if (medicine.activeAllergiesConflict) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.errorContainer,
                            borderRadius:
                                BorderRadius.circular(4),
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
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "${medicine.dosage} • ${medicine.frequency}",
                    style: AppStyles.bodyMd.copyWith(
                      color: AppColors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right_rounded,
              color: AppColors.outline,
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
