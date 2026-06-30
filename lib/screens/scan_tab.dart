import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/colors.dart';
import '../theme/styles.dart';
import '../providers/app_state.provider.dart';
import 'medicine_details_screen.dart';

class ScanTab extends StatefulWidget {
  const ScanTab({super.key});

  @override
  State<ScanTab> createState() => _ScanTabState();
}

class _ScanTabState extends State<ScanTab> with SingleTickerProviderStateMixin {
  late AnimationController _scannerAnimationController;
  late Animation<double> _scannerPositionAnimation;

  @override
  void initState() {
    super.initState();
    _scannerAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _scannerPositionAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _scannerAnimationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _scannerAnimationController.dispose();
    super.dispose();
  }

  void _triggerScanSimulation(BuildContext context) async {
    final state = Provider.of<AppStateProvider>(context, listen: false);

    // Show scanning progress modal
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(AppStyles.radiusXl)),
          backgroundColor: AppColors.surfaceContainerLowest,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(
                  width: 56,
                  height: 56,
                  child: CircularProgressIndicator(
                    strokeWidth: 3.5,
                    valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  "Analyzing Label...",
                  style: AppStyles.titleMd.copyWith(fontWeight: FontWeight.w700, color: AppColors.onSurface),
                ),
                const SizedBox(height: 8),
                Text(
                  "OCR engine is digitizing text & checking profile allergies...",
                  style: AppStyles.bodyMd.copyWith(color: AppColors.onSurfaceVariant),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        );
      },
    );

    // Run scanning logic
    final scannedMed = await state.simulateScanningProcess();

    // Close progress modal
    if (context.mounted) {
      Navigator.pop(context); // Close dialog

      // Push to details screen
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => MedicineDetailsScreen(medicine: scannedMed),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Simulated camera frame image background (onboarding scan image serves as a nice mock)
          Positioned.fill(
            child: Opacity(
              opacity: 0.45,
              child: Image.asset(
                "assets/images/onboarding_scan.png",
                fit: BoxFit.cover,
              ),
            ),
          ),

          // Main scanner camera mask / viewport overlay
          Positioned.fill(
            child: Column(
              children: [
                const SizedBox(height: 60),
                // Header details
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppStyles.paddingContainer),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Medicine Scanner",
                        style: AppStyles.titleMd.copyWith(
                          fontSize: 22,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.flash_off_rounded, color: Colors.white),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),
                const Spacer(),

                // Viewfinder container
                Container(
                  width: size.width * 0.75,
                  height: size.width * 0.75,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.white38, width: 1.5),
                    borderRadius: BorderRadius.circular(AppStyles.radiusXl),
                  ),
                  child: Stack(
                    children: [
                      // Viewfinder corner brackets (visual enhancement)
                      _buildCornerBracket(top: 10, left: 10, isTop: true, isLeft: true),
                      _buildCornerBracket(top: 10, right: 10, isTop: true, isLeft: false),
                      _buildCornerBracket(bottom: 10, left: 10, isTop: false, isLeft: true),
                      _buildCornerBracket(bottom: 10, right: 10, isTop: false, isLeft: false),

                      // Moving active laser scanner line
                      AnimatedBuilder(
                        animation: _scannerPositionAnimation,
                        builder: (context, child) {
                          final topOffset =
                              _scannerPositionAnimation.value * (size.width * 0.75 - 20) + 10;
                          return Positioned(
                            top: topOffset,
                            left: 10,
                            right: 10,
                            child: child!,
                          );
                        },
                        child: Container(
                          height: 3,
                          decoration: BoxDecoration(
                            color: AppColors.primaryContainer,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.primaryContainer.withOpacity(0.8),
                                blurRadius: 8,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  "Align medicine label within the frame",
                  style: AppStyles.bodyMd.copyWith(color: Colors.white70),
                ),
                const Spacer(),

                // Actions area
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppStyles.paddingContainer,
                    vertical: 32,
                  ),
                  decoration: const BoxDecoration(
                    color: Color(0xFF1E293B),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(AppStyles.radiusXl)),
                  ),
                  child: Column(
                    children: [
                      // Document upload card option
                      InkWell(
                        onTap: () => _triggerScanSimulation(context),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                          decoration: BoxDecoration(
                            color: Colors.white12,
                            borderRadius: BorderRadius.circular(AppStyles.radiusDefault),
                            border: Border.all(color: Colors.white24),
                          ),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.description_rounded, color: Colors.white70),
                              SizedBox(width: 12),
                              Text(
                                "Upload Prescription PDF / Image",
                                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Trigger Action button
                      GestureDetector(
                        onTap: () => _triggerScanSimulation(context),
                        child: Container(
                          width: 72,
                          height: 72,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 4),
                          ),
                          child: Container(
                            margin: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: AppColors.primaryContainer,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.camera_alt_rounded,
                              color: AppColors.onPrimaryContainer,
                              size: 28,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Spacing for floating bottom nav shell
                const SizedBox(height: 88),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCornerBracket({
    double? top,
    double? bottom,
    double? left,
    double? right,
    required bool isTop,
    required bool isLeft,
  }) {
    const bracketSize = 20.0;
    const thickness = 4.0;
    const color = AppColors.primaryContainer;

    return Positioned(
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      child: SizedBox(
        width: bracketSize,
        height: bracketSize,
        child: Stack(
          children: [
            Positioned(
              top: isTop ? 0 : null,
              bottom: !isTop ? 0 : null,
              left: 0,
              right: 0,
              child: Container(height: thickness, color: color),
            ),
            Positioned(
              top: 0,
              bottom: 0,
              left: isLeft ? 0 : null,
              right: !isLeft ? 0 : null,
              child: Container(width: thickness, color: color),
            ),
          ],
        ),
      ),
    );
  }
}
