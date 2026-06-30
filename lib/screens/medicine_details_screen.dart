import 'package:flutter/material.dart';
import '../models/medicine.dart';
import '../theme/colors.dart';
import '../theme/styles.dart';

class MedicineDetailsScreen extends StatelessWidget {
  final Medicine medicine;

  const MedicineDetailsScreen({super.key, required this.medicine});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Image Header area
            Stack(
              children: [
                Container(
                  height: 260,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerLow,
                    image: DecorationImage(
                      image: AssetImage(medicine.imageAsset),
                      fit: BoxFit.cover,
                      alignment: Alignment.center,
                    ),
                  ),
                ),
                // Soft gradient overlay over image
                Container(
                  height: 260,
                  width: double.infinity,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.black45,
                        Colors.transparent,
                        Colors.black54,
                      ],
                    ),
                  ),
                ),
                // Back Button
                Positioned(
                  top: 50,
                  left: 16,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.9),
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.onSurface, size: 18),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                ),
                // Medicine basic details text inside image overlay
                Positioned(
                  bottom: 20,
                  left: 20,
                  right: 20,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primaryContainer,
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: Text(
                          "Prescription Scanned",
                          style: AppStyles.labelSm.copyWith(
                            color: AppColors.onPrimaryContainer,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        medicine.name,
                        style: AppStyles.headlineLgMobile.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        medicine.dosage,
                        style: AppStyles.bodyLg.copyWith(
                          color: Colors.white70,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // Content Area
            Padding(
              padding: const EdgeInsets.all(AppStyles.paddingContainer),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Allergy conflict warning card (HIGH VISIBILITY RED BANNER)
                  if (medicine.activeAllergiesConflict) ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.errorContainer,
                        borderRadius: BorderRadius.circular(AppStyles.radiusLg),
                        border: Border.all(color: AppColors.error.withOpacity(0.5)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.report_problem_rounded, color: AppColors.error, size: 24),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  "ALLERGY CONFLICT DETECTED",
                                  style: AppStyles.titleMd.copyWith(
                                    fontSize: 15,
                                    color: AppColors.onErrorContainer,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(
                            "You are allergic to Penicillin. ${medicine.name} is a penicillin derivative and taking it may trigger a severe allergic reaction.",
                            style: AppStyles.bodyMd.copyWith(
                              color: AppColors.onErrorContainer,
                              height: 1.4,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            "CRITICAL ACTION: Do NOT ingest this medication. Contact your health provider immediately for an alternative prescription.",
                            style: AppStyles.bodyMd.copyWith(
                              color: AppColors.onErrorContainer.withOpacity(0.85),
                              fontSize: 12,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Details and Timing Summary
                  Text(
                    "Intake Instructions",
                    style: AppStyles.titleMd.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.onBackground,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceContainerLowest,
                      borderRadius: BorderRadius.circular(AppStyles.radiusLg),
                      border: Border.all(color: AppColors.outlineVariant.withOpacity(0.3)),
                    ),
                    child: Column(
                      children: [
                        _buildIntakeRow(Icons.schedule_rounded, "Schedule", medicine.frequency),
                        const Divider(height: 20, color: Colors.black12),
                        _buildIntakeRow(Icons.info_outline_rounded, "Directions", medicine.instructions),
                        const Divider(height: 20, color: Colors.black12),
                        _buildIntakeRow(
                          Icons.notifications_active_outlined,
                          "Reminders Set At",
                          medicine.timeList.join(", "),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Side Effects Accordion
                  _buildExpansionTile(
                    "Possible Side Effects",
                    Icons.warning_amber_rounded,
                    medicine.sideEffects,
                    Colors.orange,
                  ),
                  const SizedBox(height: 12),

                  // Safe Usage Guidelines Accordion
                  _buildExpansionTile(
                    "Warnings & Guidelines",
                    Icons.security_rounded,
                    medicine.warnings,
                    AppColors.primary,
                  ),
                  const SizedBox(height: 40),

                  // Bottom Action Buttons
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor:
                            medicine.activeAllergiesConflict ? AppColors.error : AppColors.primaryContainer,
                        foregroundColor:
                            medicine.activeAllergiesConflict ? Colors.white : AppColors.onPrimaryContainer,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppStyles.radiusDefault),
                        ),
                      ),
                      child: Text(
                        medicine.activeAllergiesConflict ? "Acknowledge Critical Warning" : "Done",
                        style: AppStyles.titleMd.copyWith(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIntakeRow(IconData icon, String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: AppColors.primary, size: 20),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppStyles.labelSm.copyWith(
                  color: AppColors.onSurfaceVariant.withOpacity(0.6),
                  fontSize: 10,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: AppStyles.bodyLg.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.onSurface,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildExpansionTile(String title, IconData icon, List<String> items, Color accentColor) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(AppStyles.radiusLg),
        border: Border.all(color: AppColors.outlineVariant.withOpacity(0.3)),
      ),
      child: Theme(
        data: ThemeData().copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: accentColor.withOpacity(0.08),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: accentColor, size: 18),
          ),
          title: Text(
            title,
            style: AppStyles.bodyLg.copyWith(
              fontWeight: FontWeight.w700,
              color: AppColors.onSurface,
            ),
          ),
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 20, right: 20, bottom: 16),
              child: Column(
                children: items.map((item) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          margin: const EdgeInsets.only(top: 6),
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: accentColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            item,
                            style: AppStyles.bodyMd.copyWith(
                              color: AppColors.onSurfaceVariant,
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            )
          ],
        ),
      ),
    );
  }
}
