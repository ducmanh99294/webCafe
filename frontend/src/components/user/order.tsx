// Orders.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/user/order.css';
import { apiFetch } from '../../api/base';
import { notify } from '../../utils/notify';
import Loading from '../Loading';

const Orders: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const statusFilters = [
    { id: 'all', name: 'All Orders', count: orders.length, color: '#4B3B2B' },
    {
      id: 'pending',
      name: 'Pending',
      count: orders.filter((order: any) => order.status === 'pending').length,
      color: '#FFA500'
    },
    {
      id: 'processing',
      name: 'Preparing',
      count: orders.filter((order: any) => order.status === 'processing').length,
      color: '#007BFF'
    },
    {
      id: 'completed',
      name: 'Completed',
      count: orders.filter((order: any) => order.status === 'completed').length,
      color: '#6C757D'
    },
    {
      id: 'cancelled',
      name: 'Cancelled',
      count: orders.filter((order: any) => order.status === 'cancelled').length,
      color: '#DC3545'
    }
  ];

  const progressSteps = [
    { id: 'pending', label: 'Order Placed', icon: '📝' },
    { id: 'processing', label: 'Preparing', icon: '👨‍🍳' },
    { id: 'completed', label: 'Completed', icon: '🎉' }
  ];

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await apiFetch(`/api/orders/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setOrders(data);
      }
    } catch (err) {
      console.log(err);
    } finally {  
      setLoading(false)
    };
  };

  const getProgressPercentage = (status: string) => {
    const statusProgress: Record<string, number> = {
      pending: 25,
      processing: 50,
      completed: 100,
      cancelled: 0
    };

    return statusProgress[status] || 0;
  };

  const getActiveStepIndex = (status: any) => {
    const stepIndex: Record<string, number> = {
      pending: 0,
      processing: 1,
      preparing: 2,
      completed: 4
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

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteOrder = async (orderId: any) => {
    try {
      const res = await apiFetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (res.ok) {
        setOrders((prevOrders: any) =>
          prevOrders.map((order: any) =>
            order.id === orderId
              ? { ...order, status: 'cancelled' }
              : order
          )
        );

        notify.success("Order cancelled successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusText = (status: any) => {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };

    return statusMap[status] || status;
  };

  return (
    <div className="orders-container">

      <div className="orders-header">
        <h1 className="orders-title">Order History</h1>

        <p className="orders-subtitle">
          Track and manage all your orders at Café Mộc
        </p>
      </div>

      <div className="orders-layout">

        {/* Sidebar Filters */}
        <aside className="orders-sidebar">

          {/* Status Filter */}
          <div className="filter-section">
            <h3 className="filter-title">Order Status</h3>

            <div className="status-filters">
              {statusFilters.map(status => (
                <div
                  key={status.id}
                  className={`status-filter ${
                    selectedStatus === status.id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedStatus(status.id)}
                >
                  <div
                    className={`status-indicator ${status.id}`}
                    style={{ backgroundColor: status.color }}
                  />

                  <span className="status-name">
                    {status.name}
                  </span>

                  <span className="status-count">
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* Main Content */}
        <main className="orders-main">

          {loading ? <Loading /> : 
          orders.length > 0 ? (
            orders.map((order: any) => (

              <div
                key={order.id}
                className={`order-card ${order.status}`}
              >

                {/* Order Header */}
                <div className="order-header">

                  <div className="order-info">

                    <h3 className="order-number">
                      {order.id.slice(7, 10)}
                    </h3>

                    <div className="order-date">
                      {formatDate(order.createdAt)}
                    </div>

                    <span className="order-type">
                      {order.tableId ? 'Dine-in' : 'Takeaway'}
                    </span>

                  </div>

                  <div className={`order-status ${order.status}`}>
                    {getStatusText(order.status)}
                  </div>

                </div>

                {/* Progress Bar for Active Orders */}
                {(order.status === 'pending' ||
                  order.status === 'processing' ||
                  order.status === 'completed') && (

                  <div className="order-progress">

                    <div className="progress-steps">

                      <div
                        className="progress-bar"
                        style={{
                          width: `${getProgressPercentage(order.status)}%`
                        }}
                      />

                      {progressSteps.map((step, index) => {

                        const isCompleted =
                          index <= getActiveStepIndex(order.status);

                        const isActive =
                          index === getActiveStepIndex(order.status);

                        return (
                          <div
                            key={step.id}
                            className="progress-step"
                          >

                            <div
                              className={`step-icon ${
                                isCompleted ? 'completed' : ''
                              } ${
                                isActive ? 'active' : ''
                              }`}
                            >
                              {step.icon}
                            </div>

                            <div
                              className={`step-label ${
                                isActive ? 'active' : ''
                              }`}
                            >
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

                    <h4>
                      Products ({order.items.length})
                    </h4>

                    {order.items.map((item: any) => (

                      <div
                        key={item.id}
                        className="order-item"
                      >

                        <div
                          className="order-item-image"
                          style={{
                            backgroundImage: `url(${item.image})`
                          }}
                        />

                        <div className="order-item-info">

                          <div className="order-item-name">
                            {item.name}
                          </div>

                          <div className="order-item-meta">
                            Quantity: {item.quantity}
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

                    <h4 className="summary-title">
                      Order Information
                    </h4>

                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>

                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: '15px',
                        fontSize: '0.9rem',
                        color: '#4B3B2B'
                      }}
                    >
                      <div>
                        <strong>Payment:</strong>{' '}
                        {order.paymentMethod}
                      </div>

                      {order.table && (
                        <div>
                          <strong>Table:</strong>{' '}
                          {order.table}
                        </div>
                      )}

                      {order.arrivalTime && (
                        <div>
                          <strong>Arrival Time:</strong>{' '}
                          {order.arrivalTime}
                        </div>
                      )}
                    </div>

                  </div>

                </div>

                {/* Order Actions */}
                <div className="order-actions">

                  <Link
                    to={`/order/${order.id}`}
                    className="action-btn secondary"
                  >
                    <span>👁️</span>
                    View Details
                  </Link>

                  {(order.status === 'pending' ||
                    order.status === 'confirmed') && (

                    <button
                      className="action-btn danger"
                      onClick={() =>
                        handleDeleteOrder(order.id)
                      }
                    >
                      <span>❌</span>
                      Cancel Order
                    </button>
                  )}

                  {order.status === 'completed' && (
                    <button className="action-btn secondary">
                      <span>⭐</span>
                      Leave a Review
                    </button>
                  )}

                </div>

              </div>
            ))
          ) : (

            <div className="empty-orders">

              <div className="empty-icon">
                📦
              </div>

              <h3 className="empty-title">
                No Orders Found
              </h3>

              <p className="empty-description">
                {selectedStatus !== 'all'
                  ? `No orders found with the status "${
                      statusFilters.find(
                        s => s.id === selectedStatus
                      )?.name
                    }"`
                  : 'Place your first order at Café Mộc'}
              </p>

              <Link
                to="/menu"
                className="browse-menu"
              >
                Explore Our Menu
              </Link>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Orders;