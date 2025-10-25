// AdminDashboard.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/admin/dashboard.css';

const AdminDashboard = () => {
  const [monthReports, setMonthReports] = useState<any>([]);
  const [productReport, setProductReport] = useState<any>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  
  const totalMonthlyRevenue = monthReports.reduce((sum: any, day: any) => sum + day.totalRevenue, 0);
  const newestOrder = orders.slice(-5).reverse();
  const api = ''
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== 'ADMIN' || !token) {
      alert('Bạn không có quyền truy cập trang này!');
      window.location.href = '/';
    };
    fetchReportByMonth();
    fetchTopSellProduct();
    fetchOrders();
  }, []);

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const fetchReportByMonth = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1
    try {
      const res = await fetch(`${api}/api/report/admin/${year}/${month}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if(res.ok) {
        const data = await res.json()
        setMonthReports(data)
      }
    } catch (err) {
      console.log(err)
    } 
  }

  const fetchTopSellProduct = async () => {
    try {
      const res = await fetch(`${api}/api/products/sellCount`)
      if(res.ok) {
        const data = await res.json()
        setProductReport(data)      
      }
    } catch (err) {
      console.log(err)
    }
  }

    const fetchOrders = async () => {
    try {
      const res = await fetch(`${api}/api/orders/admin`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
    }
  };

  const formatNumber = (number: any) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  const formatDate = (dateTime: string) =>
    new Date(dateTime).toLocaleString("vi-VN");

  console.log()
  return (
    <div className="admin-dashboard">
        {/* Main Content */}
        <main className="dashboard-main">
          {/* Stats Overview */}
          <section>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-icon primary">💰</div>
                <div className="stat-card-value">{formatPrice(totalMonthlyRevenue)}</div>
                <div className="stat-card-label">Tổng Doanh Thu Tháng Này</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon success">📦</div>
                <div className="stat-card-value">{formatNumber(orders.filter(order => order.status === 'completed').length)}</div>
                <div className="stat-card-label">Tổng Đơn Hàng Từ Trước Đến Nay</div>
              </div>
            </div>
          </section>

          {/* Charts Section */}
          <section className="charts-section">
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Doanh Thu 7 Ngày Qua</h3>
                <div className="chart-actions">
                  <button className="chart-action-btn">Tuần</button>
                  <button className="chart-action-btn">Tháng</button>
                  <button className="chart-action-btn">Năm</button>
                </div>
              </div>
              <div className="chart-container">
                <div className="placeholder-chart">
                  <div className="icon">📈</div>
                  <div>Biểu đồ doanh thu sẽ được hiển thị ở đây</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '5px', color: 'rgba(75, 59, 43, 0.5)' }}>
                    (Trong thực tế sẽ tích hợp với Chart.js hoặc D3.js)
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Hoạt Động Gần Đây</h3>
                <Link to="/admin/activities" className="view-all">Xem tất cả</Link>
              </div>
              <div className="activity-list">
                {newestOrder.map((order) => (
                  <div key={order.id} className="activity-item">
                    <div className="activity-avatar">
                      {order?.user?.name.slice(0, 2)}
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>{order?.user?.name}</strong> đã 
                          {order.status === 'pending' && ' yêu cầu xử lí '}
                          {order.status === 'processing' && ' yêu cầu hoàn tất '}
                          {order.status === 'completed' && ' hoàn thành '}
                          {order.status === 'cancelled' && ' hủy '}
                        đơn hàng <strong>{order.id.slice(7, 10)}</strong>
                      </div>
                      <div className="activity-time">{formatDate(order.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tables Section */}
          <section className="tables-section">
            <div className="table-card">
              <div className="table-header">
                <h3 className="table-title">Đơn Hàng Mới Nhất</h3>
                <Link to="/admin/orders" className="view-all">Xem tất cả</Link>
              </div>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Mã Đơn</th>
                    <th>Khách Hàng</th>
                    <th>Số Tiền</th>
                    <th>Trạng Thái</th>
                    <th>Thời Gian</th>
                  </tr>
                </thead>
                <tbody>
                  {newestOrder.map(order => (
                    <tr key={order.id}>
                      <td className="order-id">{order?.id.slice(7,10)}</td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-name">{order?.username}</div>
                          <div className="customer-contact">{order?.userPhone}</div>
                        </div>
                      </td>
                      <td className="order-amount">{formatPrice(order.totalPrice)}</td>
                      <td>
                        <span className={`order-status ${order.status}`}>
                          {order.status === 'pending' && 'Chờ xác nhận'}
                          {order.status === 'processing' && 'Đang xử lí'}
                          {order.status === 'completed' && 'Hoàn thành'}
                          {order.status === 'cancelled' && 'Đã hủy'}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-card">
              <div className="table-header">
                <h3 className="table-title">Sản Phẩm Bán Chạy</h3>
                <Link to="/admin/products" className="view-all">Xem tất cả</Link>
              </div>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Tên Sản Phẩm</th>
                    <th>Đã Bán</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {productReport.map((product: any) => (
                    <tr key={product.id}>
                      <td className="product-name">{product.name}</td>
                      <td>{formatNumber(product.sellCount)}</td>
                      <td className="product-price">{formatPrice(product.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

    </div>
  );
};

export default AdminDashboard;