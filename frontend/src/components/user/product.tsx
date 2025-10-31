// Menu.js
import React, { useState, useEffect } from 'react';
import '../../assets/css/user/product.css';
import { apiFetch } from '../../api/base'; 

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất Cả');
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [sortBy, setSortBy] = useState('name');
  const [wishlist, setWishlist] = useState<any>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [categories, setCategories] = useState<any>([])
  const [products, setProducts] = useState<any>([])
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [quantity, setQuantity] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);

  // const api = 'http://localhost:8080'
  const userId = localStorage.getItem("userId");

  useEffect(()=>{
    fetchCategory();
    fetchProduct();
  }, [])

  const fetchCategory = async () => {
    setLoading(true)
    try {
      const res = await apiFetch(`/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await apiFetch(`/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleShowDetail = (product: any) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizePrices[0]);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedProduct(null);
    setQuantity(1);
  }

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'Tất Cả') {
      filtered = filtered.filter((product: any) => 
        product.categoryName === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((product: any) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter((product: any) =>
      product.sizePrices[0]?.price >= priceRange[0] && product.sizePrices[0]?.price <= priceRange[1]
    );

    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy, priceRange]);

  const addToCart = async (product: any, quantity: any) => {
    if(!userId) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      window.location.href = '/login';
      return;
    }
    let defaultSize = product.sizePrices.find((sp: any) => sp.size === "M");
    const productPayload = {
      id: product.id,
      name: product.name,
      image: product.image,
      discount: product.discount,
      selectedSize: defaultSize
    };
    try {
        const res = await apiFetch(`/api/carts/${userId}/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
         },
        body: JSON.stringify({
          userId,                     // id người dùng
          product: productPayload,    // id sản phẩm
          quantity          // số lượng
        }),
      });
      
      if (product == null) {
      console.log("Dữ liệu sản phẩm (product) bị thiếu trong request.");
      }

      if (!res.ok) throw new Error("Không thể thêm sản phẩm vào giỏ");
      alert("Thêm vào giỏ hàng thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleAddToCartFromDetail = async () => {

    if (!selectedProduct || !selectedSize) return;

    const productPayload = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      discount: selectedProduct.discount,
      selectedSize: selectedSize 
    };

    try {
      const res = await apiFetch(`/api/carts/${userId}/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
         },
        body: JSON.stringify({
          userId,
          product: productPayload,
          quantity
        }),
      });
      
      if (!res.ok) throw new Error("Không thể thêm sản phẩm vào giỏ");
      
      alert("Thêm vào giỏ hàng thành công!");
      handleCloseDetail();
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const toggleWishlist = (productId: any) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id: any) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderStars = (rating: any) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star-filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star-filled">★</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star-empty">★</span>);
    }

    return stars;
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct || !selectedSize) return 0;
    const basePrice = selectedProduct.discount === 0 && selectedProduct.discount !== 'null'
      ? selectedSize.price
      : (100 - selectedProduct.discount) / 100 * selectedSize.price;
    return basePrice * quantity;
  };
  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-title">Thực Đơn</h1>
        <p className="menu-subtitle">
          Khám phá những thức uống và món ăn đặc biệt được chế biến tỉ mỉ tại Café Mộc
        </p>
      </div>

      <div className="menu-layout">
        {/* Sidebar Filters */}
        <aside className="menu-sidebar">
          {/* Categories */}
          <div className="filter-section">
            <h3 className="filter-title">Danh Mục</h3>
            <div className="category-list">
              {categories.map((category: any) => (
                <div
                  key={category.id}
                  className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <span className="category-icon">{category.imageUrl}</span>
                  <span className="category-name">{category.name}</span>
                  {/* <span className="category-count">{category.count}</span> */}
                </div>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h3 className="filter-title">Khoảng Giá</h3>
            <div className="price-filter">
              <div className="price-inputs">
                <input
                  type="number"
                  className="price-input"
                  placeholder="Từ"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                />
                <input
                  type="number"
                  className="price-input"
                  placeholder="Đến"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 200000])}
                />
              </div>
              <div className="price-slider">
                <div
                  className="price-slider-fill"
                  style={{
                    left: `${(priceRange[0] / 200000) * 100}%`,
                    width: `${((priceRange[1] - priceRange[0]) / 200000) * 100}%`
                  }}
                />
              </div>
              <div className="price-labels">
                <span>0đ</span>
                <span>200.000đ</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="menu-main">
          {/* Toolbar */}
          <div className="menu-toolbar">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="products-section">
            {loading ? (
              "loading"
            ) : (
            <>
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product: any) => (
                  <div key={product.id} className="product-card">
                    {product.badge && (
                      <span className={`product-badge ${product.badge}`}>
                        {product.badge === 'new' && 'Mới'}
                        {product.badge === 'popular' && 'Phổ Biến'}
                        {product.badge === 'special' && 'Đặc Biệt'}
                      </span>
                    )}
                    
                    <div
                      className="product-image"
                      style={{ backgroundImage: `url(${product.image})` }}
                    >
                      <button
                        className={`product-wishlist ${wishlist.includes(product.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product.id)}
                      >
                        {wishlist.includes(product.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                    <div className="product-content">
                      <div className="product-category">
                        {categories.find((cat: any) => cat.id === product.category)?.name}
                      </div>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-details">                      
                          {product.discount === 0 || product.discount === 'null' ? (
                            <div className="product-price">
                              <span className="current-price">{formatPrice(product.sizePrices[0].price)}</span>
                            </div>
                          ) : (
                            <div className="product-price">
                              <span className="current-price">{formatPrice((100 - product.discount) / 100 * product.sizePrices[0].price)}</span>
                              {product.discount && (
                                <span className="original-price">{formatPrice(product.sizePrices[0].price)}</span>
                              )}
                            </div>
                          )}                        
                        <div className="product-rating">
                          {renderStars(product.rating)}
                          <span>({product.rating})</span>
                        </div>
                      </div>
                      <div className="product-actions">
                        <button
                          className="view-detail-btn"
                          onClick={() => handleShowDetail(product)}
                        >
                          Xem Chi Tiết
                        </button>
                        {/* Giữ nguyên nút Add to Cart hiện tại */}
                        {product.available ? (
                          <button
                            className="add-to-cart"
                            onClick={() => addToCart(product, quantity)}
                          >
                            <span>🛒</span>
                            Thêm Vào Giỏ
                          </button>
                        ) : (
                          <button className="add-to-cart" disabled>
                            Hết Hàng
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">☕</div>
                <h3 className="empty-title">Không tìm thấy sản phẩm</h3>
                <p className="empty-description">
                  Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
                <button
                  className="load-more-btn"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                    setPriceRange([0, 200000]);
                  }}
                >
                  Xóa Bộ Lọc
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredProducts.length > 0 && (
              <div className="load-more">
                <button className="load-more-btn">
                  Xem Thêm Sản Phẩm
                </button>
              </div>
            )}
            </>  
            )}

            {showDetail && selectedProduct && (
            <div className="product-detail-modal">
              <div className="modal-overlay" onClick={handleCloseDetail}></div>
              <div className="modal-content">
                <button className="close-modal" onClick={handleCloseDetail}>
                  ×
                </button>
                
                <div className="modal-body">
                  <div className="product-image-section">
                    <div 
                      className="product-detail-image"
                      style={{ backgroundImage: `url(${selectedProduct.image})` }}
                    ></div>
                  </div>
                  
                  <div className="product-info-section">
                    <div className="product-header">
                      <span className="product-category">
                        {selectedProduct.categoryName}
                      </span>
                      <h2 className="product-title">{selectedProduct.name}</h2>
                      <p className="product-description">{selectedProduct.description}</p>
                      
                      <div className="product-rating">
                        {renderStars(selectedProduct.rating)}
                        <span>({selectedProduct.rating})</span>
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="size-section">
                      <h3 className="section-title">Chọn Size</h3>
                      <div className="size-options">
                        {selectedProduct.sizePrices.map((size: any) => (
                          <div
                            key={size.id}
                            className={`size-option ${selectedSize?.id === size.id ? 'selected' : ''}`}
                            onClick={() => setSelectedSize(size)}
                          >
                            <div className="size-info">
                              <span className="size-name">{size.size}</span>
                            </div>
                            <div className="size-price">
                              {size.discount > 0 ? `+${formatPrice(size.price * size.discount)}` : `+${formatPrice(size.price)}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Selection */}
                    <div className="quantity-section">
                      <h3 className="section-title">Số Lượng</h3>
                      <div className="quantity-selector">
                        <button
                          className="quantity-btn"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-display">{quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="price-summary">
                      <div className="price-breakdown">
                        {selectedProduct.discount > 0 && selectedProduct.discount !== 'null' && (
                        <div className="price-row">
                          <span>Giảm giá:</span>
                          <span>
                            {formatPrice(selectedProduct.discount)}                          
                          </span>
                        </div>              
                        )}         
                        {selectedSize && selectedSize.price > 0 && (
                          <div className="price-row">
                            <span>Size {selectedSize.size}:</span>
                            <span>{formatPrice(selectedSize.price)}</span>
                          </div>
                        )}
                        <div className="price-row">
                          <span>Số lượng:</span>
                          <span>x{quantity}</span>
                        </div>
                        <div className="price-row total">
                          <span>Tổng cộng:</span>
                          <span className="total-price">{formatPrice((calculateTotalPrice()))}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-actions">
                      <button
                        className="add-to-cart-btn primary"
                        onClick={handleAddToCartFromDetail}
                        disabled={!selectedProduct.available}
                      >
                        <span>🛒</span>
                        Thêm Vào Giỏ - {formatPrice(calculateTotalPrice())}
                      </button>
                      {!selectedProduct.available && (
                        <div className="out-of-stock-message">
                          Sản phẩm tạm thời hết hàng
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;