package com.example.webcafe.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
public class Category {

    @Id
    private String id;
    private String name;        // Tên danh mục: "Cà phê", "Trà", "Bánh ngọt"
    private String description; // Mô tả ngắn (nếu cần)
    private String icon;    // Hình minh họa danh mục (tùy chọn)
    private int count;

    // Constructors
    public Category() {}

    public Category(String name, String description, String icon, int count) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.count = count;
    }

    // Getters & Setters

    public int getCount() {
        return count;
    }
    public void setCount(int count) {
        this.count = count;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return icon; }
    public void setImageUrl(String imageUrl) { this.icon = imageUrl; }
}
