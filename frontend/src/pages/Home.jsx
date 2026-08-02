// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Hero from '../Components/Hero';
import '../styles/pages/Home.css';

// Import your images here
import patanImage from '../assets/img/Patan1.jpg';
import swayambhunathImage from '../assets/img/Swoyambu1.jpg';
import bhaktapurImage from '../assets/img/Bhaktapur1.jpg';
import pashupatinathImage from '../assets/img/Pashupati1.jpg';
import kathmanduImage from '../assets/img/Kathmandu1.jpg';
import boudhanathImage from '../assets/img/Boudhanath.jpg';
import changunarayanImage from '../assets/img/ChanguNarayan.jpg';

const fallbackDestinations = [
  {
    id: 1,
    name: 'Patan Durbar Square',
    location: 'Lalitpur',
    description: 'Ancient Newari architecture with stunning golden gates and royal palaces',
    price: 'Rs. 1000 | $7.50',
    rating: '4.9',
    heritage: 'UNESCO World Heritage Site',
    image: patanImage,
    path: '/heritage-audio'
  },
  {
    id: 2,
    name: 'Swayambhunath Stupa',
    location: 'Kathmandu',
    description: 'The ancient Monkey Temple with all-seeing Buddha eyes overlooking the valley',
    price: 'Rs. 200 | $1.50',
    rating: '4.8',
    heritage: 'UNESCO World Heritage Site',
    image: swayambhunathImage,
    path: '/heritage-audio'
  },
  {
    id: 3,
    name: 'Bhaktapur Durbar Square',
    location: 'Bhaktapur',
    description: 'Medieval city with 55-window palace and the famous Nyatapola Temple',
    price: 'Rs. 1500 | $15.00',
    rating: '4.9',
    heritage: 'UNESCO World Heritage Site',
    image: bhaktapurImage,
    path: '/heritage-audio'
  },
  {
    id: 4,
    name: 'Pashupatinath Temple',
    location: 'Kathmandu',
    description: 'Sacred Hindu temple complex on the banks of the Bagmati River',
    price: 'Rs. 1000 | $7.50',
    rating: '4.7',
    heritage: 'UNESCO World Heritage Site',
    image: pashupatinathImage,
    path: '/heritage-audio'
  },
  {
    id: 5,
    name: 'Kathmandu Durbar Square',
    location: 'Kathmandu',
    description: 'Historic royal palace complex with the famous Kumari Ghar and Taleju Temple',
    price: 'Rs. 750 | $5.60',
    rating: '4.8',
    heritage: 'UNESCO World Heritage Site',
    image: kathmanduImage,
    path: '/heritage-audio'
  },
  {
    id: 6,
    name: 'Boudhanath Stupa',
    location: 'Kathmandu',
    description: 'Largest stupa in Nepal and one of the largest in the world, a center of Tibetan Buddhism',
    price: 'Rs. 150 | $1.10',
    rating: '4.9',
    heritage: 'UNESCO World Heritage Site',
    image: boudhanathImage,
    path: '/heritage-audio'
  },
  {
    id: 7,
    name: 'Changu Narayan Temple',
    location: 'Bhaktapur',
    description: 'The oldest Hindu temple in the valley, dedicated to Lord Vishnu with ancient inscriptions',
    price: 'Rs. 100 | $0.75',
    rating: '4.6',
    heritage: 'UNESCO World Heritage Site',
    image: changunarayanImage,
    path: '/heritage-audio'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState(fallbackDestinations);

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

  const handleVisitSite = (path) => {
    navigate(path);
  };

  return (
    <div className="home">
      <Hero />
      
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2>Cultural Heritage Sites</h2>
            <p>Discover Nepal's rich cultural legacy through its ancient monuments</p>
          </div>

          <div className="destinations-scroll-wrapper">
            <div className="destinations-scroll">
              {destinations.map((dest) => (
                <div key={dest.id} className="destination-card">
                  <div className="destination-image-wrapper">
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      className="destination-image"
                    />
                    <div className="destination-image-overlay">
                      <span className="heritage-tag">{dest.heritage}</span>
                    </div>
                  </div>
                  <div className="destination-content">
                    <div className="destination-header">
                      <h3>{dest.name}</h3>
                      <span className="destination-rating">⭐ {dest.rating}</span>
                    </div>
                    <p className="destination-location">📍 {dest.location}</p>
                    <p className="destination-description">{dest.description}</p>
                    <div className="destination-footer">
                      <span className="destination-price">{dest.price}</span>
                      <button 
                        className="explore-btn"
                        onClick={() => handleVisitSite(dest.path)}
                      >
                        Visit Site
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="why-us-section">
        <div className="container">
          <div className="section-header">
            <h2>Experience Nepali Heritage</h2>
            <p>Immerse yourself in thousands of years of culture</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <h3>Ancient Architecture</h3>
              <p>Explore intricately carved temples, palaces, and stupas dating back centuries</p>
            </div>
            <div className="feature-card">
              <h3>Cultural Festivals</h3>
              <p>Experience vibrant Newari festivals, traditional dances, and living heritage</p>
            </div>
            <div className="feature-card">
              <h3>Spiritual Traditions</h3>
              <p>Visit sacred sites and participate in ancient rituals and ceremonies</p>
            </div>
            <div className="feature-card">
              <h3>Traditional Crafts</h3>
              <p>Witness centuries-old craftsmanship in woodcarving, metalwork, and thankas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;