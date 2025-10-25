// Login.js
import React, { useState } from 'react';
import '../assets/css/login.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const api = ''
  const navigate = useNavigate()
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

const handleSubmit = async (e: any) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch(`${api}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      setError(false);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      localStorage.setItem("role", data.role);
      if(data.role === "USER") {
        navigate("/");
      } else {
        navigate("/admin")
      }
    } else {
      setError(true);
    }
  } catch (err) {
    console.error("Lỗi khi đăng nhập:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1 className="login-title">Chào mừng trở lại</h1>
          <p className="login-subtitle">Đăng nhập để tiếp tục trải nghiệm</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Đang đăng nhập":"Đăng nhập"}
          </button>
          <div className="error">
            {error ? "sai mật khẩu hoặc tài khoản" : ""}
          </div>
          
        </form>

        <div className="login-footer">
          <a href="/forgot-password" className="forgot-password">
            Quên mật khẩu?
          </a>
          <div className="signup-link">
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;