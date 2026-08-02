// src/pages/HeritageAudio.jsx
import { useState, useRef } from 'react';
import '../styles/pages/HeritageAudio.css';

// Import your images here
import patanImage from '../assets/img/Patan1.jpg';
import bhaktapurImage from '../assets/img/Bhaktapur1.jpg';
import kathmanduImage from '../assets/img/Kathmandu1.jpg';
import swayambhunathImage from '../assets/img/Swoyambu1.jpg';
import boudhanathImage from '../assets/img/Boudhanath.jpg';
import pashupatinathImage from '../assets/img/Pashupati1.jpg';
import changunarayanImage from '../assets/img/ChanguNarayan.jpg';

// Import videos
import pashupatinathVideo from '../assets/img/pashupatinathvid.mp4';
import bhaktapurVideo from '../assets/img/bhaktapurvid.mp4'; 

const heritageSites = [
  { 
    id: 1, 
    name: "Pashupatinath Temple", 
    description: "Sacred Hindu temple complex on the banks of the Bagmati River, one of the most important Shiva temples in the world",
    location: "Kathmandu",
    image: pashupatinathImage,
    video: pashupatinathVideo
  },
  { 
    id: 2, 
    name: "Patan Durbar Square", 
    description: "Ancient Newari palace complex with stunning golden gates and royal courtyards",
    location: "Lalitpur",
    image: patanImage,
    video: null
  },
  { 
    id: 3, 
    name: "Bhaktapur Durbar Square", 
    description: "Medieval city with 55-window palace and the famous Nyatapola Temple",
    location: "Bhaktapur",
    image: bhaktapurImage,
    video: bhaktapurVideo
  },
  { 
    id: 4, 
    name: "Kathmandu Durbar Square", 
    description: "Historic royal palace complex with the famous Kumari Ghar and Taleju Temple",
    location: "Kathmandu",
    image: kathmanduImage,
    video: null
  },
  { 
    id: 5, 
    name: "Swayambhunath Stupa", 
    description: "Ancient Monkey Temple with all-seeing Buddha eyes overlooking the valley",
    location: "Kathmandu",
    image: swayambhunathImage,
    video: null
  },
  { 
    id: 6, 
    name: "Boudhanath Stupa", 
    description: "Largest stupa in Nepal and one of the largest in the world",
    location: "Kathmandu",
    image: boudhanathImage,
    video: null
  },
  { 
    id: 7, 
    name: "Changu Narayan Temple", 
    description: "The oldest Hindu temple in the valley, dedicated to Lord Vishnu",
    location: "Bhaktapur",
    image: changunarayanImage,
    video: null
  }
];

const HeritageAudio = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const modalVideoRef = useRef(null);

  const handlePlayToggle = (id) => {
    const site = heritageSites.find(s => s.id === id);
    
    // If site has video, open modal
    if (site.video) {
      setSelectedVideo(site);
      return;
    }
    
    // No video available
    alert(`Video guide for ${site.name} is coming soon! 🎬`);
  };

  const handleCloseModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setSelectedVideo(null);
  };

  return (
    <div className="heritage-page">
      <div className="heritage-header">
        <h1>Kathmandu Valley Heritage Videos</h1>
        <p className="subtitle">
          Watch immersive videos of Nepal's 7 UNESCO World Heritage Sites
        </p>
      </div>
      
      <div className="heritage-grid">
        {heritageSites.map((site) => {
          const hasVideo = !!site.video;
          
          return (
            <div key={site.id} className="heritage-card">
              <div className="heritage-image-wrapper">
                <img 
                  src={site.image} 
                  alt={site.name}
                  className="heritage-image"
                />
                {!hasVideo && (
                  <div className="audio-coming-soon">
                    <span>🎬 Coming Soon</span>
                  </div>
                )}
                {hasVideo && (
                  <div className="video-play-hint">
                    <span>▶️ Watch Video</span>
                  </div>
                )}
              </div>
              <div className="heritage-content">
                <h3>{site.name}</h3>
                <p className="location">📍 {site.location}</p>
                <p className="description">{site.description}</p>
                
                <button 
                  className={`audio-btn ${!hasVideo ? 'disabled' : ''}`}
                  onClick={() => handlePlayToggle(site.id)}
                >
                  {hasVideo ? '▶️ Watch Video' : '🔜 Coming Soon'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={handleCloseModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={handleCloseModal}>
              ✕
            </button>
            <div className="video-modal-header">
              <h2>{selectedVideo.name}</h2>
              <p className="video-modal-location">📍 {selectedVideo.location}</p>
            </div>
            <div className="video-modal-player">
              <video
                ref={modalVideoRef}
                src={selectedVideo.video}
                className="video-modal-video"
                controls
                autoPlay
                playsInline
              />
            </div>
            <div className="video-modal-description">
              <p>{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeritageAudio;