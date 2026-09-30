import 'package:flutter/material.dart';
import 'package:mobile/screens/footer.dart';

class AccountScreen extends StatefulWidget {
  const AccountScreen({super.key});

  @override
  State<AccountScreen> createState() => _AccountScreenState();
}

class _AccountScreenState extends State<AccountScreen> {
  @override
  Widget build(BuildContext context) {
    return Footer(
      child: Scaffold(body: Center(child: Text('account'))),
    );
  }
}
