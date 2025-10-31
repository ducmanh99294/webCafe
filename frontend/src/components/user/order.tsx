// Orders.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/user/order.css';

const Orders: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [orders, setOrders] = useState<any>([]);

  const api = 'http://localhost:8080'
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const statusFilters = [
    { id: 'all', name: 'Tất cả', count: orders.length, color: '#4B3B2B' },
    { id: 'pending', name: 'Chờ xác nhận', count: orders.filter((order:any) => order.status === 'pending').length, color: '#FFA500' },
    { id: 'processing', name: 'Đang chuẩn bị', count: orders.filter((order:any) => order.status === 'processing').length, color: '#007BFF' },
    { id: 'completed', name: 'Hoàn thành', count: orders.filter((order:any) => order.status === 'completed').length, color: '#6C757D' },
    { id: 'cancelled', name: 'Đã hủy', count: orders.filter((order:any) => order.status === 'cancelled').length, color: '#DC3545' }
  ];

  const progressSteps = [
    { id: 'pending', label: 'Đã đặt', icon: '📝' },
    { id: 'processing', label: 'đang chuẩn bị', icon: '👨‍🍳' },
    { id: 'completed', label: 'Hoàn thành', icon: '🎉' }
  ];

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrder = async () => {
    try {
    const res = await fetch(`${api}/api/orders/${userId}`,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    if(res.ok) {
      const data = await res.json();
      console.log(data);
      setOrders(data);
    }
    } catch (err) {
      console.log(err)
    }
  } 
  
  const getProgressPercentage = (status: string) => {
    const statusProgress: Record<string, number> = {
      'pending': 25,
      'processing': 50,
      'completed': 100,
      'cancelled': 0
    };
    return statusProgress[status] || 0;
  };

  const getActiveStepIndex = (status: any) => {
    const stepIndex: Record<string, number> = {
      'pending': 0,
      'processing': 1,
      'preparing': 2,
      'completed': 4
    };
    return stepIndex[status] || 0;
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteOrder = async (orderId: any) => {
    try {
      const res = await fetch(`${api}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      })
      if(res.ok) {
        setOrders((prevOrders :any) =>
        prevOrders.map((order :any) =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
        alert("Hủy đơn hàng thành công");
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getStatusText = (status: any) => {
    const statusMap: Record<string, string> = {
      'pending': 'Chờ xác nhận',
      'processing': 'Đang xử lý',
      'completed': 'Đã hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">Lịch Sử Đơn Hàng</h1>
        <p className="orders-subtitle">
          Theo dõi và quản lý tất cả đơn hàng của bạn tại Café Mộc
        </p>
      </div>

      <div className="orders-layout">
        {/* Sidebar Filters */}
        <aside className="orders-sidebar">
          {/* Status Filter */}
          <div className="filter-section">
            <h3 className="filter-title">Trạng Thái</h3>
            <div className="status-filters">
              {statusFilters.map(status => (
                <div
                  key={status.id}
                  className={`status-filter ${selectedStatus === status.id ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(status.id)}
                >
                  <div 
                    className={`status-indicator ${status.id}`}
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="status-name">{status.name}</span>
                  <span className="status-count">{status.count}</span>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* Main Content */}
        <main className="orders-main">
          {orders.length > 0 ? (
            orders.map((order: any) => (
              <div key={order.id} className={`order-card ${order.status}`}>
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-number">{order.id.slice(7,10)}</h3>
                    <div className="order-date">
                      {formatDate(order.createdAt)}
                    </div>
                    <span className="order-type">{order.tableId ? ("tại quán"): ("mang về") }</span>
                  </div>
                  <div className={`order-status ${order.status}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                {/* Progress Bar for Active Orders */}
                {(order.status === 'pending' || order.status === 'processing' || 
                  order.status === 'completed') && (
                  <div className="order-progress">
                    <div className="progress-steps">
                      <div 
                        className="progress-bar"
                        style={{ width: `${getProgressPercentage(order.status)}%` }}
                      />
                      {progressSteps.map((step, index) => {
                        const isCompleted = index <= getActiveStepIndex(order.status);
                        const isActive = index === getActiveStepIndex(order.status);
                        return (
                          <div key={step.id} className="progress-step">
                            <div className={`step-icon ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                              {step.icon}
                            </div>
                            <div className={`step-label ${isActive ? 'active' : ''}`}>
                              {step.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order Details */}
                <div className="order-details">
                  <div className="order-items">
                    <h4>Sản phẩm ({order.items.length})</h4>
                    {order.items.map((item: any) => (
                      <div key={item.id} className="order-item">
                        <div
                          className="order-item-image"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <div className="order-item-info">
                          <div className="order-item-name">{item.name}</div>
                          <div className="order-item-meta">
                            Số lượng: {item.quantity}
                            {item.notes && ` • ${item.notes}`}
                          </div>
                        </div>
                        <div className="order-item-price">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <h4 className="summary-title">Thông tin đơn hàng</h4>
                    <div className="summary-row">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(order.totalPrice)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(order.totalPrice)}</span>
                    </div>
                    
                    <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#4B3B2B' }}>
                      <div><strong>Thanh toán:</strong> {order.paymentMethod}</div>
                      {order.table && <div><strong>Bàn:</strong> {order.table}</div>}
                      {order.arrivalTime && <div><strong>Giờ đến:</strong> {order.arrivalTime}</div>}
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="order-actions">                
                  <Link to={`/order/${order.id}`} className="action-btn secondary">
                    <span>👁️</span>
                    Xem Chi Tiết
                  </Link>

                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button
                      className="action-btn danger"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <span>❌</span>
                      Hủy Đơn Hàng
                    </button>
                  )}

                  {order.status === 'completed' && (
                    <button className="action-btn secondary">
                      <span>⭐</span>
                      Đánh Giá
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-orders">
              <div className="empty-icon">📦</div>
              <h3 className="empty-title">Không có đơn hàng nào</h3>
              <p className="empty-description">
                {selectedStatus !== 'all' 
                  ? `Không tìm thấy đơn hàng nào với trạng thái "${statusFilters.find(s => s.id === selectedStatus)?.name}"`
                  : 'Hãy thực hiện đơn hàng đầu tiên của bạn tại Café Mộc'
                }
              </p>
              <Link to="/menu" className="browse-menu">
                Khám Phá Thực Đơn
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Orders;