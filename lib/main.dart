import 'package:flutter/material.dart';
import 'package:medilens_ai/app/medilens_app.dart';
import 'package:medilens_ai/app/state/app_state_provider.dart';
import 'package:provider/provider.dart';

export 'package:medilens_ai/app/medilens_app.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => AppStateProvider(),
      child: const MediLensApp(),
    ),
  );
}
