// News.tsx
import React, { useState } from 'react';
import '../../assets/css/user/news.css';

const News: React.FC = () => {
  const [visibleNews, setVisibleNews] = useState(6);

  const featuredNews = {
    id: 1,
    title: 'Café Mộc Opens a New Branch in District 2',
    excerpt:
      'After the success of our first three branches, Café Mộc officially opens its fourth branch in the new urban area of District 2, offering a modern relaxing space with a beautiful river view.',
    date: '20/12/2024',
    image:
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    badge: 'Latest News',
    category: 'Events'
  };

  const newsArticles = [
    {
      id: 1,
      title: 'December Coffee Art Brewing Workshop',
      excerpt:
        'Join our workshop to learn basic latte art techniques and professional coffee brewing skills from experienced baristas.',
      date: '18/12/2024',
      image:
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Workshop',
      category: 'Events'
    },
    {
      id: 2,
      title: 'Introducing Our New Central Highlands Specialty Coffee',
      excerpt:
        'Discover the unique flavors of specialty coffee from Vietnam’s highlands, produced through carefully selected harvesting and processing methods.',
      date: '15/12/2024',
      image:
        'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Product',
      category: 'News'
    },
    {
      id: 3,
      title: 'December Acoustic Night – "Coffee & Chill"',
      excerpt:
        'Enjoy warm acoustic performances in a romantic and cozy atmosphere at Café Mộc every weekend evening.',
      date: '12/12/2024',
      image:
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Music',
      category: 'Events'
    },
    {
      id: 4,
      title: 'Café Mộc Wins the "Creative Space 2024" Award',
      excerpt:
        'We are honored to receive a prestigious award recognizing our space as one of the most loved destinations for work and creativity in 2024.',
      date: '10/12/2024',
      image:
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Award',
      category: 'News'
    },
    {
      id: 5,
      title: 'Art Exhibition "Flavor & Colors"',
      excerpt:
        'Explore contemporary artworks inspired by coffee flavors and Vietnamese coffee culture.',
      date: '08/12/2024',
      image:
        'https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Art',
      category: 'Events'
    },
    {
      id: 6,
      title: 'New Brewing Recipe: Cinnamon Orange Cold Brew',
      excerpt:
        'Learn how to make a refreshing Cinnamon Orange Cold Brew, perfect for hot summer days.',
      date: '05/12/2024',
      image:
        'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Recipe',
      category: 'News'
    },
    {
      id: 7,
      title: 'New Member Promotion Program',
      excerpt:
        'Sign up today to receive 20% off your first order along with many other exciting membership benefits.',
      date: '03/12/2024',
      image:
        'https://images.unsplash.com/photo-1567306226416-28aae94fca0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Promotion',
      category: 'News'
    },
    {
      id: 8,
      title: 'Meet & Greet with a Coffee Roasting Expert',
      excerpt:
        'Meet and learn from a professional coffee roaster with more than 20 years of experience in the industry.',
      date: '01/12/2024',
      image:
        'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      badge: 'Meet & Greet',
      category: 'Events'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      day: '25',
      month: 'DEC',
      title: 'Advanced Latte Art Workshop',
      time: '14:00 - 16:00'
    },
    {
      id: 2,
      day: '28',
      month: 'DEC',
      title: 'Christmas Music Night',
      time: '19:00 - 21:00'
    },
    {
      id: 3,
      day: '31',
      month: 'DEC',
      title: 'New Year Countdown Party 2025',
      time: '20:00 - 00:30'
    },
    {
      id: 4,
      day: '05',
      month: 'JAN',
      title: 'New Art Exhibition',
      time: '09:00 - 21:00'
    }
  ];

  const categories = [
    { name: 'All', count: 12 },
    { name: 'Events', count: 6 },
    { name: 'News', count: 4 },
    { name: 'Promotions', count: 2 },
    { name: 'Workshop', count: 3 },
    { name: 'Art', count: 2 }
  ];

  const recentNews = newsArticles.slice(0, 3);

  const loadMore = () => {
    setVisibleNews(prev => prev + 3);
  };

  return (
    <div className="news-container">

      {/* Header */}
      <div className="news-header">
        <h1 className="news-title">
          News & Events
        </h1>

        <p className="news-subtitle">
          Stay updated with the latest news and special events at Café Mộc
        </p>
      </div>

      <div className="news-layout">

        {/* Main Content */}
        <div className="news-main">

          {/* Featured News */}
          <article className="featured-news">

            <div
              className="featured-image"
              style={{
                backgroundImage: `url(${featuredNews.image})`
              }}
            >
              <span className="featured-badge">
                {featuredNews.badge}
              </span>
            </div>

            <div className="featured-content">

              <div className="featured-date">
                <span>📅</span>
                {featuredNews.date} • {featuredNews.category}
              </div>

              <h2 className="featured-title">
                {featuredNews.title}
              </h2>

              <p className="featured-excerpt">
                {featuredNews.excerpt}
              </p>

              <button className="read-more">
                Read More
              </button>

            </div>
          </article>

          {/* Latest News */}
          <section className="news-section">

            <h2 className="section-title">
              Latest News
            </h2>

            <div className="news-grid">

              {newsArticles
                .slice(0, visibleNews)
                .map((article) => (
                  <article
                    key={article.id}
                    className="news-card"
                  >

                    <div
                      className="news-card-image"
                      style={{
                        backgroundImage: `url(${article.image})`
                      }}
                    >
                      <span className="news-card-badge">
                        {article.badge}
                      </span>
                    </div>

                    <div className="news-card-content">

                      <div className="news-card-date">
                        <span>📅</span>
                        {article.date}
                      </div>

                      <h3 className="news-card-title">
                        {article.title}
                      </h3>

                      <p className="news-card-excerpt">
                        {article.excerpt}
                      </p>

                      <a
                        href="#"
                        className="news-card-link"
                      >
                        Read More →
                      </a>

                    </div>
                  </article>
                ))}

            </div>
          </section>

          {/* Load More Button */}
          {visibleNews < newsArticles.length && (
            <div className="load-more">

              <button
                className="load-more-btn"
                onClick={loadMore}
              >
                Load More News
              </button>

            </div>
          )}

        </div>

        {/* Sidebar */}
        <aside className="news-sidebar">

          {/* Upcoming Events */}
          <div className="sidebar-widget">

            <h3 className="widget-title">
              Upcoming Events
            </h3>

            <div className="event-list">

              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="event-item"
                >

                  <div className="event-date">

                    <div className="event-day">
                      {event.day}
                    </div>

                    <div className="event-month">
                      {event.month}
                    </div>

                  </div>

                  <div className="event-info">

                    <div className="event-title">
                      {event.title}
                    </div>

                    <div className="event-time">
                      ⏰ {event.time}
                    </div>

                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* Categories */}
          <div className="sidebar-widget">

            <h3 className="widget-title">
              Categories
            </h3>

            <div className="category-list">

              {categories.map((category, index) => (
                <a
                  key={index}
                  href="#"
                  className="category-item"
                >
                  <span>
                    {category.name}
                  </span>

                  <span className="category-count">
                    {category.count}
                  </span>
                </a>
              ))}

            </div>
          </div>

          {/* Recent News */}
          <div className="sidebar-widget">

            <h3 className="widget-title">
              Recent News
            </h3>

            <div className="recent-news-list">

              {recentNews.map((article) => (
                <a
                  key={article.id}
                  href="#"
                  className="recent-news-item"
                >

                  <div
                    className="recent-news-image"
                    style={{
                      backgroundImage: `url(${article.image})`
                    }}
                  />

                  <div className="recent-news-content">

                    <div className="recent-news-title">
                      {article.title}
                    </div>

                    <div className="recent-news-date">
                      {article.date}
                    </div>

                  </div>

                </a>
              ))}

            </div>
          </div>

          {/* Newsletter */}
          <div className="sidebar-widget newsletter-widget">

            <h3 className="widget-title">
              Stay Updated
            </h3>

            <p>
              Subscribe to receive notifications about the latest news and events
            </p>

            <form className="newsletter-form">

              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                required
              />

              <button
                type="submit"
                className="newsletter-btn"
              >
                Subscribe Now
              </button>

            </form>

          </div>

        </aside>

      </div>
    </div>
  );
};

export default News;