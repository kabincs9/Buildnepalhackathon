// src/components/Hero.jsx
import '../styles/components/Hero.css';
import heroVideo from '../assets/img/Swoyambhu2.mp4';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-background">
        <video 
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <h1>Namaste!</h1>
        <p className="hero-subtitle">Land of Gods & Himalayas</p>
        <p className="hero-description">
          Where ancient temples meet towering peaks, and every corner tells a story of rich cultural heritage
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">Plan Your Journey</button>
          <button className="btn-secondary">Explore Heritage</button>
        </div>
      </div>

      {/* Stats Section Inside Hero */}
      <div className="hero-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">10+</span>
            <span className="stat-label">Heritage Sites</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">85+</span>
            <span className="stat-label">Cultural Monuments</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">250+</span>
            <span className="stat-label">Ancient Temples</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4+</span>
            <span className="stat-label">UNESCO Sites</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;