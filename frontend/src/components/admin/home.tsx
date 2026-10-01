// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import '../../assets/css/admin/dashboard.css';
import AdminOrders from './order';
import AdminDashboard from './dashboard';
import AdminProduct from './product';
import AdminTables from './table';
import AdminReport from './report';
import AdminEmployee from './employee';
import AdminManagerUser from './user';
import { apiFetch } from '../../api/base'; 
import AdminChat from './chat';
import { denyAndRedirect } from '../../utils/notify';

const Home: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeNav, setActiveNav] = useState('dashboard');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any>([]);
  const [tables, setTables] = useState<any[]>([]);
  
  // const api = 'http://localhost:8080'
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const dashboardStats = {
    totalRevenue: 38450000,
    totalOrders: 1247,
    totalCustomers: 892,
    averageOrder: 30800,
    todayRevenue: 1850000,
    todayOrders: 67,
    pendingOrders: 23,
    lowStockProducts: 8
  };

  const adminNavItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: '📊', badge: null },
    { id: 'orders', label: 'Đơn hàng', icon: '📦', badge: orders.length },
    { id: 'products', label: 'Sản phẩm', icon: '☕', badge: products.length },
    { id: 'tables', label: 'Chỗ ngồi', icon: '👥', badge: tables.length },
    { id: 'reports', label: 'Báo cáo', icon: '📈', badge: null },
    { id: 'users', label: 'khách hàng', icon: '📦', badge: users.length },
    { id: 'employees', label: 'Nhân viên', icon: '👨‍💼', badge: employees.length },
    { id: 'chat', label: 'Tin nhắn', icon: '💬', badge: null }
  ];

  useEffect(() => {
if (role !== 'ADMIN' || !token) {
  denyAndRedirect();
  return;
}
    fetchOrders();
    fetchProducts();
    fetchUsers();
    fetchEmployee();
    fetchTables();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await apiFetch(`/api/orders/admin`);

      if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await apiFetch(`/api/products`);

      if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiFetch(`/api/users/admin`);

      if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await apiFetch(`/api/tables`);
      if (res.ok) {
        const data = await res.json();
        console.log('Tables:', data);
        setTables(data);
      }
    } catch (err) {
      console.log('Error fetching tables:', err);
    }
  };

  const fetchEmployee = async () => {
    try {
      const res = await apiFetch(`/api/employees/admin`)
      const data = await res.json();
      if(data) {
        setEmployees(data);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Dashboard</h1>
        </div>
        <div className="admin-info">
          <div className="current-time">
            {currentTime.toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            <br />
            {currentTime.toLocaleTimeString('vi-VN')}
          </div>
          <div className="admin-actions">
            <button className="admin-btn primary">📊 Báo Cáo Hôm Nay</button>
            <button className="admin-btn secondary">🔄 Cập Nhật</button>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          {/* Navigation */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Điều Hướng</h3>
            <nav className="admin-nav">
              {adminNavItems.map(item => (
                <div
                  key={item.id}
                  className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                  onClick={() => setActiveNav(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </div>
              ))}
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Thống Kê Nhanh</h3>
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-icon orders">📦</div>
                <div className="stat-info">
                  <div className="stat-value">{dashboardStats.todayOrders}</div>
                  <div className="stat-label">Đơn hôm nay</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon revenue">💰</div>
                <div className="stat-info">
                  <div className="stat-value">{formatPrice(dashboardStats.todayRevenue)}</div>
                  <div className="stat-label">Doanh thu hôm nay</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon customers">👥</div>
                <div className="stat-info">
                  <div className="stat-value">{dashboardStats.pendingOrders}</div>
                  <div className="stat-label">Đơn chờ xử lý</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon products">⚠️</div>
                <div className="stat-info">
                  <div className="stat-value">{dashboardStats.lowStockProducts}</div>
                  <div className="stat-label">SP sắp hết hàng</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
        {activeNav === 'dashboard' && <AdminDashboard />}
        {activeNav === 'orders' && <AdminOrders />}
        {activeNav === 'products' && <AdminProduct />}
        {activeNav === 'reports' && <AdminReport />}
        {activeNav === 'users' && <AdminManagerUser />}
        {activeNav === 'employees' && <AdminEmployee />}
        {activeNav === 'tables' && <AdminTables />}
        {activeNav === 'chat' && <AdminChat />}
        </main>
      </div>
    </div>
  );
};

export default Home;