package com.example.webcafe.websocket;

import com.example.webcafe.model.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * Quản lý kết nối WebSocket của chat realtime.
 * - ADMIN: nhận mọi sự kiện (tin nhắn mới của khách, xóa tin, xóa hội thoại, đã đọc...).
 * - USER thường: chỉ nhận sự kiện trong cuộc trò chuyện của mình (conversationId = userId).
 *
 * Giao thức server -> client (JSON):
 *   { "type":"chat", "event":"new_message", "conversationId":"...", "message":{...} }
 *   { "type":"chat", "event":"message_deleted" | "conversation_deleted" | "read",
 *     "conversationId":"...", ... }
 */
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper mapper = new ObjectMapper();
    private final Set<WebSocketSession> adminSessions = new CopyOnWriteArraySet<>();
    private final Map<String, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = (String) session.getAttributes().get("userId");
        String role = (String) session.getAttributes().get("role");
        if (userId == null) { closeQuietly(session); return; }
        if ("ADMIN".equals(role)) {
            adminSessions.add(session);
        } else {
            userSessions.computeIfAbsent(userId, k -> new CopyOnWriteArraySet<>()).add(session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        remove(session);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        remove(session);
    }

    private void remove(WebSocketSession session) {
        adminSessions.remove(session);
        userSessions.values().forEach(s -> s.remove(session));
    }

    /** Bắn sự kiện "có tin nhắn mới" tới toàn bộ admin + tới đúng user trong cuộc trò chuyện. */
    public void broadcastNewMessage(ChatMessage m) {
        Map<String, Object> msg = new LinkedHashMap<>();
        msg.put("id", m.getId());
        msg.put("senderRole", m.getSenderRole());
        msg.put("content", m.getContent());
        msg.put("createdAt", m.getCreatedAt() == null ? null : m.getCreatedAt().toString());
        msg.put("read", m.isRead());

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("type", "chat");
        payload.put("event", "new_message");
        payload.put("conversationId", m.getConversationId());
        payload.put("message", msg);

        sendToAdmins(payload);
        sendToUser(m.getConversationId(), payload);
    }

    /** Bắn sự kiện chung: message_deleted / conversation_deleted / read. */
    public void broadcastEvent(String event, String conversationId, Map<String, Object> extra) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("type", "chat");
        payload.put("event", event);
        payload.put("conversationId", conversationId);
        if (extra != null) payload.putAll(extra);
        sendToAdmins(payload);
        sendToUser(conversationId, payload);
    }

    private void sendToAdmins(Map<String, Object> payload) {
        String json = toJson(payload);
        if (json == null) return;
        adminSessions.forEach(s -> send(s, json));
    }

    private void sendToUser(String userId, Map<String, Object> payload) {
        if (userId == null) return;
        Set<WebSocketSession> sessions = userSessions.get(userId);
        if (sessions == null || sessions.isEmpty()) return;
        String json = toJson(payload);
        if (json == null) return;
        sessions.forEach(s -> send(s, json));
    }

    private void send(WebSocketSession s, String json) {
        try {
            if (s.isOpen()) s.sendMessage(new TextMessage(json));
            else remove(s);
        } catch (Exception e) {
            remove(s);
        }
    }

    private String toJson(Map<String, Object> payload) {
        try {
            return mapper.writeValueAsString(payload);
        } catch (Exception e) {
            return null;
        }
    }

    private void closeQuietly(WebSocketSession s) {
        try { s.close(); } catch (Exception ignored) {}
    }
}
