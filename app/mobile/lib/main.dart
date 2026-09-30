import 'package:flutter/material.dart';
import 'package:mobile/screens/home.dart';
import 'screens/login.dart';
import 'screens/register.dart';
import 'screens/news.dart';
import 'screens/menu.dart';
import 'screens/search.dart';
import 'screens/account.dart';
import 'dart:async';

void main() {
  FlutterError.onError = (FlutterErrorDetails details) {
    debugPrint(details.exceptionAsString());
    debugPrint(details.stack.toString());
  };

  runZonedGuarded(
    () {
      runApp(const MyApp());
    },
    (error, stack) {
      debugPrint('🔥 ZONE ERROR 🔥');
      debugPrint(error.toString());
      debugPrint(stack.toString());
    },
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/login',
      routes: {
        '/login': (_) => const LoginScreen(),
        '/register': (_) => const RegisterScreen(),
        '/home': (_) => const HomeScreen(),
        '/news': (_) => const NewsScreen(),
        '/menu': (_) => const MenuScreen(),
        '/search': (_) => const SearchScreen(),
        '/account': (_) => const AccountScreen(),
      },
    );
  }
}
