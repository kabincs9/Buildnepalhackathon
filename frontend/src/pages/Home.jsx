// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from '../Components/Hero';
import '../styles/pages/Home.css';

const fallbackDestinations = [
  {
    id: 1,
    name: 'Everest Base Camp',
    location: 'Solukhumbu',
    image: '🏔️',
    description: 'Trek to the foot of the world\'s highest peak',
    price: '$1,200',
    rating: '4.9'
  },
  {
    id: 2,
    name: 'Pokhara Valley',
    location: 'Gandaki',
    image: '🌅',
    description: 'Peaceful lakes with stunning mountain views',
    price: '$450',
    rating: '4.8'
  },
  {
    id: 3,
    name: 'Kathmandu Durbar Square',
    location: 'Kathmandu',
    image: '🏛️',
    description: 'Ancient royal palace with rich history',
    price: '$25',
    rating: '4.7'
  },
  {
    id: 4,
    name: 'Chitwan National Park',
    location: 'Chitwan',
    image: '🐘',
    description: 'Wildlife safari with rhinos and tigers',
    price: '$350',
    rating: '4.8'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    country: '🇺🇸 USA',
    comment: 'Best travel experience of my life! The local guides were incredible and the scenery is beyond words.',
    rating: 5
  },
  {
    id: 2,
    name: 'Chen Wei',
    country: '🇨🇳 China',
    comment: 'Nepal\'s cultural heritage is amazing. The audio guides at the temples made history come alive!',
    rating: 5
  },
  {
    id: 3,
    name: 'Emma Thompson',
    country: '🇬🇧 UK',
    comment: 'The SOS feature gave us peace of mind during our trek. Highly recommended for all travelers!',
    rating: 5
  }
];

const Home = () => {
  const [stats, setStats] = useState({
    tourists: 0,
    destinations: 0,
    guides: 0,
    reviews: 0
  });
  const [destinations, setDestinations] = useState(fallbackDestinations);

  useEffect(() => {
    const targets = {
      tourists: 125000,
      destinations: 45,
      guides: 280,
      reviews: 4200
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      const progress = currentStep / steps;

      setStats({
        tourists: Math.floor(targets.tourists * progress),
        destinations: Math.floor(targets.destinations * progress),
        guides: Math.floor(targets.guides * progress),
        reviews: Math.floor(targets.reviews * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('/api/destinations');
        if (Array.isArray(response.data) && response.data.length > 0) {
          setDestinations(response.data);
        }
      } catch (error) {
        console.error('Backend fetch failed:', error);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="home">
      <Hero />

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{stats.tourists.toLocaleString()}+</span>
              <span className="stat-label">Happy Travelers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.destinations}+</span>
              <span className="stat-label">Destinations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.guides}+</span>
              <span className="stat-label">Local Guides</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.reviews.toLocaleString()}+</span>
              <span className="stat-label">5-Star Reviews</span>
            </div>
          </div>
        </div>
      </section>

      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Destinations</h2>
            <p>Discover the most breathtaking places in Nepal</p>
          </div>

          <div className="destinations-grid">
            {destinations.map((dest) => (
              <div key={dest.id} className="destination-card">
                <div className="destination-image">{dest.image}</div>
                <div className="destination-content">
                  <div className="destination-header">
                    <h3>{dest.name}</h3>
                    <span className="destination-rating">⭐ {dest.rating}</span>
                  </div>
                  <p className="destination-location">📍 {dest.location}</p>
                  <p className="destination-description">{dest.description}</p>
                  <div className="destination-footer">
                    <span className="destination-price">{dest.price}</span>
                    <button className="explore-btn">Explore</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-us-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose NepalTour</h2>
            <p>We make your Nepal experience unforgettable</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <h3>Heritage Audio</h3>
              <p>Listen to stories of Kathmandu&apos;s historic sites with our immersive audio guides</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Smart Trip Planner</h3>
              <p>AI-powered route optimization and budget planning for your perfect journey</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍👩‍👦</div>
              <h3>Local Guides</h3>
              <p>Connect with certified local guides who know Nepal inside out</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🆘</div>
              <h3>Emergency SOS</h3>
              <p>24/7 emergency support with one-touch SOS for your safety</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Easy Permits</h3>
              <p>Get all your trekking permits easily through our streamlined system</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Best Price Guarantee</h3>
              <p>We offer the best rates for tours, guides, and accommodations in Nepal</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Travelers Say</h2>
            <p>Real stories from real adventurers</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-stars">{'⭐'.repeat(testimonial.rating)}</div>
                <p className="testimonial-comment">"{testimonial.comment}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.country}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Get Travel Inspiration</h2>
            <p>Subscribe to our newsletter for exclusive deals and travel tips</p>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing! 🎉');
              }}
            >
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;