package com.example.webcafe.repository;

import com.example.webcafe.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);

    List<Order> findByStatusAndCreatedAtBetween(Order.Status status, LocalDateTime localDateTime, LocalDateTime localDateTime1);
}
