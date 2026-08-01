// src/components/Hero.jsx
import '../styles/components/Hero.css';
import heroVideo from '../assets/img/Swoyambhu2.mp4';  // ← Your video file

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
        <div className="hero-badge">🇳🇵 Nepal</div>
        <h1>Welcome to Nepal</h1>
        <p className="hero-subtitle">Discover the Himalayan Paradise</p>
        <p className="hero-description">
          From ancient temples to majestic mountains, experience Nepal like never before
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">Plan Your Trip 🚀</button>
          <button className="btn-secondary">Explore Heritage 🏛️</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;