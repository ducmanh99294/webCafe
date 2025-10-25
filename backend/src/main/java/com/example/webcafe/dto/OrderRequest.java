package com.example.webcafe.dto;

import java.util.List;

public class OrderRequest {
    private String userId;
    private String tableId;
    private String paymentMethod;
    private double total;
    private List<ItemRequest> items;

    // Inner class: giống cấu trúc từng item trong JSON
    public static class ItemRequest {
        private String productId;
        private String name;
        private double price;
        private int quantity;
        private String image;

        // Getters & setters
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }

        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
    }

    // Getters & setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTableId() { return tableId; }
    public void setTableId(String tableId) { this.tableId = tableId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public List<ItemRequest> getItems() { return items; }
    public void setItems(List<ItemRequest> items) { this.items = items; }
}
