// Register.js
import React, { useState } from 'react';
import '../assets/css/register.css';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<any>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const api = 'http://localhost:8080';

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

const handleSubmit = async (e: any) => {
  e.preventDefault();
  setLoading(true);
  // kiểm tra hợp lệ đơn giản
  if (formData.password !== formData.confirmPassword) {
    setErrors({ confirmPassword: "Mật khẩu không khớp!" });
    return;
  }

  try {
    const res = await fetch(`${api}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "USER",
        createAt : new Date(),
        updateAt : new Date(),
      }),
    });
    
    const data = await res.json();
    console.log("Đăng ký thành công:", data);
    alert("Đăng ký thành công!");
    navigate("/login");
  } catch (err) {
    console.error("Lỗi khi đăng ký:", err);
    alert("Đăng ký thất bại: " + err);
  } finally {
    setLoading(false)
  }
};


  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h1 className="register-title">Tạo tài khoản mới</h1>
          <p className="register-subtitle">Tham gia cùng chúng tôi ngay hôm nay</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Tên *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="Nhập tên của bạn"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Số điện thoại *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Tạo mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <div className="password-requirements">Mật khẩu phải có ít nhất 6 ký tự</div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Xác nhận mật khẩu *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="terms-group">
            <input
              type="checkbox"
              id="terms"
              className="terms-checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="terms-label">
              Tôi đồng ý với <a href="/terms">Điều khoản sử dụng</a> và <a href="/privacy">Chính sách bảo mật</a>
            </label>
          </div>
          {errors.terms && <span className="error-message" style={{marginLeft: '28px'}}>{errors.terms}</span>}

          <button 
            type="submit" 
            className="register-button"
            disabled={!agreeToTerms}
          >
            {loading ? "Đang đăng kí" : "Đăng ký"}
          </button>
        </form>

        <div className="register-footer">
          <div className="login-link">
            Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;