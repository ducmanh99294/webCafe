package com.example.webcafe.service;

import com.example.webcafe.model.Employee;
import com.example.webcafe.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Lấy danh sách nhân viên
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Lấy theo ID
    public Optional<Employee> getEmployeeById(String id) {
        return employeeRepository.findById(id);
    }

    // Thêm mới nhân viên
    public Employee createEmployee(Employee employee) {
        employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());
        return employeeRepository.save(employee);
    }

    // Cập nhật nhân viên
    public Employee updateEmployee(String id, Employee updated) {
        return employeeRepository.findById(id)
                .map(employee -> {
                    employee.setName(updated.getName());
                    employee.setPhone(updated.getPhone());
                    employee.setEmail(updated.getEmail());
                    employee.setUsername(updated.getUsername());
                    employee.setRole(updated.getRole());
                    employee.setStatus(updated.getStatus());

                    if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
                        employee.setPassword(passwordEncoder.encode(updated.getPassword()));
                    }

                    employee.setUpdatedAt(LocalDateTime.now());
                    return employeeRepository.save(employee);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với id: " + id));
    }

    // Xóa nhân viên
    public void deleteEmployee(String id) {
        employeeRepository.deleteById(id);
    }

    // Tìm theo username (dùng cho đăng nhập)
    public Optional<Employee> findByUsername(String username) {
        return employeeRepository.findByUsername(username);
    }
}
