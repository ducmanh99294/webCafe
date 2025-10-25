package com.example.webcafe.repository;

import com.example.webcafe.model.Product;
import org.springframework.data.domain.Pageable; // ✅ import đúng
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategoryId(String category);
    List<Product> findByAvailable(boolean available);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByDiscountNotNull();
    List<Product> findTop5ByOrderByIdDesc();

    @Query(value = "{}", sort = "{ 'sellCount': -1 }")
    List<Product> findTopSellCount(Pageable pageable);
}
