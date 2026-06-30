import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Use localhost since we are running on a local development environment.
  static const String baseUrl = 'http://localhost:8000/api';

  static Map<String, String> get _headers => {
        'Content-Type': 'application/json',
      };

  // Fetch User Profile
  static Future<Map<String, dynamic>> fetchUser() async {
    final response = await http.get(Uri.parse('$baseUrl/user'), headers: _headers);
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load user profile: ${response.statusCode}');
    }
  }

  // Fetch all medications
  static Future<List<dynamic>> fetchMedicines() async {
    final response = await http.get(Uri.parse('$baseUrl/medicines'), headers: _headers);
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load medicines: ${response.statusCode}');
    }
  }

  // Add a medication
  static Future<Map<String, dynamic>> addMedicine(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/medicines'),
      headers: _headers,
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to add medicine: ${response.statusCode}');
    }
  }

  // Fetch all reminders
  static Future<List<dynamic>> fetchReminders() async {
    final response = await http.get(Uri.parse('$baseUrl/reminders'), headers: _headers);
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load reminders: ${response.statusCode}');
    }
  }

  // Add a reminder
  static Future<Map<String, dynamic>> addReminder(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/reminders'),
      headers: _headers,
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to add reminder: ${response.statusCode}');
    }
  }

  // Toggle reminder taken status
  static Future<Map<String, dynamic>> toggleReminder(String reminderId) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/reminders/$reminderId/toggle'),
      headers: _headers,
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to toggle reminder: ${response.statusCode}');
    }
  }

  // Fetch Chat History
  static Future<List<dynamic>> fetchChatHistory() async {
    final response = await http.get(Uri.parse('$baseUrl/chat'), headers: _headers);
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load chat history: ${response.statusCode}');
    }
  }

  // Send a chat message and receive AI response
  static Future<Map<String, dynamic>> sendChatMessage(String text) async {
    final response = await http.post(
      Uri.parse('$baseUrl/chat'),
      headers: _headers,
      body: json.encode({'text': text}),
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to send message: ${response.statusCode}');
    }
  }
}
