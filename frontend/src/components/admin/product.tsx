// AdminProducts.js
import React, { useState, useEffect } from 'react';
import '../../assets/css/admin/product.css';
import { apiFetch } from '../../api/base'; 
import { denyAndRedirect, notify } from '../../utils/notify';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<any>('');
    const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    sizePrices: [{ size: 'M', price: 0 }],
    discount: 0,
    preparationTime: 0,
    rating: 0,
    image: '',
  });
  // const api = 'http://localhost:8080'
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
if (role !== 'ADMIN' || !token) {
  denyAndRedirect();
  return;
}
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product: any) =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  // lấy dữ liệu
  const fetchProducts = async () => {
    try {
      const res = await apiFetch(`/api/products`);

      if (!res.ok) throw new Error('Không thể tải danh sách sản phẩm');
      const data = await res.json();
      console.log(data)
      setProducts(data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiFetch(`/api/categories`);

      if (!res.ok) throw new Error('Không thể tải danh sách sản phẩm');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', err);
    }
  }
  // hàm xử lí
  const handleAddProduct = async (e: any) => {
    e.preventDefault()
    console.log(JSON.stringify(formData,null,2))
    try {
      const res = await apiFetch(`/api/products/admin`,{
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        const data = await res.json();
        setProducts((pre: any) => [...pre, data])
        setShowModal(false);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleEditProduct = async (e: any) => {
    e.preventDefault()
    console.log(JSON.stringify(formData,null,2))
    try {
      const res = await apiFetch(`/api/products/admin/${editingProduct.id}`,{
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      if(res.ok) {
        const data = await res.json();
        setProducts((pre: any) => pre.map((e: any) => e.id === editingProduct.id ? {...e, ...data } : e))
        setShowModal(false);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteProduct = async (id: any) => {
    try {
      const res = await apiFetch(`/api/products/admin/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        await fetchProducts();
        setShowDeleteModal(false)
      }
      
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
    }
  };

  const handleUpdateProductStatus = async (product: any) => {
    try {
      const newStatus = !product.available;
      const res = await apiFetch(`/api/products/admin/available/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ available: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts((prev: any) =>
          prev.map((e: any) =>
            e.id === product.id ? { ...e, ...data } : e
          )
        );
        setShowModal(false);
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  const handleClose = () => {
    setShowModal(false)
  }

    const handleShowDelete = (product: any) => {
      setShowDeleteModal(true);
      setSelectedProduct(product);
    }
  // form dữ diệu 
  const handleSetAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: '',
      description: '',
      sizePrices: [{ size: 'M', price: 0 }],
      discount: 0,
      preparationTime: 0,
      image: '',
      rating: 2.5,
    });
    setShowModal(true);
  };

  const handleSetEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      categoryId: product.category?.id || '',
      description: product.description || '',
      sizePrices: product.sizePrices || [{ size: 'M', price: 0 }],
      discount: product.discount || 0,
      preparationTime: product.preparationTime || 0,
      image: product.image || '' ,
      rating: product.rating || 0,
    });
    setShowModal(true);
  };  

  const handleSizePriceChange = (index: number, field: 'size' | 'price', value: string) => {
    const newSizePrices: any = [...formData.sizePrices];
    newSizePrices[index] = {
      ...newSizePrices[index],
      [field]: field === 'price' ? parseFloat(value) || 0 : value
    };
    setFormData(prev => ({ ...prev, sizePrices: newSizePrices }));
  };

  // Thêm một hàng size/giá mới
  const addSizePrice = () => {
    setFormData(prev => ({
      ...prev,
      sizePrices: [...prev.sizePrices, { size: '', price: 0 }]
    }));
  };

  // Xóa một hàng size/giá
  const removeSizePrice = (index: number) => {
    // Không cho xóa hàng cuối cùng
    if (formData.sizePrices.length <= 1) {
      notify.warn("Please choose size.")
      return;
    }
    const newSizePrices = formData.sizePrices.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, sizePrices: newSizePrices }));
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev: any) => ({
          ...prev,
          image: ev.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatPrice = (price: any) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);


  return (
    <div className="admin-products">
        <main className="dashboard-main">
          <div className="products-main">
            <div className="products-header">
              <h2 className="products-title">Quản Lý Sản Phẩm</h2>
              <div className="products-actions">
                <button className="add-product-btn" onClick={handleSetAddProduct}>
                  ➕ Thêm Sản Phẩm
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="products-filter">
              {/* <div className="filter-group">
                <label className="filter-label">Danh mục</label>
                <select 
                  className="filter-select"
                  value={filters.category.name}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Trạng thái</label>
                <select 
                  className="filter-select"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngừng bán</option>
                </select>
              </div> */}

              <div className="filter-group">
                <label className="filter-label">Tìm kiếm</label>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên theo tên, chức vụ, phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product: any) => (
                  <div key={product.id} className="product-card">
                    <div 
                      className="product-image"
                      style={{ backgroundImage: `url(${product.image})` }}
                    >
                        <span className={`product-status ${product.available ? 'status-active' : 'status-inactive'}`}>
                          {product.available ? 'Đang bán' : 'Ngừng bán'}
                        </span>
                    </div>
                    <div className="product-content">
                      <div className="product-category">
                        {product?.categoryName}
                      </div>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      <div className="product-details">
                        <div className="product-price">
                          <span className="current-price">{formatPrice(product.sizePrices[0].price)}</span>
                          {product.originalPrice && (
                            <span className="original-price">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                      <div className="product-actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleSetEditProduct(product)}
                        >
                          ✏️ Sửa
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleShowDelete(product)}
                        >
                          🗑️ Xóa
                        </button>
                        <button 
                          className={`action-btn toggle-btn ${product.available ? 'inactive' : ''}`}
                          onClick={() => handleUpdateProductStatus(product)}
                        >
                          {product.available ? '⏸️' : '▶️'}
                          {product.available ? 'Tắt' : 'Bật'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-products">
                <div className="empty-icon">☕</div>
                <h3 className="empty-title">Không tìm thấy sản phẩm</h3>
                <p className="empty-description">            
                    Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <button className="add-product-btn" onClick={handleAddProduct}>
                  ➕ Thêm Sản Phẩm Đầu Tiên
                </button>
              </div>
            )}
          </div>
        </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal">
          <div className="confirm-content">
            <div className="confirm-icon">🗑️</div>
            <h3 className="confirm-title">Xác nhận xóa</h3>
            <p className="confirm-message">
              Bạn có chắc chắn muốn xóa sản phẩm?
              <br />
              Hành động này không thể hoàn tác.
            </p>
            <div className="confirm-actions">
              <button 
                className="cancel-delete-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button 
                className="confirm-delete-btn"
                onClick={() => handleDeleteProduct(selectedProduct.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
      <div className="product-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              {editingProduct ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}
            </h2>
            <button className="close-btn" onClick={handleClose}>×</button>
          </div>

          <form className="product-form" onSubmit={editingProduct ? (handleEditProduct) : (handleAddProduct)}>
            <div className="form-group full-width">
              <label className="form-label required">Tên sản phẩm</label>
              <input
                type="text"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Danh mục</label>
              <select
                className="form-select"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
              >
                {categories.filter(cat => cat.id !== 'all').map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

<div className="form-group full-width">
              <label className="form-label required">Kích cỡ và Giá</label>
              {formData.sizePrices.map((sizePrice, index) => (
                <div className="size-price-row" key={index}>
                  <input
                    type="text"
                    className="form-input size-input"
                    placeholder="Size (Vd: M, L, S)"
                    value={sizePrice.size}
                    onChange={(e) => handleSizePriceChange(index, 'size', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    className="form-input price-input"
                    placeholder="Giá (VND)"
                    value={sizePrice.price}
                    onChange={(e) => handleSizePriceChange(index, 'price', e.target.value)}
                    min="0"
                    required
                  />
                  <button
                    type="button"
                    className="remove-size-btn"
                    onClick={() => removeSizePrice(index)}
                    // Vô hiệu hóa nếu chỉ còn 1 size
                    disabled={formData.sizePrices.length <= 1} 
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-size-btn"
                onClick={addSizePrice}
              >
                + Thêm Size
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Giảm giá (%)</label>
              <input
                type="number"
                className="form-input"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thời gian chuẩn bị (phút)</label>
              <input
                type="number"
                className="form-input"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label required">Mô tả</label>
              <textarea
                className="form-textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Hình ảnh</label>
              <div className="image-upload">
                <div className="image-preview">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <div>📷</div>
                      <div>Chưa có hình ảnh</div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload" className="upload-btn">
                  Chọn hình ảnh
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={handleClose}>
                Hủy
              </button>
              <button type="submit" className="save-btn">
                {editingProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};


export default AdminProducts;