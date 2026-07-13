class Medicine {
  final String name;
  final String dosage;
  final String frequency;
  final String instructions;
  final String imageAsset;
  final DateTime scannedDate;
  final List<String> sideEffects;
  final List<String> warnings;
  final bool activeAllergiesConflict;
  final List<String> timeList;

  Medicine({
    required this.name,
    required this.dosage,
    required this.frequency,
    required this.instructions,
    required this.imageAsset,
    required this.scannedDate,
    required this.sideEffects,
    required this.warnings,
    required this.activeAllergiesConflict,
    required this.timeList,
  });
}
