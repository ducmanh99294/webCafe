// Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/user/home.css';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { apiFetch } from '../../api/base'; 
import { notify } from '../../utils/notify';
import Loading from '../Loading';

const Home: React.FC = () => {
  gsap.registerPlugin(ScrollTrigger);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any>([])

  const userId = localStorage.getItem("userId");

const slides = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'Coffee & Relaxing Space',
    subtitle:
      'Where the rich aroma of coffee meets a warm and cozy atmosphere, creating the perfect place to relax and unwind.',
    buttonText: 'Explore Now'
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: 'Exceptional Flavors',
    subtitle:
      'Enjoy expertly crafted coffee made from carefully selected, high-quality roasted beans.',
    buttonText: 'View Menu'
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2047&q=80',
    title: 'A Creative Space',
    subtitle:
      'The perfect place to meet, work, connect, and turn your ideas into reality.',
    buttonText: 'Reserve a Table'
  }
];

const events = [
  {
    id: 1,
    title: 'Coffee Brewing Workshop',
    description:
      'Join our workshop and learn how to brew delicious coffee at home with professional baristas.',
    date: 'December 15, 2024 - 2:00 PM',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    title: 'Acoustic Music Night',
    description:
      'Enjoy relaxing acoustic music in a warm and cozy atmosphere every Saturday evening.',
    date: 'Every Saturday - 7:00 PM',
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    title: 'Contemporary Art Exhibition',
    description:
      'Discover contemporary artworks from talented young artists displayed in our coffee shop.',
    date: 'December 1 - December 31, 2024',
    image:
      'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  }
];

  useEffect(() => {
    fetchProduct();
    const interval = setInterval(fetchProduct, 5000);
    return () => clearInterval(interval);
    }, []);

const fetchProduct = async () => {
  try {
    const res = await apiFetch(`/api/products`);
    setProducts(await res.json());
  } catch (err) {
  } finally {
    setLoading(false);
  }
};

const addToCart = async (product: any, quantity: number, size?: string) => {
  try {
    if (!product?.sizePrices?.length) {
      notify.warn("Please choose size");
      return;
    }

    if (!product.available) { notify.warn("Product is out of stock."); return; }

    const selectedSize = size ?? product.sizePrices[0].size;

    const chosen = product.sizePrices.find((s: any) => s.size === selectedSize);

    const res = await apiFetch(`/api/carts/${userId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        userId,
        product: { ...product, selectedSize: chosen },
        quantity,
      }),
    });

    if (!res.ok) {
      const msg = await res.text(); // message lỗi từ server
      throw new Error(msg || "Không thể thêm sản phẩm vào giỏ");
    }
    notify.success("Success!");
  } catch (err) {
    console.error("Lỗi khi thêm vào giỏ hàng:", err);
    notify.success("Failed");
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
                <Link to="/products" className="slide-button">
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
            className={`slider-dot ${
              index === currentSlide ? 'active' : ''
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>

    {/* Featured Products Section */}
    <section className="content-section">
      <div className="section-header">
        <h2 className="section-title">Featured Drinks</h2>
        <p className="section-subtitle">
          Discover our most popular drinks, carefully crafted for every coffee
          lover.
        </p>
      </div>
      {loading ? <Loading /> : (
        <div className="products-grid">
          {products.slice(0, 6).map((product: any) => (
            <div key={product.id} className="product-card">
              <div
                className="product-image"
                style={{ backgroundImage: `url(${product.image})` }}
              />

              <div className="product-content">
                <h3 className="product-name">{product.name}</h3>

                <p className="product-description">
                  {product.description}
                </p>

                <div className="product-price">
                  <div>
                    {product.discount > 0 ? (
                      <>
                        <span className="price">
                          {formatPrice(
                            (product.sizePrices[0].price *
                              (100 - product.discount)) /
                              100
                          )}
                        </span>

                        {product.sizePrices[0].price && (
                          <span className="original-price">
                            {formatPrice(product.sizePrices[0].price)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="price">
                        {formatPrice(product.sizePrices[0].price)}
                      </span>
                    )}
                  </div>

                  <button
                    className="add-to-cart"
                    onClick={() => addToCart(product, 1)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>

    {/* Events Section */}
    <section className="content-section">
      <div className="events">
        <div className="section-header">
          <h2 className="section-title">Events & Activities</h2>

          <p className="section-subtitle">
            Join us for exciting events and special activities designed to
            make your coffee experience more memorable.
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

                <p className="event-description">
                  {event.description}
                </p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* About Preview Section */}
    <section className="content-section">
      <div className="about-preview">
        <h3 className="about-title">About Our Coffee Shop</h3>

        <p className="about-description">
          We are passionate about creating a welcoming coffee experience where
          quality drinks, comfortable spaces, and great service come together.
          From carefully selected coffee beans to freshly prepared beverages,
          every order is made with attention to detail. Whether you are looking
          for a quick coffee or a relaxing place to meet friends, our coffee
          shop is here to make every visit enjoyable.
        </p>

        <Link to="/about" className="about-button">
          Discover Our Story
        </Link>
      </div>
    </section>
  </div>
)
};

export default Home; 