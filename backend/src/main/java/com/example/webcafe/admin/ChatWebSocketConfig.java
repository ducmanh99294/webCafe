package com.example.webcafe.config;

import com.example.webcafe.websocket.ChatTicketInterceptor;
import com.example.webcafe.websocket.ChatWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * Đăng ký endpoint WebSocket cho chat realtime: ws://<host>/ws/chat?ticket=...
 * Client lấy ticket dùng 1 lần qua API đã xác thực GET /api/chat/ws-ticket.
 */
@Configuration
@EnableWebSocket
public class ChatWebSocketConfig implements WebSocketConfigurer {

    private final ChatWebSocketHandler handler;
    private final ChatTicketInterceptor ticketInterceptor;

    public ChatWebSocketConfig(ChatWebSocketHandler handler,
                               ChatTicketInterceptor ticketInterceptor) {
        this.handler = handler;
        this.ticketInterceptor = ticketInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/ws/chat")
                .addInterceptors(ticketInterceptor)
                .setAllowedOriginPatterns("*");
    }
}
