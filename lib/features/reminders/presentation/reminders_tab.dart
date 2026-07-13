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

  // Generate list of dates around today (e.g. 7 days)
  List<DateTime> _getDates() {
    final today = DateTime.now();
    return List.generate(7, (index) => today.add(Duration(days: index - 2)));
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

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
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
                      borderRadius: BorderRadius.circular(AppStyles.radiusMd),
                      child: Container(
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
                          boxShadow: isSelected ? AppStyles.level1Shadow : null,
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              weekdayStr,
                              style: AppStyles.labelSm.copyWith(
                                color: isSelected
                                    ? AppColors.onPrimaryContainer
                                    : AppColors.onSurfaceVariant.withValues(
                                        alpha: 0.6,
                                      ),
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

              // Reminders list
              Expanded(
                child: state.reminders.isEmpty
                    ? Center(
                        child: Text(
                          "No reminders scheduled.",
                          style: AppStyles.bodyMd.copyWith(
                            color: AppColors.outline,
                          ),
                        ),
                      )
                    : ListView.separated(
                        padding: EdgeInsets.zero,
                        itemCount: state.reminders.length,
                        separatorBuilder: (context, index) =>
                            const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final r = state.reminders[index];
                          return InkWell(
                            onTap: () => state.toggleReminderTaken(r.id),
                            borderRadius: BorderRadius.circular(
                              AppStyles.radiusLg,
                            ),
                            child: Container(
                              padding: const EdgeInsets.all(AppStyles.spaceMd),
                              decoration: BoxDecoration(
                                color: AppColors.surfaceContainerLowest,
                                borderRadius: BorderRadius.circular(
                                  AppStyles.radiusLg,
                                ),
                                border: Border.all(
                                  color: r.isTaken
                                      ? AppColors.primary.withValues(alpha: 0.3)
                                      : AppColors.outlineVariant.withValues(
                                          alpha: 0.3,
                                        ),
                                ),
                                boxShadow: AppStyles.level1Shadow,
                              ),
                              child: Row(
                                children: [
                                  // Checkbox representation
                                  AnimatedContainer(
                                    duration: const Duration(milliseconds: 250),
                                    width: 24,
                                    height: 24,
                                    decoration: BoxDecoration(
                                      color: r.isTaken
                                          ? AppColors.primaryContainer
                                          : Colors.transparent,
                                      borderRadius: BorderRadius.circular(6),
                                      border: Border.all(
                                        color: r.isTaken
                                            ? AppColors.primary
                                            : AppColors.outline,
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
                                  const SizedBox(width: 16),

                                  // Details
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          r.medicineName,
                                          style: AppStyles.titleMd.copyWith(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w600,
                                            color: AppColors.onSurface,
                                            decoration: r.isTaken
                                                ? TextDecoration.lineThrough
                                                : null,
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
                                    child: const Icon(
                                      Icons.access_alarm_rounded,
                                      color: AppColors.primary,
                                      size: 18,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),

              // Bottom padding for floating navigation shell
              const SizedBox(height: 110),
            ],
          ),
        ),
      ),
    );
  }
}
