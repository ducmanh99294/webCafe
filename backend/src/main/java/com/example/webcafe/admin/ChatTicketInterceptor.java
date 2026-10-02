package com.example.webcafe.websocket;

import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;

/**
 * Kiểm tra ticket ở bước bắt tay WebSocket (?ticket=...).
 * Ticket sai / hết hạn / đã dùng -> từ chối kết nối (401).
 * Ticket hợp lệ -> gắn userId + role vào session để handler dùng.
 */
@Component
public class ChatTicketInterceptor implements HandshakeInterceptor {

    private final ChatWsTicketService tickets;

    public ChatTicketInterceptor(ChatWsTicketService tickets) {
        this.tickets = tickets;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String ticket = extractParam(request.getURI().getQuery(), "ticket");
        Optional<ChatWsTicketService.Ticket> info = tickets.consume(ticket);
        if (info.isEmpty()) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }
        attributes.put("userId", info.get().userId());
        attributes.put("role", info.get().role());
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // không cần xử lý thêm
    }

    private String extractParam(String query, String name) {
        if (query == null) return null;
        for (String p : query.split("&")) {
            int i = p.indexOf('=');
            if (i > 0 && p.substring(0, i).equals(name)) {
                try {
                    return java.net.URLDecoder.decode(p.substring(i + 1), StandardCharsets.UTF_8);
                } catch (Exception e) {
                    return null;
                }
            }
        }
        return null;
    }
}
