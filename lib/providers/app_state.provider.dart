import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/medicine.dart';
import '../models/reminder.dart';
import '../models/chat_message.dart';
import '../services/api_service.dart';

class AppStateProvider with ChangeNotifier {
  // User Profile (Fallback mock data)
  String _userName = "Alex Rivera";
  String _userEmail = "alex.rivera@medilens.com";
  String _userAvatar = "assets/images/home_dashboard.png";
  String _bloodType = "O+ Positive";
  String _weight = "72 kg";
  List<String> _allergies = ["Penicillin", "Sulfa drugs"];

  String get userName => _userName;
  String get userEmail => _userEmail;
  String get userAvatar => _userAvatar;
  String get bloodType => _bloodType;
  String get weight => _weight;
  List<String> get allergies => _allergies;

  // Active Medicines
  final List<Medicine> _medicines = [];
  List<Medicine> get medicines => _medicines;

  // Medication Reminders
  final List<MedicationReminder> _reminders = [];
  List<MedicationReminder> get reminders => _reminders;

  // Chat Messages
  final List<ChatMessage> _chatMessages = [];
  List<ChatMessage> get chatMessages => _chatMessages;

  // Scan simulation state
  bool _isScanning = false;
  bool get isScanning => _isScanning;

  // Typing response state
  bool _isTypingResponse = false;
  bool get isTypingResponse => _isTypingResponse;

  AppStateProvider() {
    // 1. Load mock fallback data first to ensure instant loading
    _loadFallbackData();
    // 2. Try loading from backend API
    loadDataFromBackend();
  }

  void _loadFallbackData() {
    _medicines.clear();
    _reminders.clear();
    _chatMessages.clear();

    final paracetamol = Medicine(
      name: "Paracetamol",
      dosage: "500 mg",
      frequency: "Twice daily",
      instructions: "Take after meals with warm water.",
      imageAsset: "assets/images/medicine_details.png",
      scannedDate: DateTime.now().subtract(const Duration(days: 2)),
      sideEffects: [
        "Nausea or stomach discomfort",
        "Allergic skin rash (rare)",
        "Drowsiness if combined with certain medications",
      ],
      warnings: [
        "Do not exceed 4,000 mg (8 tablets of 500 mg) in 24 hours.",
        "Avoid alcohol consumption while taking this medication as it increases the risk of liver toxicity.",
        "Consult doctor if fever persists for more than 3 days.",
      ],
      activeAllergiesConflict: false,
      timeList: ["08:00 AM", "08:00 PM"],
    );
    _medicines.add(paracetamol);

    final now = DateTime.now();
    _reminders.add(MedicationReminder(
      id: "rem_1",
      medicineName: "Paracetamol",
      dosage: "500 mg",
      time: "08:00 AM",
      isTaken: true,
      date: now,
    ));
    _reminders.add(MedicationReminder(
      id: "rem_2",
      medicineName: "Paracetamol",
      dosage: "500 mg",
      time: "08:00 PM",
      isTaken: false,
      date: now,
    ));

    _chatMessages.add(ChatMessage(
      text: "Hello Alex! I am your MediLens AI Pharmacist. Ask me any question about your medications, side effects, or schedule guidelines.",
      isUser: false,
      timestamp: DateTime.now().subtract(const Duration(minutes: 10)),
    ));
  }

  // Load from Backend REST API
  Future<void> loadDataFromBackend() async {
    try {
      // 1. Fetch User
      final u = await ApiService.fetchUser();
      _userName = u['name'] ?? _userName;
      _userEmail = u['email'] ?? _userEmail;
      _bloodType = u['blood_type'] ?? _bloodType;
      _weight = u['weight'] ?? _weight;
      if (u['allergies'] != null) {
        _allergies = List<String>.from(u['allergies']);
      }

      // 2. Fetch Medications
      final medsData = await ApiService.fetchMedicines();
      if (medsData.isNotEmpty) {
        _medicines.clear();
        for (var item in medsData) {
          _medicines.add(Medicine(
            name: item['name'],
            dosage: item['dosage'],
            frequency: item['frequency'],
            instructions: item['instructions'],
            imageAsset: item['image_asset'],
            scannedDate: DateTime.parse(item['scanned_date']),
            sideEffects: List<String>.from(item['side_effects'] ?? []),
            warnings: List<String>.from(item['warnings'] ?? []),
            activeAllergiesConflict: item['active_allergies_conflict'] ?? false,
            timeList: List<String>.from(item['time_list'] ?? []),
          ));
        }
      }

      // 3. Fetch Reminders
      final remsData = await ApiService.fetchReminders();
      if (remsData.isNotEmpty) {
        _reminders.clear();
        for (var item in remsData) {
          _reminders.add(MedicationReminder(
            id: item['id'],
            medicineName: item['medicine_name'],
            dosage: item['dosage'],
            time: item['time'],
            isTaken: item['is_taken'] ?? false,
            date: DateTime.parse(item['date']),
          ));
        }
      }

      // 4. Fetch Chat
      final chatData = await ApiService.fetchChatHistory();
      if (chatData.isNotEmpty) {
        _chatMessages.clear();
        for (var item in chatData) {
          _chatMessages.add(ChatMessage(
            text: item['text'],
            isUser: item['is_user'] ?? false,
            timestamp: DateTime.parse(item['timestamp']),
          ));
        }
      }
      notifyListeners();
      debugPrint("AppStateProvider successfully synchronized with the backend REST API.");
    } catch (e) {
      debugPrint("Backend connection failed: $e. Falling back to local offline mock data.");
    }
  }

  // Adherence calculation
  double get todayAdherenceProgress {
    if (_reminders.isEmpty) return 1.0;
    final takenCount = _reminders.where((r) => r.isTaken).length;
    return takenCount / _reminders.length;
  }

  // Toggle reminder taken status
  void toggleReminderTaken(String id) async {
    final index = _reminders.indexWhere((r) => r.id == id);
    if (index != -1) {
      // Toggle locally first for instant feedback
      _reminders[index].isTaken = !_reminders[index].isTaken;
      notifyListeners();

      // Sync with backend in background
      try {
        await ApiService.toggleReminder(id);
      } catch (e) {
        debugPrint("API Error toggling reminder: $e");
      }
    }
  }

  // Add a new reminder
  void addReminder(String name, String dosage, String time) async {
    final newId = "rem_${DateTime.now().millisecondsSinceEpoch}";
    final newReminder = MedicationReminder(
      id: newId,
      medicineName: name,
      dosage: dosage,
      time: time,
      isTaken: false,
      date: DateTime.now(),
    );

    // 1. Add locally
    _reminders.add(newReminder);

    final isConflict = name.toLowerCase().contains("penicillin") || name.toLowerCase().contains("amoxicillin");
    final newMed = Medicine(
      name: name,
      dosage: dosage,
      frequency: "Once daily",
      instructions: "Take as prescribed.",
      imageAsset: "assets/images/medicine_details.png",
      scannedDate: DateTime.now(),
      sideEffects: const ["Mild headache", "Dizziness"],
      warnings: const ["Consult doctor before exceeding dosage."],
      activeAllergiesConflict: isConflict,
      timeList: [time],
    );

    final hasMedicine = _medicines.any((m) => m.name.toLowerCase() == name.toLowerCase());
    if (!hasMedicine) {
      _medicines.add(newMed);
    }
    notifyListeners();

    // 2. Sync to backend
    try {
      await ApiService.addReminder({
        'id': newId,
        'medicine_name': name,
        'dosage': dosage,
        'time': time,
        'is_taken': false,
      });

      if (!hasMedicine) {
        await ApiService.addMedicine({
          'name': name,
          'dosage': dosage,
          'frequency': "Once daily",
          'instructions': "Take as prescribed.",
          'image_asset': "assets/images/medicine_details.png",
          'side_effects': ["Mild headache", "Dizziness"],
          'warnings': ["Consult doctor before exceeding dosage."],
          'active_allergies_conflict': isConflict,
          'time_list': [time],
        });
      }
    } catch (e) {
      debugPrint("API Error adding reminder: $e");
    }
  }

  // Send message
  void sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    // 1. Append locally
    _chatMessages.add(ChatMessage(
      text: text,
      isUser: true,
      timestamp: DateTime.now(),
    ));
    notifyListeners();

    _isTypingResponse = true;
    notifyListeners();

    // 2. Send to backend & get response
    try {
      final res = await ApiService.sendChatMessage(text);
      _isTypingResponse = false;
      
      final aiMsgData = res['ai_message'];
      _chatMessages.add(ChatMessage(
        text: aiMsgData['text'],
        isUser: aiMsgData['is_user'] ?? false,
        timestamp: DateTime.parse(aiMsgData['timestamp']),
      ));
      notifyListeners();
    } catch (e) {
      debugPrint("API Chat error: $e. Falling back to simulated response.");
      // Fallback local chatbot simulator
      Timer(const Duration(seconds: 1500), () {
        _isTypingResponse = false;
        String responseText = "";

        final query = text.toLowerCase();
        if (query.contains("paracetamol")) {
          responseText = "Paracetamol (500 mg) is safe for general pain and fever. Avoid taking other cold/flu medications containing paracetamol at the same time.";
        } else if (query.contains("penicillin") || query.contains("allergy")) {
          responseText = "I see Penicillin listed in your profile allergies. You must avoid Penicillin, Amoxicillin, and other beta-lactam antibiotics.";
        } else {
          responseText = "I've analyzed your query. To ensure absolute safety, verify the label. Based on your profile, I don't see any immediate conflicts.";
        }

        _chatMessages.add(ChatMessage(
          text: responseText,
          isUser: false,
          timestamp: DateTime.now(),
        ));
        notifyListeners();
      });
    }
  }

  // Simulate camera scan
  Future<Medicine> simulateScanningProcess() async {
    _isScanning = true;
    notifyListeners();

    await Future.delayed(const Duration(seconds: 3));

    final amoxicillin = Medicine(
      name: "Amoxicillin",
      dosage: "250 mg",
      frequency: "Three times daily",
      instructions: "Take with food to prevent stomach upset. Finish the full course.",
      imageAsset: "assets/images/medicine_details.png",
      scannedDate: DateTime.now(),
      sideEffects: const [
        "Nausea, vomiting, diarrhea",
        "Mild skin rash",
        "Abdominal discomfort",
      ],
      warnings: const [
        "ALLERGY WARNING: You are allergic to Penicillin. Amoxicillin is a penicillin derivative and may cause a severe reaction.",
        "Take at evenly spaced intervals.",
        "Store in a cool, dry place.",
      ],
      activeAllergiesConflict: true,
      timeList: const ["08:00 AM", "02:00 PM", "08:00 PM"],
    );

    // 1. Add locally
    final alreadyAdded = _medicines.any((m) => m.name.toLowerCase() == "amoxicillin");
    if (!alreadyAdded) {
      _medicines.add(amoxicillin);
      _reminders.add(MedicationReminder(
        id: "rem_amox_1",
        medicineName: "Amoxicillin",
        dosage: "250 mg",
        time: "08:00 AM",
        isTaken: false,
        date: DateTime.now(),
      ));
      _reminders.add(MedicationReminder(
        id: "rem_amox_2",
        medicineName: "Amoxicillin",
        dosage: "250 mg",
        time: "02:00 PM",
        isTaken: false,
        date: DateTime.now(),
      ));
      _reminders.add(MedicationReminder(
        id: "rem_amox_3",
        medicineName: "Amoxicillin",
        dosage: "250 mg",
        time: "08:00 PM",
        isTaken: false,
        date: DateTime.now(),
      ));
    }
    _isScanning = false;
    notifyListeners();

    // 2. Sync to backend REST API
    try {
      if (!alreadyAdded) {
        await ApiService.addMedicine({
          'name': "Amoxicillin",
          'dosage': "250 mg",
          'frequency': "Three times daily",
          'instructions': "Take with food to prevent stomach upset. Finish the full course.",
          'image_asset': "assets/images/medicine_details.png",
          'side_effects': ["Nausea, vomiting, diarrhea", "Mild skin rash", "Abdominal discomfort"],
          'warnings': ["ALLERGY WARNING: You are allergic to Penicillin. Amoxicillin is a penicillin derivative.", "Take at evenly spaced intervals."],
          'active_allergies_conflict': true,
          'time_list': ["08:00 AM", "02:00 PM", "08:00 PM"],
        });

        await ApiService.addReminder({
          'id': "rem_amox_1",
          'medicine_name': "Amoxicillin",
          'dosage': "250 mg",
          'time': "08:00 AM",
          'is_taken': false,
        });
        await ApiService.addReminder({
          'id': "rem_amox_2",
          'medicine_name': "Amoxicillin",
          'dosage': "250 mg",
          'time': "02:00 PM",
          'is_taken': false,
        });
        await ApiService.addReminder({
          'id': "rem_amox_3",
          'medicine_name': "Amoxicillin",
          'dosage': "250 mg",
          'time': "08:00 PM",
          'is_taken': false,
        });
      }
    } catch (e) {
      debugPrint("API Error syncing scanned medicine: $e");
    }

    return amoxicillin;
  }

  void updateWeight(String newWeight) {
    _weight = newWeight;
    notifyListeners();
  }
}
