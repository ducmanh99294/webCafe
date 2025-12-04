// Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/header.css';
import { apiFetch } from '../api/base';

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState<any>({});
  const location = useLocation();
  const navigate = useNavigate();
  
  // const api = 'http://localhost:8080'
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
    fetchCart();
    const interval = setInterval(fetchCart, 2000);
    return () => clearInterval(interval);
  }, [userId]);

    const fetchUser = async () => {
    try{
      const res = await apiFetch(`/api/users/${userId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setUser(data);
      
      // setFormData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const fetchCart = async () => {
    if (!userId) return;
    try {
      const res = await apiFetch(`/api/carts/${userId}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Không thể lấy giỏ hàng");
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
  };
 
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setShowDropdown(false);
    // Redirect to home or login page if needed
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    navigate("/carts");
  };

  const totalQuantity = cart.reduce((sum: any, item: any) => sum + item.quantity, 0);

  const userInitial = (user && user.username) ? user.username[0] : 'T';

  const navItems = [
    { path: '/', label: 'Trang chủ' },
    { path: '/products', label: 'Thực đơn' },
    { path: '/about', label: 'Về chúng tôi' },
    { path: '/news', label: 'Tin tức' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <span className="logo-icon">☕</span>
          <span className="logo-text">Cafe nhóm 6</span>
        </Link>

        {/* Navigation */}
        <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* User Actions */}
          <div className="user-actions">
            {/* Cart Icon */}
            <div className="cart-icon" onClick={closeMobileMenu} >
              🛒
              {totalQuantity > 0 && (
                <span className="cart-count">{totalQuantity}</span>
              )}
            </div>

            {/* Auth Buttons or User Menu */}
            {!userId ? (
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className="login-btn"
                  onClick={closeMobileMenu}
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/register" 
                  className="register-btn"
                  onClick={closeMobileMenu}
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="user-menu">
                <div 
                  className="user-avatar"
                  onClick={toggleDropdown}
                >
                  {userInitial}
                </div>
                <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    👤 Hồ sơ
                  </Link>
                  <Link 
                    to="/orders" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    📦 Đơn hàng
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item"
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;