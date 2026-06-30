import 'package:flutter/material.dart';
import '../theme/colors.dart';
import '../theme/styles.dart';
import 'login_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<OnboardingPageData> _pages = [
    OnboardingPageData(
      title: "Scan Medicine",
      description: "Point your camera at any medicine label to scan and verify its details immediately.",
      imageAsset: "assets/images/onboarding_scan.png",
      glowColor: AppColors.primaryContainer,
    ),
    OnboardingPageData(
      title: "Digitize Prescriptions",
      description: "Convert handwritten prescriptions into organized medication schedules.",
      imageAsset: "assets/images/onboarding_prescription.png",
      glowColor: AppColors.secondaryContainer,
    ),
    OnboardingPageData(
      title: "AI Pharmacist",
      description: "Ask questions about medicines and receive easy-to-understand information.",
      imageAsset: "assets/images/onboarding_ai_assistant.png",
      glowColor: AppColors.primaryContainer,
    ),
  ];

  void _onPageChanged(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  void _onNext() {
    if (_currentIndex < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    } else {
      _navigateToLogin();
    }
  }

  void _navigateToLogin() {
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => const LoginScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0, 1),
              end: Offset.zero,
            ).animate(CurvedAnimation(parent: animation, curve: Curves.easeInOut)),
            child: child,
          );
        },
        transitionDuration: const Duration(milliseconds: 500),
      ),
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Stack(
          children: [
            // Top Skip Button (hidden on last page)
            if (_currentIndex < _pages.length - 1)
              Positioned(
                top: 8,
                right: AppStyles.paddingContainer,
                child: TextButton(
                  onPressed: _navigateToLogin,
                  child: Text(
                    "Skip",
                    style: AppStyles.labelSm.copyWith(
                      color: AppColors.onSurfaceVariant,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),

            // Page View
            Column(
              children: [
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: _onPageChanged,
                    itemCount: _pages.length,
                    itemBuilder: (context, index) {
                      final page = _pages[index];
                      return OnboardingPageContent(page: page);
                    },
                  ),
                ),

                // Bottom Content Sheet
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppStyles.paddingContainer,
                    vertical: AppStyles.spaceLg,
                  ),
                  decoration: const BoxDecoration(
                    color: AppColors.surfaceContainerLowest,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(AppStyles.radiusXxl)),
                    boxShadow: [
                      BoxShadow(
                        color: Color(0x0A000000),
                        blurRadius: 30,
                        offset: Offset(0, -8),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Drag handle visual helper
                      Container(
                        width: 48,
                        height: 5,
                        margin: const EdgeInsets.only(bottom: 24),
                        decoration: BoxDecoration(
                          color: AppColors.outlineVariant.withOpacity(0.4),
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),

                      // Title
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 300),
                        child: Text(
                          _pages[_currentIndex].title,
                          key: ValueKey<int>(_currentIndex),
                          style: AppStyles.headlineLgMobile.copyWith(
                            color: AppColors.onSurface,
                            fontWeight: FontWeight.w700,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Description text
                      SizedBox(
                        height: 56, // Fixed height to avoid jumps
                        child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 300),
                          child: Text(
                            _pages[_currentIndex].description,
                            key: ValueKey<int>(_currentIndex),
                            style: AppStyles.bodyLg.copyWith(
                              color: AppColors.onSurfaceVariant,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),

                      // Dots Indicator
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: List.generate(_pages.length, (index) {
                          final isSelected = _currentIndex == index;
                          return AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            height: 8,
                            width: isSelected ? 32 : 8,
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.primaryContainer : AppColors.surfaceVariant,
                              borderRadius: BorderRadius.circular(4),
                              boxShadow: isSelected
                                  ? [
                                      BoxShadow(
                                        color: AppColors.primaryContainer.withOpacity(0.3),
                                        blurRadius: 4,
                                        offset: const Offset(0, 2),
                                      ),
                                    ]
                                  : null,
                            ),
                          );
                        }),
                      ),
                      const SizedBox(height: 32),

                      // Action Button
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          onPressed: _onNext,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryContainer,
                            foregroundColor: AppColors.onPrimaryContainer,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(AppStyles.radiusDefault),
                            ),
                          ),
                          child: Text(
                            _currentIndex == _pages.length - 1 ? "Get Started" : "Next",
                            style: AppStyles.titleMd.copyWith(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),

                      // Skip button (visible on the last page for alignment, but takes them straight in)
                      if (_currentIndex == _pages.length - 1)
                        TextButton(
                          onPressed: _navigateToLogin,
                          child: Text(
                            "Skip",
                            style: AppStyles.titleMd.copyWith(
                              color: AppColors.primaryContainer,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        )
                      else
                        const SizedBox(height: 48), // Padding placeholder
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class OnboardingPageData {
  final String title;
  final String description;
  final String imageAsset;
  final Color glowColor;

  OnboardingPageData({
    required this.title,
    required this.description,
    required this.imageAsset,
    required this.glowColor,
  });
}

class OnboardingPageContent extends StatelessWidget {
  final OnboardingPageData page;

  const OnboardingPageContent({super.key, required this.page});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppStyles.spaceLg),
      child: Center(
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Background blur glow decoration
            Container(
              width: 220,
              height: 220,
              decoration: BoxDecoration(
                color: page.glowColor.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
            ),
            // Glassmorphic Image Frame
            Container(
              width: 260,
              height: 260,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.6),
                borderRadius: BorderRadius.circular(AppStyles.radiusXxl),
                border: Border.all(color: Colors.white.withOpacity(0.4), width: 1),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.03),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(AppStyles.radiusMd),
                child: Image.asset(
                  page.imageAsset,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      color: AppColors.surfaceContainerLow,
                      child: const Icon(
                        Icons.image_not_supported_rounded,
                        color: AppColors.outline,
                        size: 48,
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
