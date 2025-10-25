package com.example.webcafe.dto;

public class CartRequest {
    private String userId;
    private int quantity;
    private ItemRequest product; // Đối tượng sản phẩm

    // Getters & Setters cho CartRequest
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public ItemRequest getProduct() { return product; }
    public void setProduct(ItemRequest product) { this.product = product; }

    public static class SelectedSize {
        private String size;
        private double price;

        public SelectedSize() {}

        // Getters & Setters
        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
    }

    public static class ItemRequest {
        private String id;
        private String name;
        private String image;
        private SelectedSize selectedSize;
        private double discount;

        public ItemRequest() {}

        // Getters & Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public double getDiscount() {
            return discount;
        }

        public void setDiscount(double discount) {
            this.discount = discount;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }

        // SỬA LỖI 2: Thêm Getter/Setter cho selectedSize
        public SelectedSize getSelectedSize() { return selectedSize; }
        public void setSelectedSize(SelectedSize selectedSize) { this.selectedSize = selectedSize; }
    }
}