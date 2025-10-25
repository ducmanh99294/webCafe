package com.example.webcafe.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
public class Cart {

    @Id
    private String id;

    private String userId; // ID người dùng sở hữu giỏ hàng
    private List<Item> items = new ArrayList<>();

    public Cart() {}

    public Cart(String userId) {
        this.userId = userId;
        this.items = new ArrayList<>();
    }

    // ✅ Embedded class cho sản phẩm trong giỏ
    public static class Item {
        private String productId;
        private String name;
        private String size;       // <-- 1. Thêm trường 'size'
        private double price;
        private int quantity;
        private String image;

        public Item() {}

        public Item(String productId, String name, String size, double price, int quantity, String image) {
            this.productId = productId;
            this.name = name;
            this.size = size;
            this.price = price;
            this.quantity = quantity;
            this.image = image;
        }

        // Getters & Setters
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSize() {
            return size;
        }

        public void setSize(String size) {
            this.size = size;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }

        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }
}
