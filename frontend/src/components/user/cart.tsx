// Cart.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/user/cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [hasArrived, setHasArrived] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState('');

  const api = ''
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // In real app, this would come from context or localStorage
    fetchCart();
  }, []);

  const timeSlots = [
    'Ngay bây giờ',
    '30 phút nữa',
    '1 tiếng nữa',
    '1.5 tiếng nữa',
    '2 tiếng nữa'
  ];

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Tiền mặt',
      description: 'Vui lòng thanh toán tại quầy',
      icon: '💵'
    },
    {
      id: 'card',
      name: 'chuyển khoản',
      description: 'Vui lòng quét mã bên dưới',
      icon: '💳'
    },
  ];

  useEffect(() => {
    fetchCart();
    fetchTable();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${api}/api/carts/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Không thể lấy giỏ hàng");
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
  };

  const fetchTable = async () => {
    try {
      const res = await fetch(`${api}/api/tables`);
      if (!res.ok) throw new Error("Không thể lấy ds bàn");
      const data = await res.json();
      setTables(data || []);
    } catch (err) {
      console.error("Lỗi:", err);
    }
  }

  const updateQuantity = async (productId: any, newQuantity: any) => {
    try {
      const res = await fetch(`${api}/api/carts/${userId}/update`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
              },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      if (!res.ok) throw new Error("Không thể cập nhật số lượng");
      const data = await res.json();
      setCart(data.items);
    } catch (err) {
      console.error("Lỗi khi cập nhật số lượng:", err);
    }
  };

  const removeFromCart = async (productId: any) => {
    try {
      const res = await fetch(`${api}/api/carts/${userId}/remove`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId, productId }),
      });
      if (!res.ok) throw new Error("Không thể xóa sản phẩm");
      const data = await res.json();
      setCart(data.items);
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getServiceFee = () => {
    return hasArrived ? 0 : 15000;
  };

  const getTotal = () => {
    return getSubtotal() + getServiceFee();
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleCheckout = async () => {
  console.log({            
            userId,
            items: cart,
            total: getTotal(),
            paymentMethod: selectedPayment,
            tableId: selectedTable,
          },null,2)
      if (!selectedPayment) {
        alert("Vui lòng chọn phương thức thanh toán");
        return;
      }

      if (!hasArrived && (!selectedTable || !selectedTime)) {
        alert("Vui lòng chọn bàn và thời gian đến");
        return;
      }
      try {
        const res = await fetch(`${api}/api/orders/${userId}/confirm`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            userId,
            items: cart,
            total: getTotal(),
            paymentMethod: selectedPayment,
            tableId: selectedTable,
          }),
        });
 
        if (!res.ok) throw new Error("Thanh toán thất bại");

        alert("Đặt hàng thành công! Cảm ơn bạn đã lựa chọn Café Mộc.");
        navigate("/");
      } catch (err) {
        console.error("Lỗi khi đặt hàng:", err);
      }
    };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Giỏ Hàng</h1>
          <p className="cart-subtitle">Quản lý đơn hàng của bạn tại Café Mộc</p>
        </div>
        
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h3 className="empty-title">Giỏ hàng trống</h3>
          <p className="empty-description">
            Hãy thêm một vài món ngon từ thực đơn của chúng tôi
          </p>
          <Link to="/menu" className="continue-shopping">
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    );
  }

  // console.log(cart);
  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Giỏ Hàng</h1>
        <p className="cart-subtitle">Quản lý đơn hàng của bạn tại Café Mộc</p>
      </div>

      {/* Check-in Section */}
      {hasArrived === null && (
        <div className="checkin-section">
          <h2 className="checkin-title">Bạn đã đến quán chưa?</h2>
          <p className="checkin-description">
            Vui lòng cho chúng tôi biết tình trạng của bạn để có trải nghiệm đặt hàng tốt nhất
          </p>
          <div className="checkin-options">
            <div
              className="checkin-option"
              onClick={() => setHasArrived(false)}
            >
              <div className="option-icon">🚶‍♂️</div>
              <div className="option-title">Chưa đến quán</div>
              <div className="option-description">
                Đặt trước và chọn bàn, chúng tôi sẽ chuẩn bị sẵn khi bạn đến
              </div>
            </div>
            <div
              className="checkin-option"
              onClick={() => setHasArrived(true)}
            >
              <div className="option-icon">🪑</div>
              <div className="option-title">Đã đến quán</div>
              <div className="option-description">
                Đang ngồi tại quán, chúng tôi sẽ phục vụ ngay lập tức
              </div>
            </div>
          </div>
        </div>
      )}

      {hasArrived !== null && (
        <div className="cart-layout">
          {/* Left Column - Cart Items & Options */}
          <div className="cart-main">
            {/* Cart Items */}
            <section className="cart-items-section">
              <h2 className="section-title">Sản Phẩm Đã Chọn</h2>
              <div className="cart-items">
                {cart.map((item: any) => (
                  <div key={item.id} className="cart-item">
                    <div
                      className="cart-item-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-header">
                        <div>
                          <h3 className="cart-item-name">{item.name}</h3>
                          <span className="cart-item-category">{item.category}</span>
                        </div>
                        <button
                          className="cart-item-remove"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="cart-item-details">
                        <div className="cart-item-price">
                          {formatPrice(item.price)}
                        </div>
                        <div className="cart-item-controls">
                          <div className="quantity-control">
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="quantity-input"
                              value={item.quantity}
                              readOnly
                            />
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <div className="cart-item-total">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Additional Options for Not Arrived */}
 
              <section className="additional-options">
                <div className="options-grid">
                  {/* Table Selection */}
                  <div className="option-group">
                    <h3 className="option-group-title">
                      <span>🪑</span>
                      {hasArrived ? "Hãy chọn bàn đang ngồi" : "Chọn Bàn"}
                    </h3>
                    <div className="tables-grid">
                      {tables.map((table: any) => (
                        <div
                          key={table.id}
                          className={`table-item ${selectedTable === table.id ? 'selected' : ''} ${table.status ? 'available' : 'unavailable'}`}
                          onClick={() => table.status === 'available' && setSelectedTable(table.id)}
                        >
                          {table.number}
                          {table.status === "unavailable" && <div style={{fontSize: '0.7rem', marginTop: '2px'}}>🔴</div>}
                          {table.status === "reserve" && <div style={{fontSize: '0.7rem', marginTop: '2px'}}>🔴</div>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {!hasArrived && (
                  <div className="option-group">
                    <h3 className="option-group-title">
                      <span>⏰</span>
                      Thời Gian Đến
                    </h3>
                    <div className="time-options">
                      {timeSlots.map((time, index) => (
                        <button
                          key={index}
                          className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </section>
            

            {/* Special Requests */}
            <section className="additional-options">
              <div className="option-group">
                <h3 className="option-group-title">
                  <span>📝</span>
                  Yêu Cầu Đặc Biệt
                </h3>
                <textarea
                  className="special-requests"
                  placeholder="Vui lòng cho chúng tôi biết nếu bạn có yêu cầu đặc biệt nào (ít đường, không đá, v.v.)"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <aside className="order-summary">
            <h2 className="summary-title">Tóm Tắt Đơn Hàng</h2>
            
            {/* Order Items */}
            <div className="summary-items">
              {cart.map((item: any) => (
                <div key={item.id} className="summary-item">
                  <span className="summary-item-name">{item.name}</span>
                  <span className="summary-item-quantity">x{item.quantity}</span>
                  <span className="summary-item-price">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="summary-totals">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>{formatPrice(getSubtotal())}</span>
              </div>
              {!hasArrived && (
                <div className="total-row">
                  <span>Phí phục vụ:</span>
                  <span>{formatPrice(getServiceFee())}</span>
                </div>
              )}
              <div className="total-row final">
                <span>Tổng cộng:</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="payment-methods">
              <h3 className="option-group-title" style={{marginBottom: '15px'}}>
                <span>💳</span>
                Phương Thức Thanh Toán
              </h3>
              <div className="payment-options">
                {paymentMethods.map(payment => (
                  <div
                    key={payment.id}
                    className={`payment-option ${selectedPayment === payment.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPayment(payment.id)}
                  >
                    <span className="payment-icon">{payment.icon}</span>
                    <div className="payment-info">
                      <div className="payment-name">{payment.name}</div>
                      <div className="payment-description">{payment.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={!selectedPayment}
            >
              {hasArrived ? 'Đặt Hàng Ngay' : 'Xác Nhận Đặt Trước'}
            </button>

            {/* Change Arrival Status */}
            <button
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid #4B3B2B',
                color: '#4B3B2B',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '15px',
                fontSize: '0.9rem'
              }}
              onClick={() => setHasArrived(null)}
            >
              Thay đổi trạng thái đến quán
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;