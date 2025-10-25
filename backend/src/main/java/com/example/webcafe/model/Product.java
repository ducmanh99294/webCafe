package com.example.webcafe.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String name;
    private String description;
    private int preparationTime;
    private int rating;
    private List<sizePrice> sizePrices;
    private String image;
    private String categoryId;
    private double discount;
    private boolean available;
    private int sellCount;

    public static class sizePrice {
        private String size;
        private double price;

        public sizePrice() {
        }

        public sizePrice(String size, double price) {
            this.size = size;
            this.price = price;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        public String getSize() {
            return size;
        }

        public void setSize(String size) {
            this.size = size;
        }
    }
    // Constructors
    public Product() {}

    public Product(String id, String name, String description, int preparationTime, int rating, List<sizePrice> sizePrices, String image, String categoryId, double discount, boolean available, int sellCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.preparationTime = preparationTime;
        this.rating = rating;
        this.sizePrices = sizePrices;
        this.image = image;
        this.categoryId = categoryId;
        this.discount = discount;
        this.available = available;
        this.sellCount = sellCount;
    }

// --- Getters & Setters ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPreparationTime() {
        return preparationTime;
    }

    public void setPreparationTime(int preparationTime) {
        this.preparationTime = preparationTime;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public List<sizePrice> getSizePrices() {
        return sizePrices;
    }

    public void setSizePrices(List<sizePrice> sizePrices) {
        this.sizePrices = sizePrices;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public int getSellCount() {
        return sellCount;
    }

    public void setSellCount(int sellCount) {
        this.sellCount = sellCount;
    }
}
