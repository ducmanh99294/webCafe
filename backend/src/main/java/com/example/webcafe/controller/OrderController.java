package com.example.webcafe.controller;

import com.example.webcafe.dto.OrderRequest;
import com.example.webcafe.model.Order;
import com.example.webcafe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    //Tạo đơn hàng mới từ giỏ hàng
    @PostMapping("/{userId}/confirm")
    public ResponseEntity<?> confirmOrder(
            @PathVariable String userId,
            @RequestBody OrderRequest orderRequest
            )
    {
        try {
            orderRequest.setUserId(userId);

            Order newOrder = orderService.createOrderFromCart(orderRequest);
            return ResponseEntity.ok(newOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi tạo đơn hàng: " + e.getMessage());
        }
    }

    //Lấy tất cả đơn hàng
    @GetMapping("/admin")
    public ResponseEntity<List<Map<String, Object>>> getAllOrders() {
        List<Map<String, Object>> responses = orderService.getAllOrders();
        return ResponseEntity.ok(responses);
    }

    // Lấy đơn hàng theo người dùng
    @GetMapping("/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    // Cập nhật trạng thái đơn hàng
    @PutMapping("/admin/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> body
    ) {
        try {
            Order.Status status = Order.Status.valueOf(body.get("status"));
            Order updated = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi cập nhật trạng thái: " + e.getMessage());
        }
    }

    // Xóa đơn hàng
    @DeleteMapping("/admin/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable String orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok("Đã xóa đơn hàng");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xóa đơn hàng: " + e.getMessage());
        }
    }
}
