package com.example.webcafe.websocket;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Cấp ticket dùng 1 lần để mở WebSocket.
 * Vì WebSocket của trình duyệt không gắn được header Authorization,
 * client gọi API đã xác thực GET /api/chat/ws-ticket lấy ticket,
 * rồi mở ws://.../ws/chat?ticket=... Ticket hết hạn sau 30 giây.
 */
@Service
public class ChatWsTicketService {

    public record Ticket(String userId, String role, long expiresAt) {}

    private final Map<String, Ticket> tickets = new ConcurrentHashMap<>();
    private static final long TTL_MS = 30_000;

    public String create(String userId, String role) {
        long now = System.currentTimeMillis();
        tickets.entrySet().removeIf(e -> e.getValue().expiresAt() < now); // dọn ticket cũ
        String ticket = UUID.randomUUID().toString();
        tickets.put(ticket, new Ticket(userId, role, now + TTL_MS));
        return ticket;
    }

    /** Dùng 1 lần: lấy xong là xóa, sai hoặc hết hạn -> empty. */
    public Optional<Ticket> consume(String ticket) {
        if (ticket == null) return Optional.empty();
        Ticket info = tickets.remove(ticket);
        if (info == null || info.expiresAt() < System.currentTimeMillis()) return Optional.empty();
        return Optional.of(info);
    }
}
