// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import Hero from '../Components/Hero';
import '../styles/pages/Home.css';

// Import your images here
import patanImage from '../assets/img/Patan1.jpg';
import swayambhunathImage from '../assets/img/Swoyambu1.jpg';
import bhaktapurImage from '../assets/img/Bhaktapur1.jpg';
import pashupatinathImage from '../assets/img/Pashupati1.jpg';

const fallbackDestinations = [
  {
    id: 1,
    name: 'Patan Durbar Square',
    location: 'Lalitpur',
    description: 'Ancient Newari architecture with stunning golden gates and royal palaces',
    price: '$30',
    rating: '4.9',
    heritage: 'UNESCO World Heritage Site',
    image: patanImage
  },
  {
    id: 2,
    name: 'Swayambhunath Stupa',
    location: 'Kathmandu',
    description: 'The ancient Monkey Temple with all-seeing Buddha eyes overlooking the valley',
    price: '$5',
    rating: '4.8',
    heritage: 'UNESCO World Heritage Site',
    image: swayambhunathImage
  },
  {
    id: 3,
    name: 'Bhaktapur Durbar Square',
    location: 'Bhaktapur',
    description: 'Medieval city with 55-window palace and the famous Nyatapola Temple',
    price: '$25',
    rating: '4.9',
    heritage: 'UNESCO World Heritage Site',
    image: bhaktapurImage
  },
  {
    id: 4,
    name: 'Pashupatinath Temple',
    location: 'Kathmandu',
    description: 'Sacred Hindu temple complex on the banks of the Bagmati River',
    price: 'Free',
    rating: '4.7',
    heritage: 'UNESCO World Heritage Site',
    image: pashupatinathImage
  }
];

const Home = () => {
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

  return (
    <div className="home">
      <Hero />
      
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2>Cultural Heritage Sites</h2>
            <p>Discover Nepal's rich cultural legacy through its ancient monuments</p>
          </div>

          <div className="destinations-grid">
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
                    <button className="explore-btn">Visit Site</button>
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