// About.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../../assets/css/user/about.css';

const About: React.FC = () => {
  gsap.registerPlugin(ScrollTrigger);

  const milestones = [
    {
      year: '2015',
      title: 'Café Mộc Founded',
      description:
        'Opened the first branch in District 1, Ho Chi Minh City with the philosophy "Bringing nature into living spaces."'
    },
    {
      year: '2017',
      title: 'Brand Expansion',
      description:
        'Opened two new branches in District 3 and Phu Nhuan District, strengthening our presence in the coffee market.'
    },
    {
      year: '2019',
      title: 'Product Development',
      description:
        'Introduced specialty coffee and premium lotus-infused tea, bringing new and unique flavors to our customers.'
    },
    {
      year: '2021',
      title: 'Award Recognition',
      description:
        'Received awards for "Most Loved Creative Space" and "Most Unique Coffee Flavor."'
    },
    {
      year: '2023',
      title: 'Going International',
      description:
        'Opened our first international branch in Tokyo, Japan, bringing the flavors of Vietnamese coffee to customers around the world.'
    },
    {
      year: '2024',
      title: 'Looking Ahead',
      description:
        'Continuing to expand with plans for five new branches and the development of a retail product line for customers to enjoy at home.'
    }
  ];

  const values = [
    {
      icon: '🌱',
      title: 'Eco-Friendly',
      description:
        'We use organic ingredients, paper straws, and recyclable packaging to help protect the environment.'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Community',
      description:
        'Café Mộc is a place where people connect, share experiences, and find inspiration together.'
    },
    {
      icon: '⭐',
      title: 'Quality',
      description:
        'Every cup of coffee is carefully crafted, from selecting the beans to perfecting the brewing process.'
    },
    {
      icon: '🎨',
      title: 'Creativity',
      description:
        'We continuously innovate in our space design and create unique beverages that inspire our customers.'
    },
    {
      icon: '🤝',
      title: 'Trust',
      description:
        'We build lasting relationships with our customers through honesty, transparency, and dedication.'
    },
    {
      icon: '💝',
      title: 'Passion',
      description:
        'We are inspired by our love for coffee and our passion for creating the best possible experience for every customer.'
    }
  ];

  // --------- Animation -----------

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".story-section",
        start: "top 50%",
        end: "bottom 100%",
        toggleActions: "play none none reverse",
        scrub: 1.5,
        once: true
      }
    });

    tl.fromTo(
      ".section-title",
      { x: 250, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 3.5,
        ease: "power3.out"
      }
    )
      .fromTo(
        ".section-subtitle",
        { x: 150, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 3.5,
          ease: "power3.out"
        },
        "0.5"
      )
      .fromTo(
        ".story-text",
        { x: 250, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 3.5,
          ease: "power3.out",
          stagger: 0.3
        },
        "0.5"
      )
      .fromTo(
        ".story-description",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 2.5,
          ease: "power3.out",
          stagger: 0.3
        }
      );

    tl.fromTo(
      ".story-image",
      { y: 250, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 2.5,
        ease: "power3.out",
        stagger: 15
      }
    );
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".values-section",
        start: "top 50%",
        end: "bottom 100%",
        toggleActions: "play none none reverse",
        scrub: 1.5,
        once: true
      }
    });

    tl.fromTo(
      ".section-title",
      { x: 250, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 3.5,
        ease: "power3.out"
      }
    )
      .fromTo(
        ".section-subtitle",
        { x: 150, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 3.5,
          ease: "power3.out"
        },
        "0.5"
      )
      .fromTo(
        ".story-text",
        { x: 250, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 3.5,
          ease: "power3.out",
          stagger: 0.3
        },
        "0.5"
      )
      .fromTo(
        ".story-description",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 2.5,
          ease: "power3.out",
          stagger: 0.3
        }
      );

    tl.fromTo(
      ".story-image",
      { y: 250, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 2.5,
        ease: "power3.out",
        stagger: 15
      }
    );
  }, []);

  return (
    <div className="about-container">

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">
            The Story of Café Mộc
          </h1>

          <p className="about-hero-subtitle">
            A 10-year journey of creating the perfect space to relax,
            where the rich flavor of coffee blends with the natural beauty
            of a warm and rustic atmosphere.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">

        <div className="section-header">
          <h2 className="section-title">
            Our Journey
          </h2>

          <p className="section-subtitle">
            From a small idea to a beloved coffee brand
          </p>
        </div>

        <div className="story-content">

          <div className="story-text">

            <h3>
              Born from a Love of Coffee and Nature
            </h3>

            <p className="story-description">
              In 2015, Café Mộc was founded with the vision of creating
              an ideal place to relax — where people could enjoy
              high-quality coffee in a natural and welcoming environment.
              We believe that great coffee is not only about flavor,
              but also about the overall experience.
            </p>

            <p className="story-description">
              From our first small branch in District 1, after nearly
              10 years of growth, Café Mộc has become a familiar
              destination for thousands of customers, with 8 branches
              across Vietnam and 1 branch in Japan.
            </p>

            <div className="story-highlight">
              <p className="highlight-text">
                "Every cup of coffee tells a story, and every space
                creates an emotion."
              </p>
            </div>

          </div>

          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Café Mộc interior"
            />
          </div>

        </div>

        <div className="story-content">

          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Coffee roasting process"
            />
          </div>

          <div className="story-text">

            <h3>
              Our Commitment to Quality and Flavor
            </h3>

            <p className="story-description">
              We take pride in our carefully controlled process,
              from selecting coffee beans and roasting them to
              crafting the perfect cup. Every coffee bean is
              carefully sourced from Vietnam's highlands to ensure
              distinctive flavors and consistent quality.
            </p>

            <p className="story-description">
              Our baristas continuously learn and innovate to create
              unique beverages that combine traditional techniques
              with modern creativity.
            </p>

          </div>

        </div>

      </section>

      {/* Values Section */}
      <section className="values-section">

        <div className="section-header">

          <h2 className="section-title">
            Our Core Values
          </h2>

          <p className="section-subtitle">
            The principles that guide everything we do
          </p>

        </div>

        <div className="values-grid">

          {values.map((value, index) => (
            <div
              key={index}
              className="value-card"
            >

              <div className="value-icon">
                {value.icon}
              </div>

              <h3 className="value-title">
                {value.title}
              </h3>

              <p className="value-description">
                {value.description}
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* Milestones Section */}
      <section className="milestones-section">

        <div className="section-header">

          <h2 className="section-title">
            Our Milestones
          </h2>

          <p className="section-subtitle">
            Key milestones throughout the journey of Café Mộc
          </p>

        </div>

        <div className="milestones-timeline">

          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="milestone-item"
            >

              <div className="milestone-year">
                {milestone.year}
              </div>

              <div className="milestone-content">

                <h3 className="milestone-title">
                  {milestone.title}
                </h3>

                <p className="milestone-description">
                  {milestone.description}
                </p>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* CTA Section */}
      <section className="cta-section">

        <h2 className="cta-title">
          Ready to Experience It?
        </h2>

        <p className="cta-subtitle">
          Visit Café Mộc to enjoy our warm atmosphere and
          carefully crafted coffee made with passion and dedication.
        </p>

        <div className="cta-buttons">

          <Link
            to="/products"
            className="cta-button primary"
          >
            View Menu
          </Link>

          <Link
            to="https://www.facebook.com/ucmanh.986571"
            className="cta-button secondary"
          >
            Contact Us
          </Link>

        </div>

      </section>

    </div>
  );
};

export default About;