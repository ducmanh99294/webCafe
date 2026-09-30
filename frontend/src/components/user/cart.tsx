// Cart.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/user/cart.css';
import { apiFetch } from '../../api/base';

const Cart = () => {
  const navigate = useNavigate();
  const [hasArrived, setHasArrived] = useState<any>(null);
  const [cart, setCart] = useState<any>([]);
  const [tables, setTables] = useState<any>([]);
  const [roomElements, setRoomElements] = useState<any>([]);

  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>('');
  const [specialRequests, setSpecialRequests] = useState<any>('');

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const initialRoomElements = [
      {
        id: 'reception1',
        type: 'reception',
        x: 50,
        y: 30,
        width: 200,
        height: 60,
        label: 'RECEPTION'
      },
      {
        id: 'window1',
        type: 'window',
        x: 0,
        y: 110,
        width: 15,
        height: 200
      },
      {
        id: 'window2',
        type: 'window',
        x: 400,
        y: 480,
        width: 180,
        height: 15
      },
      {
        id: 'window3',
        type: 'window',
        x: 100,
        y: 480,
        width: 180,
        height: 15
      },
      {
        id: 'window4',
        type: 'window',
        x: 760,
        y: 110,
        width: 15,
        height: 200
      },
      {
        id: 'mainWalkway1',
        type: 'walkway',
        x: 340,
        y: 60,
        width: 20,
        height: 430
      },
      {
        id: 'mainWalkway2',
        type: 'walkway',
        x: 690,
        y: 360,
        width: 20,
        height: 130
      },
      {
        id: 'sideWalkway1',
        type: 'walkway',
        x: 0,
        y: 350,
        width: 780,
        height: 20
      },
      {
        id: 'sideWalkway2',
        type: 'walkway',
        x: 250,
        y: 50,
        width: 530,
        height: 20
      },
      {
        id: 'entrance1',
        type: 'entrance',
        x: 650,
        y: 460,
        width: 100,
        height: 30,
        label: 'ENTRANCE'
      },
    ];

    setRoomElements(initialRoomElements);
    fetchTable();
    fetchCart();
  }, []);

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash',
      description: 'Please pay at the counter',
      icon: '💵'
    },
    {
      id: 'card',
      name: 'Bank Transfer',
      description: 'Please scan the QR code below',
      icon: '💳'
    },
  ];

  const handleCheckout = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    if (!hasArrived && !selectedTable) {
      alert("Please select a table");
      return;
    }

    try {
      const res = await apiFetch(`/api/orders/${userId}/confirm`, {
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
          tableId: selectedTable?.id,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      alert("Order placed successfully! Thank you for choosing our cafe.");
      navigate("/");
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await apiFetch(`/api/carts/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unable to load cart");

      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchTable = async () => {
    try {
      const res = await apiFetch(`/api/tables`);

      if (!res.ok) throw new Error("Unable to load tables");

      const data = await res.json();
      setTables(data || []);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const updateQuantity = async (productId: any, newQuantity: any) => {
    try {
      const res = await apiFetch(`/api/carts/${userId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity
        }),
      });

      if (!res.ok) throw new Error("Unable to update quantity");

      const data = await res.json();
      setCart(data.items);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeFromCart = async (productId: any) => {
    try {
      const res = await apiFetch(`/api/carts/${userId}/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          productId
        }),
      });

      if (!res.ok) throw new Error("Unable to remove product");

      const data = await res.json();
      setCart(data.items);
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };

  const getSubtotal = () => {
    return cart.reduce(
      (total: any, item: any) => total + (item.price * item.quantity),
      0
    );
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

  if (cart.length === 0) {
    return (
      <div className="cart-container">

        <div className="cart-header">
          <h1 className="cart-title">
            Shopping Cart
          </h1>

          <p className="cart-subtitle">
            Manage your order and table reservation
          </p>
        </div>

        <div className="empty-cart">

          <div className="empty-icon">
            🛒
          </div>

          <h3 className="empty-title">
            Your Cart is Empty
          </h3>

          <p className="empty-description">
            Add some delicious drinks from our menu
          </p>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">

      <div className="cart-header">

        <h1 className="cart-title">
          Shopping Cart
        </h1>

        <p className="cart-subtitle">
          Manage your order at Café Mộc
        </p>

      </div>

      {/* Check-in Section */}
      {hasArrived === null && (
        <div className="checkin-section">

          <h2 className="checkin-title">
            Have you arrived at the café?
          </h2>

          <p className="checkin-description">
            Please let us know your current status so we can provide
            the best ordering experience.
          </p>

          <div className="checkin-options">

            <div
              className="checkin-option"
              onClick={() => setHasArrived(false)}
            >
              <div className="option-icon">
                🚶‍♂️
              </div>

              <div className="option-title">
                Not Yet Arrived
              </div>

              <div className="option-description">
                Order in advance and select a table.
                We will have your order ready when you arrive.
              </div>
            </div>

            <div
              className="checkin-option"
              onClick={() => setHasArrived(true)}
            >
              <div className="option-icon">
                🪑
              </div>

              <div className="option-title">
                Already at the Café
              </div>

              <div className="option-description">
                I am currently at the café and would like
                my order served right away.
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

              <h2 className="section-title">
                Selected Products
              </h2>

              <div className="cart-items">

                {cart.map((item: any) => (
                  <div
                    key={item.id}
                    className="cart-item"
                  >

                    <div
                      className="cart-item-image"
                      style={{
                        backgroundImage: `url(${item.image})`
                      }}
                    />

                    <div className="cart-item-info">

                      <div className="cart-item-header">

                        <div>

                          <h3 className="cart-item-name">
                            {item.name}
                          </h3>

                          <span className="cart-item-category">
                            {item.category}
                          </span>

                        </div>

                        <button
                          className="cart-item-remove"
                          onClick={() =>
                            removeFromCart(item.productId)
                          }
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
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
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
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </button>

                          </div>

                          <div className="cart-item-total">
                            {formatPrice(
                              item.price * item.quantity
                            )}
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            </section>

            {/* Table Selection */}
            <section className="additional-options">

              <div className="option-group">

                <h3 className="option-group-title">

                  <span>🪑</span>

                  {selectedTable
                    ? `Selected Table ${selectedTable.number}`
                    : hasArrived
                      ? "Please select your current table"
                      : "Select a Table"
                  }

                </h3>

              </div>

              <div className="seat-map-container">

                <div
                  className="seat-map"
                  onDragOver={(e) => e.preventDefault()}
                >

                  {/* Room Elements */}
                  {roomElements.map((element: any) => (
                    <div
                      key={element.id}
                      className={`room-element ${element.type} ${
                        element.shape || ''
                      }`}
                      style={{
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        width: `${element.width}px`,
                        height: `${element.height}px`,
                      }}
                      title={
                        element.label || element.type
                      }
                    >
                      {element.label}
                    </div>
                  ))}

                  {/* Tables */}
                  <div className="tables-grid">

                    {tables.map((seat: any) => (

                      <div
                        key={seat.id}
                        className={`seat-dot ${seat.status} ${
                          selectedTable?.id === seat.id
                            ? 'selected'
                            : ''
                        }`}
                        style={{
                          left: `${seat.x}px`,
                          top: `${seat.y}px`
                        }}
                        onClick={() => {

                          if (seat.status === 'available') {
                            setSelectedTable(seat);
                          } else {
                            alert(
                              'This table is occupied or has already been reserved.'
                            );
                          }

                        }}
                        title={`${seat.number} - ${
                          seat.status === 'available'
                            ? 'Available'
                            : seat.status === 'unavailable'
                              ? 'Occupied'
                              : 'Reserved'
                        }`}
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
                  Special Requests
                </h3>

                <textarea
                  className="special-requests"
                  placeholder="Let us know if you have any special requests (less sugar, no ice, etc.)"
                  value={specialRequests}
                  onChange={(e) =>
                    setSpecialRequests(e.target.value)
                  }
                />

              </div>

            </section>

          </div>

          {/* Right Column - Order Summary */}
          <aside className="order-summary">

            <h2 className="summary-title">
              Order Summary
            </h2>

            {/* Order Items */}
            <div className="summary-items">

              {cart.map((item: any) => (

                <div
                  key={item.id}
                  className="summary-item"
                >

                  <span className="summary-item-name">
                    {item.name}
                  </span>

                  <span className="summary-item-quantity">
                    x{item.quantity}
                  </span>

                  <span className="summary-item-price">
                    {formatPrice(
                      item.price * item.quantity
                    )}
                  </span>

                </div>

              ))}

            </div>

            {/* Totals */}
            <div className="summary-totals">

              <div className="total-row">
                <span>Subtotal:</span>
                <span>
                  {formatPrice(getSubtotal())}
                </span>
              </div>

              {!hasArrived && (
                <div className="total-row">
                  <span>Service Fee:</span>
                  <span>
                    {formatPrice(getServiceFee())}
                  </span>
                </div>
              )}

              <div className="total-row final">

                <span>Total:</span>

                <span>
                  {formatPrice(getTotal())}
                </span>

              </div>

            </div>

            {/* Payment Methods */}
            <div className="payment-methods">

              <h3
                className="option-group-title"
                style={{ marginBottom: '15px' }}
              >
                <span>💳</span>
                Payment Method
              </h3>

              <div className="payment-options">

                {paymentMethods.map(payment => (

                  <div
                    key={payment.id}
                    className={`payment-option ${
                      selectedPayment === payment.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedPayment(payment.id)
                    }
                  >

                    <span className="payment-icon">
                      {payment.icon}
                    </span>

                    <div className="payment-info">

                      <div className="payment-name">
                        {payment.name}
                      </div>

                      <div className="payment-description">
                        {payment.description}
                      </div>

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
              {hasArrived
                ? 'Place Order Now'
                : 'Confirm Pre-Order'}
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
              Change Arrival Status
            </button>

          </aside>

        </div>
      )}

    </div>
  );
};

export default Cart;