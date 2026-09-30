import 'package:shared_preferences/shared_preferences.dart';

class StorageHelper {
  static Future<void> saveToken(String token) async {
    final pre = await SharedPreferences.getInstance();
    await pre.setString('token', token);
  }

  static Future<String?> getToken() async {
    final pre = await SharedPreferences.getInstance();
    return pre.getString('token');
  }
}
