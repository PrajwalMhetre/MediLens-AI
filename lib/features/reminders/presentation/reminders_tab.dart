import 'package:flutter/material.dart';
import 'package:medilens_ai/app/state/app_state_provider.dart';
import 'package:medilens_ai/core/theme/colors.dart';
import 'package:medilens_ai/core/theme/styles.dart';
import 'package:provider/provider.dart';

class RemindersTab extends StatefulWidget {
  const RemindersTab({super.key});

  @override
  State<RemindersTab> createState() => _RemindersTabState();
}

class _RemindersTabState extends State<RemindersTab> {
  DateTime _selectedDate = DateTime.now();
  bool _showCelebration = false;

  // Generate list of dates around today (e.g. 7 days)
  List<DateTime> _getDates() {
    final today = DateTime.now();
    return List.generate(7, (index) => today.add(Duration(days: index - 2)));
  }

  void _checkAllCompleted(AppStateProvider state) {
    if (state.reminders.isNotEmpty &&
        state.reminders.every((r) => r.isTaken) &&
        !_showCelebration) {
      setState(() => _showCelebration = true);
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) setState(() => _showCelebration = false);
      });
    }
  }

  void _showAddReminderSheet(BuildContext context) {
    final state = Provider.of<AppStateProvider>(context, listen: false);
    final formKey = GlobalKey<FormState>();
    final nameController = TextEditingController();
    final dosageController = TextEditingController();
    TimeOfDay selectedTime = TimeOfDay.now();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
              ),
              child: Container(
                decoration: const BoxDecoration(
                  color: AppColors.surfaceContainerLowest,
                  borderRadius: BorderRadius.vertical(
                    top: Radius.circular(AppStyles.radiusXl),
                  ),
                ),
                padding: const EdgeInsets.all(AppStyles.paddingContainer),
                child: Form(
                  key: formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 44,
                          height: 5,
                          margin: const EdgeInsets.only(bottom: 20),
                          decoration: BoxDecoration(
                            color: AppColors.outlineVariant.withValues(
                              alpha: 0.5,
                            ),
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                      ),
                      Text(
                        "New Medication Reminder",
                        style: AppStyles.titleMd.copyWith(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: AppColors.onSurface,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Medication name field
                      TextFormField(
                        controller: nameController,
                        decoration: InputDecoration(
                          labelText: "Medication Name",
                          hintText: "e.g. Ibuprofen",
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(
                              AppStyles.radiusDefault,
                            ),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return "Please enter medication name";
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Dosage field
                      TextFormField(
                        controller: dosageController,
                        decoration: InputDecoration(
                          labelText: "Dosage",
                          hintText: "e.g. 400 mg",
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(
                              AppStyles.radiusDefault,
                            ),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return "Please enter dosage amount";
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Time Selector Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "Reminder Time",
                            style: AppStyles.bodyLg.copyWith(
                              fontWeight: FontWeight.w500,
                              color: AppColors.onSurface,
                            ),
                          ),
                          TextButton.icon(
                            icon: const Icon(
                              Icons.access_time_rounded,
                              color: AppColors.primary,
                            ),
                            label: Text(
                              selectedTime.format(context),
                              style: AppStyles.bodyLg.copyWith(
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary,
                              ),
                            ),
                            onPressed: () async {
                              final time = await showTimePicker(
                                context: context,
                                initialTime: selectedTime,
                              );
                              if (time != null) {
                                setSheetState(() {
                                  selectedTime = time;
                                });
                              }
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Add Button
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          onPressed: () {
                            if (formKey.currentState!.validate()) {
                              state.addReminder(
                                nameController.text,
                                dosageController.text,
                                selectedTime.format(context),
                              );
                              Navigator.pop(context);
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryContainer,
                            foregroundColor: AppColors.onPrimaryContainer,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(
                                AppStyles.radiusDefault,
                              ),
                            ),
                          ),
                          child: Text(
                            "Add Reminder",
                            style: AppStyles.titleMd.copyWith(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<AppStateProvider>(context);
    final dates = _getDates();

    // Check completion after build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkAllCompleted(state);
    });

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppStyles.paddingContainer,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 20),

                  // Title and Add Button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Medication Reminders",
                        style: AppStyles.headlineLg.copyWith(
                          fontSize: 26,
                          fontWeight: FontWeight.w700,
                          color: AppColors.onBackground,
                        ),
                      ),
                      IconButton(
                        onPressed: () => _showAddReminderSheet(context),
                        icon: const Icon(
                          Icons.add_circle_outline_rounded,
                          color: AppColors.primary,
                          size: 32,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Horizontal Calendar date strip
                  SizedBox(
                    height: 84,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: dates.length,
                      separatorBuilder: (context, index) =>
                          const SizedBox(width: 10),
                      itemBuilder: (context, index) {
                        final date = dates[index];
                        final isToday =
                            date.day == DateTime.now().day &&
                            date.month == DateTime.now().month &&
                            date.year == DateTime.now().year;
                        final isSelected =
                            date.day == _selectedDate.day &&
                            date.month == _selectedDate.month &&
                            date.year == _selectedDate.year;

                        final weekdayStr = [
                          "Mon",
                          "Tue",
                          "Wed",
                          "Thu",
                          "Fri",
                          "Sat",
                          "Sun",
                        ][date.weekday - 1];

                        return InkWell(
                          onTap: () {
                            setState(() {
                              _selectedDate = date;
                            });
                          },
                          borderRadius:
                              BorderRadius.circular(AppStyles.radiusMd),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            curve: Curves.easeOutCubic,
                            width: 54,
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? AppColors.primaryContainer
                                  : AppColors.surfaceContainerLowest,
                              borderRadius: BorderRadius.circular(
                                AppStyles.radiusMd,
                              ),
                              border: Border.all(
                                color: isSelected
                                    ? AppColors.primary
                                    : AppColors.outlineVariant.withValues(
                                        alpha: 0.3,
                                      ),
                              ),
                              boxShadow:
                                  isSelected ? AppStyles.level1Shadow : null,
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  weekdayStr,
                                  style: AppStyles.labelSm.copyWith(
                                    color: isSelected
                                        ? AppColors.onPrimaryContainer
                                        : AppColors.onSurfaceVariant
                                            .withValues(alpha: 0.6),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 11,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  "${date.day}",
                                  style: AppStyles.titleMd.copyWith(
                                    color: isSelected
                                        ? AppColors.onPrimaryContainer
                                        : AppColors.onSurface,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                if (isToday) ...[
                                  const SizedBox(height: 2),
                                  Container(
                                    width: 4,
                                    height: 4,
                                    decoration: BoxDecoration(
                                      color: isSelected
                                          ? AppColors.onPrimaryContainer
                                          : AppColors.primaryContainer,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Title for today
                  Text(
                    "Today's Schedule",
                    style: AppStyles.titleMd.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.onSurface,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Reminders list with proper bottom padding
                  Expanded(
                    child: state.reminders.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.event_available_rounded,
                                  size: 48,
                                  color: AppColors.outline.withValues(
                                      alpha: 0.4),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  "No reminders scheduled.",
                                  style: AppStyles.bodyMd.copyWith(
                                    color: AppColors.outline,
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.separated(
                            // Extra bottom padding for floating nav bar
                            padding: const EdgeInsets.only(bottom: 110),
                            itemCount: state.reminders.length,
                            separatorBuilder: (context, index) =>
                                const SizedBox(height: 12),
                            itemBuilder: (context, index) {
                              final r = state.reminders[index];
                              return _AnimatedReminderCard(
                                reminder: r,
                                onToggle: () {
                                  state.toggleReminderTaken(r.id);
                                },
                              );
                            },
                          ),
                  ),
                ],
              ),
            ),

            // Celebration overlay
            if (_showCelebration)
              Positioned.fill(
                child: IgnorePointer(
                  child: _CelebrationOverlay(),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// Animated reminder card with scale-bounce checkbox
class _AnimatedReminderCard extends StatefulWidget {
  final dynamic reminder;
  final VoidCallback onToggle;

  const _AnimatedReminderCard({
    required this.reminder,
    required this.onToggle,
  });

  @override
  State<_AnimatedReminderCard> createState() => _AnimatedReminderCardState();
}

class _AnimatedReminderCardState extends State<_AnimatedReminderCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _bounceController;
  late Animation<double> _bounceAnimation;

  @override
  void initState() {
    super.initState();
    _bounceController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _bounceAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.3), weight: 40),
      TweenSequenceItem(tween: Tween(begin: 1.3, end: 0.9), weight: 30),
      TweenSequenceItem(tween: Tween(begin: 0.9, end: 1.0), weight: 30),
    ]).animate(CurvedAnimation(
      parent: _bounceController,
      curve: Curves.easeOut,
    ));
  }

  @override
  void dispose() {
    _bounceController.dispose();
    super.dispose();
  }

  void _handleTap() {
    _bounceController.forward(from: 0);
    widget.onToggle();
  }

  @override
  Widget build(BuildContext context) {
    final r = widget.reminder;
    return InkWell(
      onTap: _handleTap,
      borderRadius: BorderRadius.circular(AppStyles.radiusLg),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.all(AppStyles.spaceMd),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(AppStyles.radiusLg),
          border: Border.all(
            color: r.isTaken
                ? AppColors.primary.withValues(alpha: 0.3)
                : AppColors.outlineVariant.withValues(alpha: 0.3),
          ),
          boxShadow: AppStyles.level1Shadow,
        ),
        child: Row(
          children: [
            // Animated checkbox
            ScaleTransition(
              scale: _bounceAnimation,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: r.isTaken
                      ? AppColors.primaryContainer
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: r.isTaken ? AppColors.primary : AppColors.outline,
                    width: 2,
                  ),
                ),
                child: r.isTaken
                    ? const Icon(
                        Icons.check,
                        size: 16,
                        color: AppColors.onPrimaryContainer,
                      )
                    : null,
              ),
            ),
            const SizedBox(width: 16),

            // Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    r.medicineName,
                    style: AppStyles.titleMd.copyWith(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.onSurface,
                      decoration:
                          r.isTaken ? TextDecoration.lineThrough : null,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "${r.dosage} • ${r.time}",
                    style: AppStyles.bodyMd.copyWith(
                      color: AppColors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),

            // Timing icon
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLow,
                shape: BoxShape.circle,
              ),
              child: Icon(
                r.isTaken
                    ? Icons.check_circle_outline_rounded
                    : Icons.access_alarm_rounded,
                color: r.isTaken
                    ? AppColors.primaryContainer
                    : AppColors.primary,
                size: 18,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Celebration overlay when all reminders are completed
class _CelebrationOverlay extends StatefulWidget {
  @override
  State<_CelebrationOverlay> createState() => _CelebrationOverlayState();
}

class _CelebrationOverlayState extends State<_CelebrationOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    );
    _scaleAnim = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: 1.2), weight: 30),
      TweenSequenceItem(tween: Tween(begin: 1.2, end: 1.0), weight: 20),
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.0), weight: 30),
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 0.0), weight: 20),
    ]).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));
    _fadeAnim = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: 1.0), weight: 20),
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.0), weight: 50),
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 0.0), weight: 30),
    ]).animate(_controller);
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _fadeAnim.value,
          child: Center(
            child: Transform.scale(
              scale: _scaleAnim.value,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
                decoration: BoxDecoration(
                  color: AppColors.primaryContainer.withValues(alpha: 0.95),
                  borderRadius: BorderRadius.circular(AppStyles.radiusXl),
                  boxShadow: [
                    BoxShadow(
                      color:
                          AppColors.primaryContainer.withValues(alpha: 0.4),
                      blurRadius: 30,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.celebration_rounded,
                      color: AppColors.onPrimaryContainer,
                      size: 48,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      "All Done! 🎉",
                      style: AppStyles.titleMd.copyWith(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: AppColors.onPrimaryContainer,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "All medications taken for today",
                      style: AppStyles.bodyMd.copyWith(
                        color: AppColors.onPrimaryContainer.withValues(
                            alpha: 0.8),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
