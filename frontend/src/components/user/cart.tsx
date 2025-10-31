// Cart.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/user/cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [hasArrived, setHasArrived] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [roomElements, setRoomElements] = useState<any[]>([]);

  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState('');

  const api = 'http://localhost:8080'
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
        const initialRoomElements = [
      { id: 'reception1', type: 'reception', x: 50, y: 30, width: 200, height: 60, label: 'QUẦY LỄ TÂN' },
      { id: 'window1', type: 'window', x: 0, y: 110, width: 15, height: 200 },
      { id: 'window2', type: 'window', x: 400, y: 480, width: 180, height: 15 },
      { id: 'window3', type: 'window', x: 100, y: 480, width: 180, height: 15 },
      { id: 'window4', type: 'window', x: 760, y: 110, width: 15, height: 200 },
      { id: 'mainWalkway1', type: 'walkway', x: 340, y: 60, width: 20, height: 430 },
      { id: 'mainWalkway2', type: 'walkway', x: 690, y: 360, width: 20, height: 130 },
      { id: 'sideWalkway1', type: 'walkway', x: 0, y: 350, width: 780, height: 20 },
      { id: 'sideWalkway2', type: 'walkway', x: 250, y: 50, width: 530, height: 20 },
      { id: 'entrance1', type: 'entrance', x: 650, y: 460, width: 100, height: 30, label: 'Lối vào' },
    ];

    setRoomElements(initialRoomElements);
    fetchTable();

    fetchCart();
  }, []);

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

      if (!hasArrived && !selectedTable) {
        alert("Vui lòng chọn bàn");
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
            tableId: selectedTable.id,
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

  // console.log(tables);  
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
                <div className="option-group">
                    <h3 className="option-group-title">
                      <span>🪑</span>
                      {selectedTable
                        ? `Bàn đang chọn ${selectedTable.number}`
                        : hasArrived
                          ? "Hãy chọn bàn đang ngồi"
                          : "Chọn Bàn"}
                    </h3>
                </div>
                <div className="seat-map-container">
                  <div 
                    className="seat-map"
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {/* Các thành phần phòng */}
                    {roomElements.map(element => (
                      <div
                        key={element.id}
                        className={`room-element ${element.type} ${element.shape || ''}`}
                        style={{
                          left: `${element.x}px`,
                          top: `${element.y}px`,
                          width: `${element.width}px`,
                          height: `${element.height}px`,
                        }}
                        title={element.label || element.type}
                      >
                        {element.label}
                      </div>
                    ))}

                    {/* Các chỗ ngồi */}
                    <div className="tables-grid">
                    {tables.map(seat => (
                      <div
                        key={seat.id}
                        className={`seat-dot ${seat.status} ${selectedTable?.id === seat.id ? 'selected' : ''}`}
                        style={{ left: `${seat.x}px`, top: `${seat.y}px` }}
                        onClick={() => {
                          if (seat.status === 'available') {
                            setSelectedTable(seat);
                          } else {
                            alert('bàn này đã có người hoặc đã được đặt trước')
                          }
                        }}
                        title={`${seat.number} - ${seat.status === 'available' ? 'Còn trống' : seat.status === 'unavailable' ? 'Đã có người' : 'Đã đặt trước'}`}
                      >
                        {seat.number}
                      </div>
                    ))}
                    </div>

                  </div>
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