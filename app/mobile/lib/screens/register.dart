import 'package:flutter/material.dart';
import '../api/auth.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  final nameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final phoneCtrl = TextEditingController();
  final passwordCtrl = TextEditingController();
  final confirmCtrl = TextEditingController();

  bool agree = false;
  bool isLoading = false;

  Future<void> submitRegister() async {
    if (_formKey.currentState!.validate() != true) return;
    if (agree != true) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng đồng ý điều khoản')),
      );
      return;
    }

    setState(() => isLoading = true);

    try {
      await AuthApi.register(
        name: nameCtrl.text.trim(),
        email: emailCtrl.text.trim(),
        phone: phoneCtrl.text.trim(),
        password: passwordCtrl.text,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đăng ký thành công, vui lòng đăng nhập')),
      );

      Navigator.pushReplacementNamed(context, '/login');
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(e.toString())));
    } finally {
      setState(() => isLoading = false);
    }
  }

  InputDecoration inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F1E9),
      body: Center(
        child: SingleChildScrollView(
          child: Container(
            width: 340,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Center(
                    child: Column(
                      children: [
                        Text(
                          'Tạo tài khoản mới',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 6),
                        Text(
                          'Tham gia cùng chúng tôi ngay hôm nay',
                          style: TextStyle(color: Colors.orange),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  const Text('Tên *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: nameCtrl,
                    decoration: inputDecoration('Nhập tên'),
                    validator: (v) => v!.isEmpty ? 'Không được để trống' : null,
                  ),

                  const SizedBox(height: 14),
                  const Text('Email *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: emailCtrl,
                    decoration: inputDecoration('Nhập email'),
                    validator: (v) =>
                        v!.contains('@') ? null : 'Email không hợp lệ',
                  ),

                  const SizedBox(height: 14),
                  const Text('Số điện thoại *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: phoneCtrl,
                    decoration: inputDecoration('Nhập số điện thoại'),
                    validator: (v) =>
                        v!.length < 9 ? 'Số điện thoại không hợp lệ' : null,
                  ),

                  const SizedBox(height: 14),
                  const Text('Mật khẩu *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: passwordCtrl,
                    obscureText: true,
                    decoration: inputDecoration('Nhập mật khẩu'),
                    validator: (v) => v!.length < 6 ? 'Ít nhất 6 ký tự' : null,
                  ),

                  const SizedBox(height: 14),
                  const Text('Xác nhận mật khẩu *'),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: confirmCtrl,
                    obscureText: true,
                    decoration: inputDecoration('Nhập lại mật khẩu'),
                    validator: (v) =>
                        v != passwordCtrl.text ? 'Mật khẩu không khớp' : null,
                  ),

                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Checkbox(
                        value: agree,
                        onChanged: (v) => setState(() => agree = v!),
                      ),
                      const Expanded(
                        child: Text(
                          'Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật',
                          style: TextStyle(fontSize: 13),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: isLoading ? null : submitRegister,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.brown,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: isLoading
                          ? const Text(
                              'Đang đăng ký',
                              style: TextStyle(
                                fontSize: 16,
                                color: Color(0xffffffff),
                              ),
                            )
                          : const Text(
                              'Đăng ký',
                              style: TextStyle(
                                fontSize: 16,
                                color: Color(0xffffffff),
                              ),
                            ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Center(
                    child: GestureDetector(
                      onTap: () =>
                          Navigator.pushReplacementNamed(context, '/login'),
                      child: const Text.rich(
                        TextSpan(
                          text: 'Đã có tài khoản? ',
                          children: [
                            TextSpan(
                              text: 'Đăng nhập ngay',
                              style: TextStyle(color: Colors.orange),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
