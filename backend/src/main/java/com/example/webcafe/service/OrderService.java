package com.example.webcafe.service;

import com.example.webcafe.dto.OrderRequest;
import com.example.webcafe.model.*;
import com.example.webcafe.repository.CartRepository;
import com.example.webcafe.repository.OrderRepository;
import com.example.webcafe.repository.TableRepository;
import com.example.webcafe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private UserRepository userRepository;

    // Tạo order mới từ cart
    public Order createOrderFromCart(OrderRequest orderRequest) {
        String userId = orderRequest.getUserId();
        String tableId = orderRequest.getTableId();
        Order.PaymentMethod paymentMethod = Order.PaymentMethod.valueOf(orderRequest.getPaymentMethod());

        // Chuyển Cart.Item -> Order.Item
        List<Order.Item> orderItems = orderRequest.getItems().stream()
                .map(item -> new Order.Item(
                        item.getProductId(),
                        item.getName(),
                        item.getPrice(),
                        item.getQuantity(),
                        item.getImage()
                ))
                .toList();

        double totalPrice = orderItems.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        // Tạo Order mới
        Order order = new Order();
        order.setUserId(userId);
        order.setTableId(tableId);
        order.setPaymentMethod(paymentMethod);
        order.setStatus(Order.Status.pending);
        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        // Cập nhật bàn nếu tồn tại
        if (tableId != null && !tableId.isEmpty()) {
            Table table = tableRepository.findById(tableId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn"));
            table.setStatus(Table.Status.unavailable);
            tableRepository.save(table);
        }

        // Xoá cart sau khi đặt hàng
        cartRepository.findByUserId(userId).ifPresent(cartRepository::delete);

        // Lưu order
        return orderRepository.save(order);
    }

    // Lấy tất cả đơn hàng
    public List<Map<String, Object>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<Map<String, Object>> list = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("userId", order.getUserId());
            map.put("tableId", order.getTableId());
            map.put("paymentMethod", order.getPaymentMethod());
            map.put("totalPrice", order.getTotalPrice());
            map.put("status", order.getStatus());
            map.put("createdAt", order.getCreatedAt());
            map.put("updatedAt", order.getUpdatedAt());
            if (order.getTableId() != null) {
                tableRepository.findById(order.getTableId())
                        .ifPresentOrElse(
                                table -> map.put("tableName", table.getNumber()),
                                () -> map.put("tableName", null)
                        );
            } else {
                map.put("tableName", null);
            }
            if (order.getUserId() != null) {
                userRepository.findById(order.getUserId())
                        .ifPresentOrElse(
                                user -> {
                                    map.put("username", user.getUsername());
                                    map.put("userPhone", user.getPhone());
                                },
                                () -> {
                                    map.put("username", null);
                                    map.put("userPhone", null);
                                }
                        );
            } else {
                map.put("username", null);
                map.put("userPhone", null);
            }
            list.add(map);
        }
        return list;
    }
    // Lấy đơn hàng theo userId
    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserId(userId);
    }

    // Cập nhật trạng thái đơn hàng
    public Order updateOrderStatus(String orderId, Order.Status status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
        order.setStatus(status);
        order.setUpdatedAt(java.time.LocalDateTime.now());

        return orderRepository.save(order);

    }

    // Xóa đơn hàng
    public void deleteOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }
}
