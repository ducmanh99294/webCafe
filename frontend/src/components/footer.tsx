// Footer.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/footer.css';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

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
              <span className="logo-text">Cafe</span>
            </Link>

            <p>
              A cozy place to relax and enjoy carefully crafted coffee.
              We create warm and memorable experiences in a comfortable
              atmosphere where everyone can feel at home.
            </p>

<div className="social-links">
  <a
    href="https://www.facebook.com/ucmanh.986571"
    className="social-link"
    aria-label="Facebook"
  >
    <Facebook size={22} strokeWidth={2} />
  </a>

  <a
    href="https://www.instagram.com/ducsmanh/"
    className="social-link"
    aria-label="Instagram"
  >
    <Instagram size={22} strokeWidth={2} />
  </a>
</div>
          </div>

          {/* Quick Links */}
          <div className="footer-section footer-links">
            <h3>Quick Links</h3>

            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Menu</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              {/* <li>
                <Link to="/contact">Contact</Link>
              </li> */}
              <li>
                <Link to="/news">Events</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section footer-contact">
            <h3>Contact Us</h3>

            <div className="contact-info">

              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span className="contact-text">
                  33 Xo Viet Nghe Tinh Street
                  <br />
                  Da Nang City, Vietnam
                </span>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span className="contact-text">
                  <a
                    href="tel:+84932550957"
                    style={{
                      color: 'inherit',
                      textDecoration: 'none'
                    }}
                  >
                    +84 932 550 957
                  </a>
                </span>
              </div>

              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <span className="contact-text">
                  <a
                    href="mailto:nguyenducmanh1809@gmail.com"
                    style={{
                      color: 'inherit',
                      textDecoration: 'none'
                    }}
                  >
                    nguyenducmanh1809@gmail.com
                  </a>
                </span>
              </div>

              <div className="contact-item">
                <span className="contact-icon">🕒</span>
                <span className="contact-text">
                  Monday - Sunday
                  <br />
                  7:00 AM - 10:00 PM
                </span>
              </div>

            </div>
          </div>

          {/* Additional Information */}
          <div className="footer-section newsletter">
            <p>
              <strong>Created by</strong>
            </p>
            <p>Nguyen Duc Manh</p>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">

          <div className="copyright">
            © {currentYear} Cafe. All rights reserved.
          </div>

          <div className="footer-bottom-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/sitemap">Sitemap</a>
          </div>

        </div>
      </div>
    </footer>

    {/* Back to Top Button */}
    <button
      className={`back-to-top ${
        showBackToTop ? 'visible' : ''
      }`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      ↑
    </button>
  </>
);
};

export default Footer;