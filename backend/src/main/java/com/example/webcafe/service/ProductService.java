package com.example.webcafe.service;

import com.example.webcafe.model.Product;
import com.example.webcafe.repository.CategoryRepository;
import com.example.webcafe.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    @Autowired
    private final ProductRepository productRepository;
    @Autowired
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Map<String, Object>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Product product : products) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", product.getId());
            map.put("name", product.getName());
            map.put("description", product.getDescription());
            map.put("preparationTime", product.getPreparationTime());
            map.put("rating", product.getRating());
            map.put("sizePrices", product.getSizePrices());
            map.put("image", product.getImage());
            map.put("discount", product.getDiscount());
            map.put("available", product.isAvailable());
            map.put("categoryId", product.getCategoryId());

            // Lấy tên danh mục theo categoryId
            if (product.getCategoryId() != null) {
                categoryRepository.findById(product.getCategoryId())
                        .ifPresentOrElse(
                                category -> map.put("categoryName", category.getName()),
                                () -> map.put("categoryName", null)
                        );
            } else {
                map.put("categoryName", null);
            }

            list.add(map);
        }

        return list;
    }

     public List<Product> searchProduct(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Product> getProductByCategory(String categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> getDiscountedProducts() {
        return productRepository.findByDiscountNotNull();
    }

    public List<Product> getLatestProducts() {
        return productRepository.findTop5ByOrderByIdDesc();
    }

    public List<Product> getProductAvailable(boolean available) {
        return productRepository.findByAvailable(available);
    }

    public List<Product> getTopSellingProducts(int limit) {
        return productRepository.findTopSellCount(PageRequest.of(0, limit));
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    public Product createProduct(Product product) {
        if (product.getCategoryId() != null) {
            boolean exists = categoryRepository.existsById(product.getCategoryId());
            if (!exists) {
                throw new RuntimeException("Không tìm thấy category với ID: " + product.getCategoryId());
            }
        }
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product updatedProduct) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(updatedProduct.getName());
                    product.setSizePrices(updatedProduct.getSizePrices());
                    product.setDescription(updatedProduct.getDescription());
                    product.setImage(updatedProduct.getImage());
                    product.setDiscount(updatedProduct.getDiscount());
                    product.setAvailable(updatedProduct.isAvailable());
                    product.setCategoryId(updatedProduct.getCategoryId());
                    product.setPreparationTime(updatedProduct.getPreparationTime());
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
    }

    public Product updateProductAvailable(String id, Map<String, Object> updates) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));

        if (updates.containsKey("available")) {
            existing.setAvailable((Boolean) updates.get("available"));
        }

        return productRepository.save(existing);
    }

    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }
}
