import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:medilens_ai/core/theme/colors.dart';

class AppStyles {
  // Border Radius
  static const double radiusSm = 4.0;
  static const double radiusDefault = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 24.0;
  static const double radiusXxl = 32.0;

  // Spacing
  static const double spaceXs = 4.0;
  static const double spaceBase = 8.0;
  static const double spaceSm = 12.0;
  static const double spaceMd = 16.0;
  static const double spaceLg = 24.0;
  static const double spaceXl = 32.0;
  static const double paddingContainer = 20.0;
  static const double gutter = 16.0;

  // Typography (Inter)
  static TextStyle displayLg = GoogleFonts.inter(
    fontSize: 48,
    fontWeight: FontWeight.w700,
    height: 56 / 48,
    letterSpacing: -0.02 * 48,
  );

  static TextStyle headlineLg = GoogleFonts.inter(
    fontSize: 32,
    fontWeight: FontWeight.w600,
    height: 40 / 32,
    letterSpacing: -0.01 * 32,
  );

  static TextStyle headlineLgMobile = GoogleFonts.inter(
    fontSize: 28,
    fontWeight: FontWeight.w600,
    height: 36 / 28,
  );

  static TextStyle titleMd = GoogleFonts.inter(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 28 / 20,
  );

  static TextStyle bodyLg = GoogleFonts.inter(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 24 / 16,
  );

  static TextStyle bodyMd = GoogleFonts.inter(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 20 / 14,
  );

  static TextStyle labelSm = GoogleFonts.inter(
    fontSize: 12,
    fontWeight: FontWeight.w500,
    height: 16 / 12,
    letterSpacing: 0.05 * 12,
  );

  // Elevation and Shadows
  static List<BoxShadow> level1Shadow = [
    BoxShadow(
      color: const Color(0xFF0F172A).withValues(alpha: 0.05),
      blurRadius: 2,
      offset: const Offset(0, 1),
    ),
  ];

  static List<BoxShadow> level2Shadow = [
    BoxShadow(
      color: const Color(0xFF006C49).withValues(alpha: 0.04),
      blurRadius: 16,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> level3Shadow = [
    BoxShadow(
      color: AppColors.primary.withValues(alpha: 0.12),
      blurRadius: 30,
      offset: const Offset(0, 8),
    ),
  ];

  // Glassmorphic Container Decoration
  static BoxDecoration glassDecoration({
    double radius = radiusXl,
    Color borderColor = Colors.white24,
    Color color = const Color(0xB3FFFFFF),
  }) {
    return BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(color: borderColor, width: 1.0),
    );
  }

  // Backdrop filter for blur effect
  static Widget glassBlur({
    required Widget child,
    double blur = 20.0,
    double radius = radiusXl,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        child: child,
      ),
    );
  }
}
