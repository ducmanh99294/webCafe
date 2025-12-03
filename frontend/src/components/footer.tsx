// Footer.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/footer.css';

const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            {/* About Section */}
            <div className="footer-section footer-about">
              <Link to="/" className="logo">
                <span className="logo-icon">☕</span>
                <span className="logo-text">Cafe nhóm 6</span>
              </Link>
              <p>
                Không gian thư giãn lý tưởng với hương vị cà phê đặc biệt. 
                Chúng tôi mang đến những trải nghiệm ấm áp và đáng nhớ 
                trong không gian mộc mạc, gần gũi với thiên nhiên.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  📘
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  📷
                </a>
                <a href="#" className="social-link" aria-label="Zalo">
                  💬
                </a>
                <a href="#" className="social-link" aria-label="TikTok">
                  🎵
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section footer-links">
              <h3>Liên kết nhanh</h3>
              <ul>
                <li><Link to="/">Trang chủ</Link></li>
                <li><Link to="/products">Thực đơn</Link></li>
                <li><Link to="/about">Về chúng tôi</Link></li>
                <li><Link to="/contact">Liên hệ</Link></li>
                <li><Link to="/news">Sự kiện</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section footer-contact">
              <h3>Liên hệ</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span className="contact-text">
                    33 Đường Xô Viết Nghệ Tỉnh<br />
                    TP. Đà Nẵng
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span className="contact-text">
                    <a href="tel:+84912345678" style={{color: 'inherit', textDecoration: 'none'}}>
                      +84 932 550 957
                    </a>
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span className="contact-text">
                    <a href="mailto:nguyenducmanh1809@gmail.com" style={{color: 'inherit', textDecoration: 'none'}}>
                      nguyenducmanh1809@gmail.com
                    </a>
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕒</span>
                  <span className="contact-text">
                    Thứ 2 - Chủ Nhật<br />
                    7:00 - 22:00
                  </span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="footer-section newsletter">
              <h3>Đăng ký nhận tin</h3>
              <p>
                Đăng ký để nhận thông tin khuyến mãi và sự kiện mới nhất từ Cafe Mộc.
              </p>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">
                  Đăng ký ngay
                </button>
              </form>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="copyright">
              © {currentYear} Cafe Mộc. Tất cả quyền được bảo lưu.
            </div>
            <div className="footer-bottom-links">
              <a href="/privacy">Chính sách bảo mật</a>
              <a href="/terms">Điều khoản sử dụng</a>
              <a href="/sitemap">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  );
};

export default Footer;