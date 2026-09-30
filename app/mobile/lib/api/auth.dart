import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/token.dart';

class AuthApi {
  static const String baseUrl = 'http://localhost:8080/api/users';

  static Future<Token> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return Token.fromJson(data);
    } else {
      throw Exception('Email hoặc mật khẩu không đúng');
    }
  }

  static Future<void> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register'),
      headers: {'Content-type': 'application/json'},
      body: jsonEncode({
        "name": name,
        "email": email,
        "phone": phone,
        "password": password,
      }),
    );

    if(response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('failed');
    }
  }
}
