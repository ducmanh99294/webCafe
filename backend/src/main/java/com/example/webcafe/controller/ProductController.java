package com.example.webcafe.controller;
import com.example.webcafe.model.Category;
import com.example.webcafe.repository.CategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.webcafe.model.Product;
import com.example.webcafe.service.ProductService;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    @Autowired
    private CategoryRepository categoryRepository;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllProducts() {
        List<Map<String, Object>> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable String id) {
        return productService.getProductById(id);
    }

    @GetMapping("/latest")
    public List<Product> getLatestProducts() {
        return productService.getLatestProducts();
    }

    @GetMapping("/discounted")
    public List<Product> getDiscountedProducts() {
        return productService.getDiscountedProducts();
    }

    @GetMapping("/search")
    public List<Product> searchProduct(@RequestParam String name) {
        return productService.searchProduct(name);
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable String categoryId) {
        return productService.getProductByCategory(categoryId);
    }

    @GetMapping("/sellCount")
    public List<Product> getTopSellingProducts(@RequestParam(defaultValue = "5") int sell) {
        return productService.getTopSellingProducts(sell);
    }

    @PostMapping("/admin")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product saved = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/admin/{id}")
    public Product updateProduct(@PathVariable String id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @PutMapping("/admin/available/{id}")
    public ResponseEntity<Product> updateProductAvailable(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Product updated = productService.updateProductAvailable(id, updates);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/admin/{id}")
    public void deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
    }
}