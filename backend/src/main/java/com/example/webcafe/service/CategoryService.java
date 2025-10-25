package com.example.webcafe.service;

import com.example.webcafe.model.Category;
import com.example.webcafe.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả danh mục
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Lấy danh mục theo ID
    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục!"));
    }

    // Tạo danh mục mới
    public Category createCategory(Category category) {
        if (categoryRepository.findByName(category.getName()) != null) {
            throw new RuntimeException("Tên danh mục đã tồn tại!");
        }
        return categoryRepository.save(category);
    }

    // Cập nhật danh mục
    public Category updateCategory(String id, Category updatedCategory) {
        return categoryRepository.findById(id)
                .map(category -> {
                    category.setName(updatedCategory.getName());
                    category.setDescription(updatedCategory.getDescription());
                    category.setImageUrl(updatedCategory.getImageUrl());
                    return categoryRepository.save(category);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục để cập nhật!"));
    }

    // Xóa danh mục
    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }
}
