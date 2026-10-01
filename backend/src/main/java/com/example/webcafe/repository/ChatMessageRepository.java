package com.example.webcafe.repository;

import com.example.webcafe.model.ChatMessage;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(String conversationId);
    List<ChatMessage> findByConversationIdAndSenderRoleAndReadFalse(String cid, String senderRole);
}