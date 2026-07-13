class MedicationReminder {
  final String id;
  final String medicineName;
  final String dosage;
  final String time; // e.g. "08:00 AM"
  bool isTaken;
  final DateTime date;

  MedicationReminder({
    required this.id,
    required this.medicineName,
    required this.dosage,
    required this.time,
    this.isTaken = false,
    required this.date,
  });
}
