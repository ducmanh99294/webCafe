import 'package:flutter/material.dart';
import 'package:mobile/screens/footer.dart';

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  @override
  Widget build(BuildContext context) {
    return Footer(
      child: Scaffold(body: Center(child: Text('Menu'))),
    );
  }
}
