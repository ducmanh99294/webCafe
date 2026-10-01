package com.example.webcafe.service;

import com.example.webcafe.dto.OrderRequest;
import com.example.webcafe.model.*;
import com.example.webcafe.model.ChatMessage;
import com.example.webcafe.repository.CartRepository;
import com.example.webcafe.repository.ChatMessageRepository;
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

    @Autowired
    private ChatMessageRepository chatRepository;

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
        Order saved = orderRepository.save(order);

        // Tin nhắn hệ thống: xác nhận đã nhận đơn
        sendSystemMessage(userId, "Quán đã nhận đơn #" + shortId(saved.getId()) + " ✅");

        return saved;
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
            map.put("items", order.getItems());
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

        Order.Status old = order.getStatus();
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        Order saved = orderRepository.save(order);

        // Chỉ gửi tin khi trạng thái thực sự đổi
        if (old != status) {
            String code = "#" + shortId(saved.getId());
            String msg = switch (status) {
                case processing -> "Your Order " + code + "is being prepared";
                case completed -> "Your Order " + code + "is ready";
                case cancelled -> "Your Order " + code + "has been cancelled.";
                default -> null;
            };
            if (msg != null) {
                sendSystemMessage(saved.getUserId(), msg);
            }
        }

        return saved;
    }

    // Xóa đơn hàng
    public void deleteOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }

    // ---------- helpers ----------

    private String shortId(String id) {
        if (id == null) return "";
        return id.length() >= 10 ? id.substring(7, 10).toUpperCase() : id;
    }

    private void sendSystemMessage(String userId, String content) {
        if (userId == null) return;
        ChatMessage m = new ChatMessage();
        m.setConversationId(userId);
        m.setSenderId("system");
        m.setSenderRole("ADMIN");
        m.setContent(content);
        chatRepository.save(m);
    }
}