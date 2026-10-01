// AdminOrders.js
import { useState, useEffect } from 'react';
import '../../assets/css/admin/order.css';
import { apiFetch } from '../../api/base'; 
import { denyAndRedirect, notify } from '../../utils/notify';
import Loading from '../Loading';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // const api = 'http://localhost:8080'
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
if (role !== 'ADMIN' || !token) {
  denyAndRedirect();
  return;
}
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/orders/admin`)
      if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");
      const data = await res.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Lọc đơn hàng
  useEffect(() => {
    let filtered = [...orders];

    if (filters.status !== "all") {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((order) => order.type === filters.type);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.customer?.name?.toLowerCase().includes(searchLower) ||
          order.customer?.phone?.includes(searchLower)
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [filters, orders]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 🔹 Cập nhật trạng thái đơn hàng bằng API
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
        console.log(JSON.stringify({ status: newStatus }))
      const res = await apiFetch(`/api/orders/admin/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Không thể cập nhật trạng thái đơn hàng");

      const updatedOrder = await res.json();

      // Cập nhật lại danh sách
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );

      notify.success("Update Success!");
    } catch (err) {
      console.error(err);
      notify.error("Update Failed!");
    }
  };

  // 🔹 Format helper
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const getStatusText = (status: string) => {
    const statusMap: any = {
      pending: "Chờ xác nhận",
      processing: "Đang chuẩn bị",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  // 🔹 Phân trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // console.log(orders)
  return (
    
    <div className="admin-orders">
        {/* Main Content - Thay đổi phần này để hiển thị orders */}
        <main className="dashboard-main">
          <div className="orders-main">
            <div className="orders-header">
              <h2 className="orders-title">Quản Lý Đơn Hàng</h2>
              <div className="orders-actions">
                <button className="filter-btn">🔧 Bộ lọc nâng cao</button>
                <button className="export-btn">📤 Xuất Excel</button>
              </div>
            </div>

            {/* Filters */}
            <div className="orders-filter">
              <div className="filter-group">
                <label className="filter-label">Trạng thái</label>
                <select 
                  className="filter-select"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="processing">Đang chuẩn bị</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Hình thức</label>
                <select 
                  className="filter-select"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="all">Tất cả hình thức</option>
                  <option value="dine-in">Tại quán</option>
                  <option value="takeaway">Mang về</option>
                  <option value="delivery">Giao hàng</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Tìm kiếm</label>
                <div className="search-box">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Mã đơn, tên KH, SĐT..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            {loading ? <Loading /> : (
              <div className="orders-table-container"> ... </div>
            )}

            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Mã Đơn</th>
                    <th>Khách Hàng</th>
                    <th>Tổng Tiền</th>
                    <th>Hình Thức</th>
                    <th>Trạng Thái</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map(order => (
                    <tr key={order.id}>
                      <td className="order-id">{order.id.slice(7,10).toUpperCase()}</td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-name">{order?.username}</div>
                          <div className="customer-contact">{order?.userPhone}</div>
                        </div>
                      </td>
                      <td className="order-amount">{formatPrice(order?.totalPrice)}</td>
                      <td>
                        <span className={`order-type ${order?.type}`}>
                            {order?.tableId ? ("Tại quán") : ("Mang đi")}
                        </span>
                      </td>
                      <td>
                        <span 
                          className={`order-status ${order?.status}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          {getStatusText(order?.status)}
                        </span>
                      </td>
                      <td>
                        <div className="order-actions">
                          <button 
                            className="action-btn view"
                            onClick={() => setSelectedOrder(order)}
                          >
                            👁️
                          </button>
                          {order.status === 'pending' && (
                            <>
                              <button 
                                className="action-btn edit"
                                onClick={() => updateOrderStatus(order.id, 'processing')}
                              >
                                ✅
                              </button>
                              <button 
                                className="action-btn cancel"
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              >
                                ❌
                              </button>
                            </>
                          )}
                          {order.status === 'processing' && (
                            <button 
                              className="action-btn edit"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                            >
                              👨‍🍳
                            </button>
                          )}
                          {order.status === 'completed' && (
                            <button 
                              className="action-btn complete"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                            >
                              ✅
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <div className="pagination-info">
                Hiển thị {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} trên {filteredOrders.length} đơn hàng
              </div>
              <div className="pagination-controls">
                <button 
                  className="page-btn"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button 
                  className="page-btn"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </main>
        {selectedOrder && (
        <div 
            className="order-details-modal"
            onClick={(e) => {
            if (e.target === e.currentTarget) {
                setSelectedOrder(null);
            }
            }}
        >
            <div className="modal-content">
            <div className="modal-header">
                <h2 className="modal-title">Chi Tiết Đơn Hàng {selectedOrder.id.slice(7,10)}</h2>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>

            <div style={{ display: 'grid', gap: '25px' }}>
                {/* --- Thông tin khách hàng --- */}
                <div>
                <h3 style={{ color: '#4B3B2B', marginBottom: '15px', fontSize: '1.2rem' }}>Thông tin khách hàng</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div><strong>Họ tên:</strong> {selectedOrder.user?.name}</div>
                    <div><strong>SĐT:</strong> {selectedOrder.user?.phone}</div>
                    <div><strong>Email:</strong> {selectedOrder.user?.email}</div>
                    <div><strong>Thời gian đặt:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</div>
                </div>
                {selectedOrder.tableId && (
                    <div style={{ marginTop: '10px' }}>
                    <strong>Bàn:</strong> {selectedOrder.tableId}
                    </div>
                )}
                </div>

                {/* --- Danh sách sản phẩm --- */}
                <div>
                <h3 style={{ color: '#4B3B2B', marginBottom: '15px', fontSize: '1.2rem' }}>Sản phẩm</h3>
                <div style={{ background: '#FDFDFD', borderRadius: '10px', padding: '20px' }}>
                    {selectedOrder.items.map((item: any, index: any) => (
                    <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom: index < selectedOrder.items.length - 1 ? '1px solid rgba(75, 59, 43, 0.1)' : 'none'
                    }}>
                        <div>
                        <div style={{ fontWeight: '500', color: '#4B3B2B' }}>{item.name}</div>
                        <div style={{ fontSize: '0.9rem', color: 'rgba(75, 59, 43, 0.7)' }}>
                            Số lượng: {item.quantity}
                        </div>
                        </div>
                        <div style={{ fontWeight: '600', color: '#A0522D' }}>
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND"
                        }).format(item.price * item.quantity)}
                        </div>
                    </div>
                    ))}
                    <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '15px',
                    marginTop: '15px',
                    borderTop: '2px solid #F5F0E6',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    color: '#A0522D'
                    }}>
                    <span>Tổng cộng:</span>
                    <span>
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
                        .format(selectedOrder.totalPrice)}
                    </span>
                    </div>
                </div>
                </div>

                {/* --- Nút hành động --- */}
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button className="action-btn cancel" onClick={() => setSelectedOrder(null)}>
                    Đóng
                </button>

                {selectedOrder.status === 'pending' && (
                    <>
                    <button 
                        className="action-btn edit"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    >
                        Xác nhận
                    </button>
                    <button 
                        className="action-btn cancel"
                        onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    >
                        Hủy đơn
                    </button>
                    </>
                )}

                {selectedOrder.status === 'processing' && (
                    <button 
                    className="action-btn complete"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                    >
                    Hoàn thành
                    </button>
                )}
                </div>
            </div>
            </div>
        </div>
)}

    </div>
  );
};


export default AdminOrders;