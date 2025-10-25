
import React, { useState } from 'react';
import '../../assets/css/user/news.css';

const News: React.FC = () => {
  const [visibleNews, setVisibleNews] = useState(6);

  const featuredNews = {
    id: 1,
    title: 'Café Mộc Khai Trương Chi Nhánh Mới Tại Quận 2',
    excerpt: 'Sau thành công của 3 chi nhánh đầu tiên, Café Mộc chính thức khai trương chi nhánh thứ 4 tại khu đô thị mới Quận 2, mang đến không gian thư giãn hiện đại với view sông tuyệt đẹp.',
    date: '20/12/2024',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    badge: 'Tin Mới',
    category: 'Sự Kiện'
  };

  const newsArticles = [
    {
      id: 1,
      title: 'Workshop Pha Chế Cà Phê Nghệ Thuật Tháng 12',
      excerpt: 'Tham gia workshop để học cách tạo hình latte art cơ bản và kỹ thuật pha chế từ các barista chuyên nghiệp.',
      date: '18/12/2024',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Workshop',
      category: 'Sự Kiện'
    },
    {
      id: 2,
      title: 'Giới Thiệu Dòng Cà Phê Đặc Sản Tây Nguyên Mới',
      excerpt: 'Khám phá hương vị độc đáo của dòng cà phê đặc sản từ vùng cao nguyên Việt Nam, với quy trình thu hoạch và chế biến đặc biệt.',
      date: '15/12/2024',
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Sản Phẩm',
      category: 'Tin Tức'
    },
    {
      id: 3,
      title: 'Đêm Nhạc Acoustic "Coffee & Chill" Tháng 12',
      excerpt: 'Cùng thưởng thức những bản nhạc acoustic ấm áp trong không gian lãng mạn tại Café Mộc vào mỗi tối cuối tuần.',
      date: '12/12/2024',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Âm Nhạc',
      category: 'Sự Kiện'
    },
    {
      id: 4,
      title: 'Café Mộc Nhận Giải Thưởng "Không Gian Sáng Tạo 2024"',
      excerpt: 'Vinh dự nhận giải thưởng danh giá cho không gian làm việc và sáng tạo được yêu thích nhất năm 2024.',
      date: '10/12/2024',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Giải Thưởng',
      category: 'Tin Tức'
    },
    {
      id: 5,
      title: 'Triển Lãm Nghệ Thuật "Hương Vị & Màu Sắc"',
      excerpt: 'Khám phá những tác phẩm nghệ thuật đương đại lấy cảm hứng từ hương vị cà phê và văn hóa cà phê Việt.',
      date: '08/12/2024',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Nghệ Thuật',
      category: 'Sự Kiện'
    },
    {
      id: 6,
      title: 'Công Thức Pha Chế Mới: Cold Brew Cam Quế',
      excerpt: 'Hướng dẫn pha chế món Cold Brew Cam Quế thơm ngon, hoàn hảo cho những ngày hè oi bức.',
      date: '05/12/2024',
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Công Thức',
      category: 'Tin Tức'
    },
    {
      id: 7,
      title: 'Chương Trình Ưu Đãi Thành Viên Mới',
      excerpt: 'Đăng ký thành viên ngay hôm nay để nhận ưu đãi 20% cho hóa đơn đầu tiên và nhiều quyền lợi hấp dẫn khác.',
      date: '03/12/2024',
      image: 'https://images.unsplash.com/photo-1567306226416-28aae94fca0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Khuyến Mãi',
      category: 'Tin Tức'
    },
    {
      id: 8,
      title: 'Buổi Giao Lưu Với Nghệ Nhân Rang Cà Phê',
      excerpt: 'Gặp gỡ và học hỏi từ nghệ nhân rang cà phê với hơn 20 năm kinh nghiệm trong ngành.',
      date: '01/12/2024',
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Giao Lưu',
      category: 'Sự Kiện'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      day: '25',
      month: 'TH12',
      title: 'Workshop Latte Art Nâng Cao',
      time: '14:00 - 16:00'
    },
    {
      id: 2,
      day: '28',
      month: 'TH12',
      title: 'Đêm Nhạc Giáng Sinh',
      time: '19:00 - 21:00'
    },
    {
      id: 3,
      day: '31',
      month: 'TH12',
      title: 'Countdown Party 2025',
      time: '20:00 - 00:30'
    },
    {
      id: 4,
      day: '05',
      month: 'TH1',
      title: 'Triển Lãm Nghệ Thuật Mới',
      time: '09:00 - 21:00'
    }
  ];

  const categories = [
    { name: 'Tất Cả', count: 12 },
    { name: 'Sự Kiện', count: 6 },
    { name: 'Tin Tức', count: 4 },
    { name: 'Khuyến Mãi', count: 2 },
    { name: 'Workshop', count: 3 },
    { name: 'Nghệ Thuật', count: 2 }
  ];

  const recentNews = newsArticles.slice(0, 3);

  const loadMore = () => {
    setVisibleNews(prev => prev + 3);
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h1 className="news-title">Tin Tức & Sự Kiện</h1>
        <p className="news-subtitle">
          Cập nhật những tin tức mới nhất và sự kiện đặc biệt tại Café Mộc
        </p>
      </div>

      <div className="news-layout">
        {/* Main Content */}
        <div className="news-main">
          {/* Featured News */}
          <article className="featured-news">
            <div 
              className="featured-image"
              style={{ backgroundImage: `url(${featuredNews.image})` }}
            >
              <span className="featured-badge">{featuredNews.badge}</span>
            </div>
            <div className="featured-content">
              <div className="featured-date">
                <span>📅</span>
                {featuredNews.date} • {featuredNews.category}
              </div>
              <h2 className="featured-title">{featuredNews.title}</h2>
              <p className="featured-excerpt">{featuredNews.excerpt}</p>
              <button className="read-more">Đọc Tiếp</button>
            </div>
          </article>

          {/* Latest News */}
          <section className="news-section">
            <h2 className="section-title">Tin Mới Cập Nhật</h2>
            <div className="news-grid">
              {newsArticles.slice(0, visibleNews).map((article) => (
                <article key={article.id} className="news-card">
                  <div 
                    className="news-card-image"
                    style={{ backgroundImage: `url(${article.image})` }}
                  >
                    <span className="news-card-badge">{article.badge}</span>
                  </div>
                  <div className="news-card-content">
                    <div className="news-card-date">
                      <span>📅</span>
                      {article.date}
                    </div>
                    <h3 className="news-card-title">{article.title}</h3>
                    <p className="news-card-excerpt">{article.excerpt}</p>
                    <a href="#" className="news-card-link">
                      Đọc tiếp →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Load More Button */}
          {visibleNews < newsArticles.length && (
            <div className="load-more">
              <button className="load-more-btn" onClick={loadMore}>
                Xem Thêm Tin Tức
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="news-sidebar">
          {/* Upcoming Events */}
          <div className="sidebar-widget">
            <h3 className="widget-title">Sự Kiện Sắp Diễn Ra</h3>
            <div className="event-list">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-date">
                    <div className="event-day">{event.day}</div>
                    <div className="event-month">{event.month}</div>
                  </div>
                  <div className="event-info">
                    <div className="event-title">{event.title}</div>
                    <div className="event-time">⏰ {event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="sidebar-widget">
            <h3 className="widget-title">Danh Mục</h3>
            <div className="category-list">
              {categories.map((category, index) => (
                <a key={index} href="#" className="category-item">
                  <span>{category.name}</span>
                  <span className="category-count">{category.count}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Recent News */}
          <div className="sidebar-widget">
            <h3 className="widget-title">Tin Gần Đây</h3>
            <div className="recent-news-list">
              {recentNews.map((article) => (
                <a key={article.id} href="#" className="recent-news-item">
                  <div 
                    className="recent-news-image"
                    style={{ backgroundImage: `url(${article.image})` }}
                  />
                  <div className="recent-news-content">
                    <div className="recent-news-title">{article.title}</div>
                    <div className="recent-news-date">{article.date}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="sidebar-widget newsletter-widget">
            <h3 className="widget-title">Nhận Tin Mới</h3>
            <p>Đăng ký để nhận thông báo về tin tức và sự kiện mới nhất</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Đăng Ký Ngay
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default News;