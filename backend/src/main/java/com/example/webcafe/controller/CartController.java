package com.example.webcafe.controller;

import com.example.webcafe.dto.CartRequest;
import com.example.webcafe.model.Cart;
import com.example.webcafe.model.Product;
import com.example.webcafe.service.CartService;
import com.example.webcafe.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    // Lấy giỏ hàng theo userId
    @GetMapping
    public List<Cart> getCarts() {
        return cartService.getAllCarts();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCartByUserId(@PathVariable String userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    // Thêm sản phẩm vào giỏ
    @PostMapping("/{userId}/add")
    public ResponseEntity<?> addToCart(
            @PathVariable String userId,
            @RequestBody CartRequest cartRequest

            ) {
        try {

            cartRequest.setUserId(userId);

            Cart updatedCart = cartService.addItemToCart(cartRequest);

            return ResponseEntity.ok(updatedCart);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Cập nhật số lượng sản phẩm trong giỏ
    @PutMapping("/{userId}/update")
    public ResponseEntity<?> updateQuantity(
            @PathVariable String userId,
            @RequestBody Map<String, Object> body
    ) {
        String productId = (String) body.get("productId");
        int quantity = (int) body.get("quantity");
        Cart updatedCart = cartService.updateItemQuantity(userId, productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    // Xóa sản phẩm khỏi giỏ
    @DeleteMapping("/{userId}/remove")
    public ResponseEntity<?> removeItem(
            @PathVariable String userId,
            @RequestBody Map<String, Object> body
    ) {
        String productId = (String) body.get("productId");
        Cart updatedCart = cartService.removeItemFromCart(userId, productId);
        return ResponseEntity.ok(updatedCart);
    }

    //  Xóa toàn bộ giỏ
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("🧺 Giỏ hàng đã được xóa");
    }
}
