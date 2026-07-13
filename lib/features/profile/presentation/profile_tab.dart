import 'package:flutter/material.dart';
import 'package:medilens_ai/app/state/app_state_provider.dart';
import 'package:medilens_ai/core/constants/app_assets.dart';
import 'package:medilens_ai/core/theme/colors.dart';
import 'package:medilens_ai/core/theme/styles.dart';
import 'package:provider/provider.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  bool _notificationToggled = true;
  bool _biometricToggled = false;
  bool _darkModeToggled = false;

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<AppStateProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppStyles.paddingContainer,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 60),

              // Title
              Text(
                "Medical Profile",
                style: AppStyles.headlineLg.copyWith(
                  fontSize: 26,
                  fontWeight: FontWeight.w700,
                  color: AppColors.onBackground,
                ),
              ),
              const SizedBox(height: 24),

              // Avatar & Basic Info Card
              Center(
                child: Column(
                  children: [
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 4),
                        image: const DecorationImage(
                          image: AssetImage(AppAssets.homeDashboard),
                          fit: BoxFit.cover,
                        ),
                        boxShadow: AppStyles.level2Shadow,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      state.userName,
                      style: AppStyles.titleMd.copyWith(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: AppColors.onSurface,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      state.userEmail,
                      style: AppStyles.bodyMd.copyWith(
                        color: AppColors.onSurfaceVariant.withValues(
                          alpha: 0.7,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Vitals/Stats Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildStatCard(
                    "Blood Type",
                    state.bloodType,
                    Icons.bloodtype_rounded,
                    Colors.red,
                  ),
                  _buildStatCard(
                    "Weight",
                    state.weight,
                    Icons.scale_rounded,
                    Colors.blue,
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Allergies Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(AppStyles.spaceMd),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLowest,
                  borderRadius: BorderRadius.circular(AppStyles.radiusLg),
                  border: Border.all(
                    color: AppColors.outlineVariant.withValues(alpha: 0.3),
                  ),
                  boxShadow: AppStyles.level1Shadow,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.warning_amber_rounded,
                          color: Colors.orange,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          "Known Allergies",
                          style: AppStyles.titleMd.copyWith(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: AppColors.onSurface,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: state.allergies.map((allergy) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.red.withValues(alpha: 0.08),
                            borderRadius: BorderRadius.circular(100),
                            border: Border.all(
                              color: Colors.red.withValues(alpha: 0.2),
                            ),
                          ),
                          child: Text(
                            allergy,
                            style: AppStyles.labelSm.copyWith(
                              color: Colors.red[800],
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Health Reports & Export
              Text(
                "Health Reports",
                style: AppStyles.titleMd.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.onBackground,
                ),
              ),
              const SizedBox(height: 12),
              Container(
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
                    _buildReportTile(
                      "Weekly Adherence Summary",
                      "View details for the past 7 days",
                      Icons.insights_rounded,
                      () {},
                    ),
                    const Divider(height: 1, indent: 56, color: Colors.black12),
                    _buildReportTile(
                      "Export Medical PDF",
                      "Download a detailed clinical summary",
                      Icons.picture_as_pdf_rounded,
                      () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              "PDF report downloaded to your device.",
                            ),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // App Settings
              Text(
                "App Settings",
                style: AppStyles.titleMd.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.onBackground,
                ),
              ),
              const SizedBox(height: 12),
              Container(
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
                    _buildSwitchTile(
                      "Reminders Notifications",
                      Icons.notifications_active_outlined,
                      _notificationToggled,
                      (val) => setState(() => _notificationToggled = val),
                    ),
                    const Divider(height: 1, indent: 56, color: Colors.black12),
                    _buildSwitchTile(
                      "Biometric (Face ID) Lock",
                      Icons.fingerprint_rounded,
                      _biometricToggled,
                      (val) => setState(() => _biometricToggled = val),
                    ),
                    const Divider(height: 1, indent: 56, color: Colors.black12),
                    _buildSwitchTile(
                      "Dark Mode Theme",
                      Icons.dark_mode_outlined,
                      _darkModeToggled,
                      (val) => setState(() => _darkModeToggled = val),
                    ),
                  ],
                ),
              ),

              // Bottom space to let items scroll past the floating bottom shell nav
              const SizedBox(height: 110),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(
    String label,
    String value,
    IconData icon,
    Color color,
  ) {
    return Container(
      width: (MediaQuery.of(context).size.width - 40 - 16) / 2,
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
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.08),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppStyles.labelSm.copyWith(
                    color: AppColors.onSurfaceVariant.withValues(alpha: 0.6),
                    fontSize: 10,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: AppStyles.titleMd.copyWith(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: AppColors.onSurface,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReportTile(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap,
  ) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLow,
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: AppColors.primary, size: 20),
      ),
      title: Text(
        title,
        style: AppStyles.bodyLg.copyWith(
          fontWeight: FontWeight.w600,
          color: AppColors.onSurface,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: AppStyles.bodyMd.copyWith(
          color: AppColors.onSurfaceVariant.withValues(alpha: 0.7),
        ),
      ),
      trailing: const Icon(
        Icons.arrow_forward_ios_rounded,
        size: 14,
        color: AppColors.outline,
      ),
      onTap: onTap,
    );
  }

  Widget _buildSwitchTile(
    String title,
    IconData icon,
    bool val,
    Function(bool) onChanged,
  ) {
    return SwitchListTile(
      secondary: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLow,
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: AppColors.primary, size: 20),
      ),
      title: Text(
        title,
        style: AppStyles.bodyLg.copyWith(
          fontWeight: FontWeight.w600,
          color: AppColors.onSurface,
        ),
      ),
      value: val,
      onChanged: onChanged,
      activeThumbColor: AppColors.primaryContainer,
      activeTrackColor: AppColors.primaryContainer.withValues(alpha: 0.3),
    );
  }
}
