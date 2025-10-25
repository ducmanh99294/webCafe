package com.example.webcafe.controller;

import com.example.webcafe.model.User;
import com.example.webcafe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.webcafe.util.JwtUtil;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil JwtUtil;
    // Lấy tất cả user
    @GetMapping("/admin")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Lấy user theo ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
    }

    // Tạo user mới (đăng ký)
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.createUser(user);
    }

    // Cập nhật user
    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        return userService.updateUser(id, updatedUser);
    }

    // Xóa user
    @DeleteMapping("/admin/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        boolean success = userService.login(user.getEmail(), user.getPassword());
        if (!success) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Sai email hoặc mật khẩu!"));
        }

        User loggedInUser = userService.findByEmail(user.getEmail());
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Người dùng không tồn tại!"));
        }

        // Kiểm tra role null, nếu null gán mặc định
        User.Role roleEnum = loggedInUser.getRole();
        if (roleEnum == null) {
            roleEnum = User.Role.USER; // hoặc role mặc định bạn muốn
        }

        // Tạo token với email và role thật
        String token = JwtUtil.generateToken(loggedInUser.getId(), loggedInUser.getEmail(), roleEnum.name());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "id", loggedInUser.getId(),
                "email", loggedInUser.getEmail(),
                "role", roleEnum.name()
        ));
    }
}
