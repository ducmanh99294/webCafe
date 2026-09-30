import 'package:mobile/models/user.dart';

class Token {
  final String token;
  final User user;

  Token({
    required this.token,
    required this.user,
  });

  factory Token.fromJson(Map<String, dynamic> json) {
    return Token(
      token: json['token'],
      user: User.fromJson(json),
    );
  }
}
