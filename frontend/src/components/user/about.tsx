// About.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../../assets/css/user/about.css';

const About: React.FC = () => {
  gsap.registerPlugin(ScrollTrigger)
  const teamMembers = [
    {
      id: 1,
      name: 'Nguyễn Minh Anh',
      position: 'Founder & CEO',
      bio: 'Với hơn 10 năm kinh nghiệm trong ngành F&B và đam mê bất tận với cà phê, Minh Anh đã sáng lập Café Mộc với mong muốn mang đến không gian thư giãn lý tưởng cho cộng đồng.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      name: 'Trần Quốc Bảo',
      position: 'Head Barista',
      bio: 'Quốc Bảo là bậc thầy pha chế với nhiều giải thưởng quốc tế. Anh luôn tìm tòi và sáng tạo những công thức cà phê độc đáo.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      name: 'Lê Thị Hương',
      position: 'Quản lý Chuỗi',
      bio: 'Với kinh nghiệm quản lý nhiều chuỗi cafe lớn, Hương đảm bảo mọi chi nhánh của Café Mộc đều duy trì chất lượng dịch vụ tốt nhất.',
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 4,
      name: 'Phạm Văn Cường',
      position: 'Chuyên gia Rang xay',
      bio: 'Cường có hơn 15 năm kinh nghiệm trong việc lựa chọn và rang xay cà phê. Anh là người tạo nên hương vị đặc trưng của Café Mộc.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  const milestones = [
    {
      year: '2015',
      title: 'Thành lập Café Mộc',
      description: 'Khai trương chi nhánh đầu tiên tại Quận 1, TP.HCM với triết lý "Mang thiên nhiên vào không gian sống"'
    },
    {
      year: '2017',
      title: 'Mở rộng thương hiệu',
      description: 'Ra mắt 2 chi nhánh mới tại Quận 3 và Quận Phú Nhuận, khẳng định vị thế trong thị trường cafe'
    },
    {
      year: '2019',
      title: 'Phát triển sản phẩm',
      description: 'Giới thiệu dòng cà phê đặc sản và trà ướp sen cao cấp, mang đến trải nghiệm vị giác mới lạ'
    },
    {
      year: '2021',
      title: 'Đạt giải thưởng',
      description: 'Nhận giải "Không gian sáng tạo được yêu thích nhất" và "Cafe có hương vị độc đáo nhất"'
    },
    {
      year: '2023',
      title: 'Bước ra quốc tế',
      description: 'Khai trương chi nhánh đầu tiên tại Tokyo, Nhật Bản, mang hương vị cà phê Việt đến bạn bè quốc tế'
    },
    {
      year: '2024',
      title: 'Định hướng tương lai',
      description: 'Tiếp tục mở rộng với kế hoạch 5 chi nhánh mới và phát triển dòng sản phẩm mang về nhà'
    }
  ];

  const values = [
    {
      icon: '🌱',
      title: 'Thân thiện với môi trường',
      description: 'Chúng tôi sử dụng nguyên liệu hữu cơ, ống hút giấy và bao bì tái chế để bảo vệ môi trường.'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Cộng đồng',
      description: 'Café Mộc là nơi kết nối mọi người, tạo ra không gian chia sẻ và cảm hứng cho cộng đồng.'
    },
    {
      icon: '⭐',
      title: 'Chất lượng',
      description: 'Mỗi ly cà phê đều được chăm chút tỉ mỉ từ khâu chọn hạt đến kỹ thuật pha chế.'
    },
    {
      icon: '🎨',
      title: 'Sáng tạo',
      description: 'Không ngừng đổi mới trong thiết kế không gian và sáng tạo các loại thức uống độc đáo.'
    },
    {
      icon: '🤝',
      title: 'Tin cậy',
      description: 'Xây dựng mối quan hệ tin cậy với khách hàng thông qua sự trung thực và minh bạch.'
    },
    {
      icon: '💝',
      title: 'Đam mê',
      description: 'Truyền cảm hứng từ tình yêu cà phê và mong muốn mang đến trải nghiệm tuyệt vời nhất.'
    }
  ];

  //---------animation-----------
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
      {x: 250, opacity: 0},
      {x: 0, opacity: 1, duration: 3.5, ease: "power3.out"}
    )    
    .fromTo(
      ".section-subtitle",
      { x: 150, opacity: 0 },
      { x: 0, opacity: 1, duration: 3.5, ease: "power3.out" },
       "0.5"
    )
    .fromTo(
      ".story-text",
      { x: 250, opacity: 0 },
      { x: 0, opacity: 1, duration: 3.5, ease: "power3.out" ,stagger: 0.3},
       "0.5"
    )
    .fromTo(
      ".story-description",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 2.5, ease: "power3.out", stagger: 0.3 },
    );
    tl.fromTo(
      ".story-image",
      {y: 250, opacity: 0},
      {y: 0, opacity: 1, duration: 2.5, ease: "power3.out", stagger: 15}
    ); 
  })

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
  {x: 250, opacity: 0},
  {x: 0, opacity: 1, duration: 3.5, ease: "power3.out"}
)    
.fromTo(
  ".section-subtitle",
  { x: 150, opacity: 0 },
  { x: 0, opacity: 1, duration: 3.5, ease: "power3.out" },
   "0.5"
)
.fromTo(
  ".story-text",
  { x: 250, opacity: 0 },
  { x: 0, opacity: 1, duration: 3.5, ease: "power3.out" ,stagger: 0.3},
   "0.5"
)
.fromTo(
  ".story-description",
  { y: 80, opacity: 0 },
  { y: 0, opacity: 1, duration: 2.5, ease: "power3.out", stagger: 0.3 },
);
tl.fromTo(
  ".story-image",
  {y: 250, opacity: 0},
  {y: 0, opacity: 1, duration: 2.5, ease: "power3.out", stagger: 15}
); 
})
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">Câu Chuyện Café Mộc</h1>
          <p className="about-hero-subtitle">
            Hành trình 10 năm kiến tạo không gian thư giãn lý tưởng, 
            nơi hương vị cà phê hòa quyện cùng vẻ đẹp mộc mạc của thiên nhiên
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="section-header">
          <h2 className="section-title">Hành Trình Của Chúng Tôi</h2>
          <p className="section-subtitle">
            Từ ý tưởng nhỏ đến thương hiệu cafe được yêu thích
          </p>
        </div>

        <div className="story-content">
          <div className="story-text">
            <h3>Khởi nguồn từ tình yêu cà phê và thiên nhiên</h3>
            <p className="story-description">
              Năm 2015, Café Mộc được thành lập với mong muốn tạo ra một không gian 
              thư giãn lý tưởng - nơi mọi người có thể tận hưởng những ly cà phê chất lượng 
              trong môi trường gần gũi với thiên nhiên. Chúng tôi tin rằng cà phê ngon 
              không chỉ là hương vị mà còn là trải nghiệm tổng thể.
            </p>
            <p className="story-description">
              Từ chi nhánh đầu tiên nhỏ bé ở Quận 1, qua gần 10 năm phát triển, 
              Café Mộc đã trở thành điểm đến quen thuộc của hàng ngàn khách hàng 
              với 8 chi nhánh tại Việt Nam và 1 chi nhánh tại Nhật Bản.
            </p>
            <div className="story-highlight">
              <p className="highlight-text">
                "Mỗi ly cà phê là một câu chuyện, mỗi không gian là một cảm xúc"
              </p>
            </div>
          </div>
          <div className="story-image">
            <img 
              src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Không gian Café Mộc" 
            />
          </div>
        </div>

        <div className="story-content">
          <div className="story-image">
            <img 
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Quy trình rang xay cà phê" 
            />
          </div>
          <div className="story-text">
            <h3>Cam kết với chất lượng và hương vị</h3>
            <p className="story-description">
              Chúng tôi tự hào về quy trình khép kín từ lựa chọn hạt cà phê, 
              rang xay đến pha chế. Mỗi hạt cà phê đều được tuyển chọn kỹ lưỡng 
              từ các vùng cao nguyên Việt Nam, đảm bảo hương vị đặc trưng và chất lượng ổn định.
            </p>
            <p className="story-description">
              Đội ngũ barista của chúng tôi không ngừng học hỏi và sáng tạo 
              để mang đến những thức uống độc đáo, kết hợp giữa truyền thống và hiện đại.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="section-header">
          <h2 className="section-title">Giá Trị Cốt Lõi</h2>
          <p className="section-subtitle">
            Những nguyên tắc định hướng mọi hoạt động của chúng tôi
          </p>
        </div>

        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">
                {value.icon}
              </div>
              <h3 className="value-title">{value.title}</h3>
              <p className="value-description">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-header">
          <h2 className="section-title">Đội Ngũ Của Chúng Tôi</h2>
          <p className="section-subtitle">
            Những con người đam mê tạo nên thương hiệu Café Mộc
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div 
                className="team-image"
                style={{ backgroundImage: `url(${member.image})` }}
              />
              <div className="team-content">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-position">{member.position}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones Section */}
      <section className="milestones-section">
        <div className="section-header">
          <h2 className="section-title">Chặng Đường Phát Triển</h2>
          <p className="section-subtitle">
            Những cột mốc quan trọng trong hành trình của Café Mộc
          </p>
        </div>

        <div className="milestones-timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="milestone-item">
              <div className="milestone-year">{milestone.year}</div>
              <div className="milestone-content">
                <h3 className="milestone-title">{milestone.title}</h3>
                <p className="milestone-description">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Sẵn sàng trải nghiệm?</h2>
        <p className="cta-subtitle">
          Ghé thăm Café Mộc để cảm nhận không gian ấm cúng và thưởng thức 
          những ly cà phê được chăm chút tỉ mỉ
        </p>
        <div className="cta-buttons">
          <Link to="/menu" className="cta-button primary">
            Xem Thực Đơn
          </Link>
          <Link to="/contact" className="cta-button secondary">
            Liên Hệ Với Chúng Tôi
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;