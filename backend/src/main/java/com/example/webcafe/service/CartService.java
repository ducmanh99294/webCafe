package com.example.webcafe.service;

import com.example.webcafe.dto.CartRequest;
import com.example.webcafe.model.Cart;
import com.example.webcafe.repository.CartRepository;
import com.example.webcafe.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;

    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    // Lấy giỏ hàng của user (nếu chưa có thì tạo mới)
    public Cart getCartByUserId(String userId) {
        Optional<Cart> existingCart = cartRepository.findByUserId(userId);
        if (existingCart.isPresent()) {
            return existingCart.get();
        }

        Cart newCart = new Cart();
        newCart.setUserId(userId);
        newCart.setItems(new ArrayList<>());
        return cartRepository.save(newCart);
    }

    // Thêm sản phẩm vào giỏ
    public Cart addItemToCart(CartRequest cartRequest) {

        // 1. Bóc tách dữ liệu từ DTO
        String userId = cartRequest.getUserId();
        int quantity = cartRequest.getQuantity();
        CartRequest.ItemRequest productRequest = cartRequest.getProduct();

        // Lỗi nghiêm trọng sẽ xảy ra nếu frontend không gửi selectedSize
        if (productRequest.getSelectedSize() == null) {
            throw new IllegalArgumentException("Thiếu thông tin 'selectedSize' trong 'product'");
        }

        CartRequest.SelectedSize sizeRequest = productRequest.getSelectedSize();

        String productId = productRequest.getId();
        String size = sizeRequest.getSize();
        double basePrice = sizeRequest.getPrice();
        double discountPercent = productRequest.getDiscount();

        double finalUnitPrice = basePrice;
        if (discountPercent > 0) {
            finalUnitPrice = basePrice * (1 - (discountPercent / 100.0));
        }

        // 2. Tìm hoặc tạo giỏ hàng
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    newCart.setItems(new ArrayList<>());
                    return newCart;
                });

        // 3. Kiểm tra xem item (với đúng productId VÀ size) đã có trong giỏ chưa
        Optional<Cart.Item> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId) && item.getSize().equals(size))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            // 4a. Nếu đã có -> chỉ tăng số lượng
            Cart.Item existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            // 4b. Nếu chưa có -> Kiểm tra xem ProductID có thật không
            // (Đây là bước đã gây lỗi "Product not found" ở trên)
            if (!productRepository.existsById(productId)) {
                throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId);
            }

            // Tạo item mới (dùng constructor của Cart.Item đã sửa)
            Cart.Item newItem = new Cart.Item(
                    productId,
                    productRequest.getName(),
                    size,                 
                    finalUnitPrice,          
                    quantity,              
                    productRequest.getImage()
            );
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    // Cập nhật số lượng sản phẩm
    public Cart updateItemQuantity(String userId, String productId, int quantity) {
        Cart cart = getCartByUserId(userId);

        cart.getItems().forEach(item -> {
            if (item.getProductId().equals(productId)) {
                item.setQuantity(quantity);
            }
        });

        return cartRepository.save(cart);
    }

    // Xóa sản phẩm khỏi giỏ
    public Cart removeItemFromCart(String userId, String productId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        return cartRepository.save(cart);
    }

    // Xóa toàn bộ giỏ hàng
    public void clearCart(String userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
