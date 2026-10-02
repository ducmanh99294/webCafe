package com.example.webcafe.controller;

import com.example.webcafe.model.User;
import com.example.webcafe.model.ChatMessage;
import com.example.webcafe.repository.ChatMessageRepository;
import com.example.webcafe.repository.UserRepository;
import com.example.webcafe.websocket.ChatWebSocketHandler;
import com.example.webcafe.websocket.ChatWsTicketService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

// controller/ChatController.java
// Bản WebSocket: sau khi lưu/xóa/đánh dấu đã đọc -> bắn sự kiện realtime qua ChatWebSocketHandler.
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired private ChatMessageRepository repo;
    @Autowired private UserRepository userRepository;
    @Autowired private ChatWebSocketHandler ws;
    @Autowired private ChatWsTicketService ticketService;

    // ---- USER: chỉ chat với admin, conversationId = chính mình ----
    @GetMapping("/me")
    public List<ChatMessage> myMessages(@AuthenticationPrincipal User me) {
        return load(me.getId(), "ADMIN", true);
    }

    @PostMapping("/me")
    public ResponseEntity<?> sendAsUser(@AuthenticationPrincipal User me,
                                        @RequestBody Map<String, String> body) {
        ChatMessage saved = saveMessage(me.getId(), me.getId(), "USER", body.get("content"));
        if (saved == null) return ResponseEntity.badRequest().body("Nội dung không hợp lệ");
        ws.broadcastNewMessage(saved); // realtime -> admin nhận ngay
        return ResponseEntity.ok(saved);
    }

    // ---- ADMIN ----
    @GetMapping("/admin/conversations")
    public List<Map<String, Object>> conversations() {
        Map<String, List<ChatMessage>> grouped = repo.findAll().stream()
                .collect(Collectors.groupingBy(ChatMessage::getConversationId));

        return grouped.entrySet().stream().map(e -> {
            List<ChatMessage> list = e.getValue();
            ChatMessage last = list.stream()
                    .max(Comparator.comparing(ChatMessage::getCreatedAt)).get();
            long unread = list.stream()
                    .filter(m -> "USER".equals(m.getSenderRole()) && !m.isRead()).count();
            Map<String, Object> m = new HashMap<>();
            m.put("userId", e.getKey());
            m.put("username", userRepository.findById(e.getKey())
                    .map(User::getUsername).orElse("?"));
            m.put("lastMessage", last.getContent());
            m.put("lastAt", last.getCreatedAt());
            m.put("unread", unread);
            return m;
        }).sorted((a, b) -> ((LocalDateTime) b.get("lastAt"))
                .compareTo((LocalDateTime) a.get("lastAt")))
          .toList();
    }

    // ADMIN xem tin nhắn — KHÔNG tự đánh dấu đã đọc (để frontend highlight tin chưa đọc).
    // Frontend gọi POST /admin/{userId}/read khi đã hiển thị cho admin xem.
    @GetMapping("/admin/{userId}")
    public List<ChatMessage> adminGet(@PathVariable String userId) {
        return repo.findByConversationIdOrderByCreatedAtAsc(userId);
    }

    // ADMIN đánh dấu đã đọc toàn bộ tin nhắn của khách trong cuộc trò chuyện
    @PostMapping("/admin/{userId}/read")
    public ResponseEntity<?> markRead(@PathVariable String userId) {
        List<ChatMessage> unread =
                repo.findByConversationIdAndSenderRoleAndReadFalse(userId, "USER");
        unread.forEach(m -> m.setRead(true));
        repo.saveAll(unread);
        ws.broadcastEvent("read", userId, Map.of()); // tab admin khác cập nhật badge ngay
        return ResponseEntity.ok(Map.of("marked", unread.size()));
    }

    @PostMapping("/admin/{userId}")
    public ResponseEntity<?> adminSend(@AuthenticationPrincipal User admin,
                                       @PathVariable String userId,
                                       @RequestBody Map<String, String> body) {
        ChatMessage saved = saveMessage(userId, admin.getId(), "ADMIN", body.get("content"));
        if (saved == null) return ResponseEntity.badRequest().body("Nội dung không hợp lệ");
        ws.broadcastNewMessage(saved); // realtime -> khách + tab admin khác nhận ngay
        return ResponseEntity.ok(saved);
    }

    // ADMIN xóa toàn bộ cuộc trò chuyện với 1 khách
    @DeleteMapping("/admin/{userId}")
    public ResponseEntity<?> deleteConversation(@PathVariable String userId) {
        List<ChatMessage> all = repo.findByConversationIdOrderByCreatedAtAsc(userId);
        repo.deleteAll(all);
        ws.broadcastEvent("conversation_deleted", userId, Map.of());
        return ResponseEntity.ok(Map.of("deleted", all.size()));
    }

    // ADMIN xóa 1 tin nhắn
    @DeleteMapping("/admin/message/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable String messageId) {
        Optional<ChatMessage> opt = repo.findById(messageId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        String cid = opt.get().getConversationId();
        repo.deleteById(messageId);
        ws.broadcastEvent("message_deleted", cid, Map.of("messageId", messageId));
        return ResponseEntity.ok(Map.of("deleted", messageId));
    }

    // ---- WEBSOCKET: cấp ticket dùng 1 lần để mở ws://.../ws/chat?ticket=... ----
    @GetMapping("/ws-ticket")
    public Map<String, String> wsTicket(@AuthenticationPrincipal User me) {
        return Map.of("ticket", ticketService.create(me.getId(), roleOf(me)));
    }

    private String roleOf(User me) {
        if (me instanceof org.springframework.security.core.userdetails.UserDetails ud) {
            boolean admin = ud.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority() != null && a.getAuthority().contains("ADMIN"));
            return admin ? "ADMIN" : "USER";
        }
        return "USER";
    }

    // ---- helpers ----
    private List<ChatMessage> load(String cid, String otherSide, boolean markRead) {
        if (markRead) {
            List<ChatMessage> unread =
                    repo.findByConversationIdAndSenderRoleAndReadFalse(cid, otherSide);
            unread.forEach(m -> m.setRead(true));
            repo.saveAll(unread);
        }
        return repo.findByConversationIdOrderByCreatedAtAsc(cid);
    }

    private ChatMessage saveMessage(String cid, String senderId, String role, String content) {
        if (content == null || content.isBlank() || content.length() > 1000) return null;
        ChatMessage m = new ChatMessage();
        m.setConversationId(cid);
        m.setSenderId(senderId);
        m.setSenderRole(role);
        m.setContent(content.trim());
        return repo.save(m);
    }
}