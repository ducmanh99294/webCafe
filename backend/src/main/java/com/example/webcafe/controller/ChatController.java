package com.example.webcafe.controller;

import com.example.webcafe.model.User;
import com.example.webcafe.model.ChatMessage;
import com.example.webcafe.repository.ChatMessageRepository;
import com.example.webcafe.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// controller/ChatController.java
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired private ChatMessageRepository repo;
    @Autowired private UserRepository userRepository;

    // ---- USER: chỉ chat với admin, conversationId = chính mình ----
    @GetMapping("/me")
    public List<ChatMessage> myMessages(@AuthenticationPrincipal User me) {
        return load(me.getId(), "ADMIN");
    }

    @PostMapping("/me")
    public ResponseEntity<?> sendAsUser(@AuthenticationPrincipal User me,
                                        @RequestBody Map<String, String> body) {
        return save(me.getId(), me.getId(), "USER", body.get("content"));
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

    @GetMapping("/admin/{userId}")
    public List<ChatMessage> adminGet(@PathVariable String userId) {
        return load(userId, "USER");
    }

    @PostMapping("/admin/{userId}")
    public ResponseEntity<?> adminSend(@AuthenticationPrincipal User admin,
                                       @PathVariable String userId,
                                       @RequestBody Map<String, String> body) {
        return save(userId, admin.getId(), "ADMIN", body.get("content"));
    }

    // ---- helpers ----
    private List<ChatMessage> load(String cid, String otherSide) {
        List<ChatMessage> unread =
                repo.findByConversationIdAndSenderRoleAndReadFalse(cid, otherSide);
        unread.forEach(m -> m.setRead(true));
        repo.saveAll(unread);
        return repo.findByConversationIdOrderByCreatedAtAsc(cid);
    }

    private ResponseEntity<?> save(String cid, String senderId, String role, String content) {
        if (content == null || content.isBlank() || content.length() > 1000)
            return ResponseEntity.badRequest().body("Nội dung không hợp lệ");
        ChatMessage m = new ChatMessage();
        m.setConversationId(cid);
        m.setSenderId(senderId);
        m.setSenderRole(role);
        m.setContent(content.trim());
        return ResponseEntity.ok(repo.save(m));
    }
}