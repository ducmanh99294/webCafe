import 'package:flutter/material.dart';
import 'package:mobile/screens/footer.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  @override
  Widget build(BuildContext context) {
    return Footer(
      child: Scaffold(body: Center(child: Text('Search'))),
    );
  }
}
