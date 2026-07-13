import 'package:flutter/material.dart';
import 'package:medilens_ai/core/theme/theme.dart';
import 'package:medilens_ai/features/onboarding/presentation/splash_screen.dart';

class MediLensApp extends StatelessWidget {
  const MediLensApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MediLens AI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const SplashScreen(),
    );
  }
}
