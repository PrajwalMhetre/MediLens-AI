import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/app_state.provider.dart';
import 'theme/theme.dart';
import 'screens/splash_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => AppStateProvider(),
      child: const MediLensApp(),
    ),
  );
}

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
