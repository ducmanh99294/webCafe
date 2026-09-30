import 'package:flutter/material.dart';
import './footer.dart';

class NewsScreen extends StatelessWidget {
  const NewsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Footer(
      child: Scaffold(
        backgroundColor: const Color(0xFFF6F1EA),
        body: SingleChildScrollView(
          child: Column(
            children: [
              _buildHeader(),
              const SizedBox(height: 24),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 80),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(flex: 7, child: _buildMainContent()),
                    const SizedBox(width: 24),
                    Expanded(flex: 3, child: _buildSidebar()),
                  ],
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

//header
Widget _buildHeader() {
  return Padding(
    padding: const EdgeInsets.only(top: 32),
    child: Column(
      children: const [
        Text(
          'Tin Tức & Sự Kiện',
          style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 8),
        Text(
          'Cập nhật những tin tức mới nhất và sự kiện đặc biệt tại Café Mộc',
          style: TextStyle(color: Colors.grey),
        ),
      ],
    ),
  );
}

//main
Widget _buildMainContent() {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Text(
        'Tin Mới Cập Nhật',
        style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
      ),
      const SizedBox(height: 16),
      Wrap(
        spacing: 16,
        runSpacing: 16,
        children: List.generate(6, (index) => _NewsCard()),
      ),
      const SizedBox(height: 24),
      Center(
        child: OutlinedButton(
          onPressed: () {},
          child: const Text('Xem Thêm Tin Tức'),
        ),
      ),
    ],
  );
}

//card
class _NewsCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 280,
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 160,
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(12),
                ),
                image: const DecorationImage(
                  image: NetworkImage('https://picsum.photos/400/300'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Workshop Pha Chế Cà Phê Nghệ Thuật',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Tham gia workshop pha chế cà phê cùng barista chuyên nghiệp.',
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 8),
                  Text('Đọc tiếp →', style: TextStyle(color: Colors.orange)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// slidebar
Widget _buildSidebar() {
  return Column(
    children: [
      _SidebarBox(
        title: 'Danh Mục',
        children: const [
          _SidebarItem('Tất cả'),
          _SidebarItem('Sự kiện'),
          _SidebarItem('Tin tức'),
          _SidebarItem('Khuyến mãi'),
          _SidebarItem('Workshop'),
        ],
      ),
      const SizedBox(height: 24),
      _SidebarBox(
        title: 'Tin Gần Đây',
        children: const [
          _SidebarItem('Workshop Pha Chế Tháng 12'),
          _SidebarItem('Giới thiệu dòng cà phê mới'),
          _SidebarItem('Đêm nhạc Acoustic'),
        ],
      ),
    ],
  );
}

class _SidebarBox extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _SidebarBox({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }
}

class _SidebarItem extends StatelessWidget {
  final String text;
  const _SidebarItem(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Text(text),
    );
  }
}
