// Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/user/home.css';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Home: React.FC = () => {
  gsap.registerPlugin(ScrollTrigger);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [_loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any>([])

  const api = ''
  const userId = localStorage.getItem("userId");

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Café Mộc - Không Gian Thư Giãn',
      subtitle: 'Nơi hương vị cà phê hòa quyện cùng không gian ấm cúng, mang đến những giây phút thư giãn tuyệt vời',
      buttonText: 'Khám Phá Ngay'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Hương Vị Đặc Biệt',
      subtitle: 'Trải nghiệm những ly cà phê được pha chế tinh tế từ những hạt cà phê rang xay chất lượng nhất',
      buttonText: 'Xem Thực Đơn'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2047&q=80',
      title: 'Không Gian Sáng Tạo',
      subtitle: 'Nơi gặp gỡ lý tưởng cho những cuộc trò chuyện, làm việc và sáng tạo không giới hạn',
      buttonText: 'Đặt Bàn Ngay'
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Workshop Pha Chế Cà Phê',
      description: 'Tham gia workshop để học cách pha chế những ly cà phê ngon tại nhà cùng các Barista chuyên nghiệp.',
      date: '15/12/2024 - 14:00',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      title: 'Đêm Nhạc Acoustic',
      description: 'Thưởng thức những bản nhạc acoustic nhẹ nhàng trong không gian ấm cúng vào tối thứ 7 hàng tuần.',
      date: 'Mỗi tối thứ 7 - 19:00',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      title: 'Triển Lãm Nghệ Thuật Đương Đại',
      description: 'Khám phá những tác phẩm nghệ thuật đương đại từ các họa sĩ trẻ tài năng trong không gian cafe.',
      date: '01/12 - 31/12/2024',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  useEffect(() => {
    fetchProduct();
    const interval = setInterval(fetchProduct, 5000);
    return () => clearInterval(interval);
    }, []);

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${api}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product: any, quantity: any) => {
    try {
        const res = await fetch(`${api}/api/carts/${userId}/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" ,
          Authorization: `Bearer ${localStorage.getItem("token")}`

        },
        body: JSON.stringify({
          userId,                     // id người dùng
          product,     // id sản phẩm
          quantity          // số lượng
        }),
      });
      
      if (product == null) {
      console.log("Dữ liệu sản phẩm (product) bị thiếu trong request.");
      }

      if (!res.ok) throw new Error("Không thể thêm sản phẩm vào giỏ");
      alert("Thêm vào giỏ hàng thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };
  
  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: any) => {
    setCurrentSlide(index);
  };

  // -----------------animation-------------------
    useEffect(() => {
    const tl = gsap.timeline({
        scrollTrigger: {
        trigger: ".events",
        start: "top 85%",
        end: "bottom 100%",
        toggleActions: "play none none reverse",
        scrub: 1.5,
        once: true,
        }
    });

    tl.fromTo(
      ".section-title",
      { x: 250, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
    )    
    .fromTo(
        ".section-subtitle",
        { x: 250, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
         "0.5"
    )
    .fromTo(
        ".event-card",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", stagger: 0.3 },
         ">"
    );
  }, []);

    useEffect(() => {
    const tl = gsap.timeline({
        scrollTrigger: {
        trigger: ".about-preview",
        start: "top 85%",
        end: "bottom 100%",
        toggleActions: "play none none reverse",
        scrub: 1.5,
        once: true,
        }
    });

    tl.fromTo(
      ".about-title",
      { x: -250, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: "power3.out"},
    )
    .fromTo(
      ".about-description",
      { x: -250, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 },
      "-=1.5"
    )
    .fromTo(
      ".about-button",
      { x: -250, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1 },
      "-=1.5"
    );
  }, []);

    useEffect(() => {
    if (products.length === 0) return;

    const tl = gsap.timeline({
        scrollTrigger: {
        trigger: ".content-section",
        start: "top 75%",
        end: "bottom 85%",
        toggleActions: "play none none reverse",
        scrub: 1.5,
        once: true
        }
    });

    tl.fromTo(
        ".section-title",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
    )
    .fromTo(
        ".section-subtitle",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
         "-=2.5"
    )

    .fromTo(
        ".product-card",
        { y: 30, opacity: 0 },
        {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        stagger: 0.3,
        },
        "-=0.5" 
    );

    return () => {
      tl.kill()
    };
    }, [products]);

  return (
    <div className="home-container">
      {/* Hero Slider Section */}
      <section className="hero-section">
        <div className="slider-container">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-overlay">
                <div className="slide-content">
                  <h1 className="slide-title">{slide.title}</h1>
                  <p className="slide-subtitle">{slide.subtitle}</p>
                  <Link to="/menu" className="slide-button">
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <button className="slider-arrow prev" onClick={prevSlide}>
          ‹
        </button>
        <button className="slider-arrow next" onClick={nextSlide}>
          ›
        </button>

        <div className="slider-controls">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="content-section">
        <div className="section-header">
          <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
          <p className="section-subtitle">
            Khám phá những thức uống đặc biệt được yêu thích nhất tại Café Mộc
          </p>
        </div>

        <div className="products-grid">
          {products.slice(0,6).map((product: any) => (
            <div key={product.id} className="product-card">
              <div 
                className="product-image"
                style={{ backgroundImage: `url(${product.image})` }}
              >
              </div>
              <div className="product-content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">
                  <div>
                    {product.discount ? (
                      <>
                    <span className="price">{formatPrice(product.discount)}</span>
                    {product.price && (
                      <span className="original-price">{product.price}</span>
                    )}                      
                      </>
                    ) : (
                    <span className="price">{formatPrice(product.price)}</span>
                    )}

                  </div>
                  <button 
                    className="add-to-cart"
                    onClick={() => addToCart(product, 1)}
                  >
                    Thêm Vào Giỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section className="content-section">
        <div className='events'>
        <div className="section-header">
          <h2 className="section-title">Sự Kiện & Hoạt Động</h2>
          <p className="section-subtitle">
            Cùng trải nghiệm những hoạt động thú vị và sự kiện đặc biệt tại Café Mộc
          </p>
        </div>

        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div 
                className="event-image"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className="event-content">
                <div className="event-date">
                  <span>📅</span>
                  {event.date}
                </div>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                <Link to="/events" className="event-button">
                  Tìm Hiểu Thêm
                </Link>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="content-section">
        <div className="about-preview">
          <h3 className="about-title">Câu Chuyện Café Mộc</h3>
          <p className="about-description">
            Từ năm 2015, Café Mộc đã trở thành điểm đến quen thuộc của những người yêu thích 
            không gian ấm cúng và hương vị cà phê đặc biệt. Chúng tôi không chỉ phục vụ 
            những ly cà phê ngon mà còn mang đến trải nghiệm văn hóa cà phê độc đáo, 
            nơi mỗi khách hàng đều tìm thấy sự thư giãn và cảm hứng.
          </p>
          <Link to="/about" className="about-button">
            Khám Phá Câu Chuyện Của Chúng Tôi
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;