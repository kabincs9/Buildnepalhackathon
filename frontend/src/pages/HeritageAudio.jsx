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

// Import audio files
import bhaktapurAudio from '../assets/audio/BhaktapurAudio.mp3';

const heritageSites = [
  { 
    id: 1, 
    name: "Patan Durbar Square", 
    description: "Ancient Newari palace complex with stunning golden gates and royal courtyards",
    location: "Lalitpur",
    image: patanImage,
    audio: null // No audio yet
  },
  { 
    id: 2, 
    name: "Bhaktapur Durbar Square", 
    description: "Medieval city with 55-window palace and the famous Nyatapola Temple",
    location: "Bhaktapur",
    image: bhaktapurImage,
    audio: bhaktapurAudio // Actual audio file
  },
  { 
    id: 3, 
    name: "Kathmandu Durbar Square", 
    description: "Historic royal palace complex with the famous Kumari Ghar and Taleju Temple",
    location: "Kathmandu",
    image: kathmanduImage,
    audio: null // No audio yet
  },
  { 
    id: 4, 
    name: "Swayambhunath Stupa", 
    description: "Ancient Monkey Temple with all-seeing Buddha eyes overlooking the valley",
    location: "Kathmandu",
    image: swayambhunathImage,
    audio: null // No audio yet
  },
  { 
    id: 5, 
    name: "Boudhanath Stupa", 
    description: "Largest stupa in Nepal and one of the largest in the world",
    location: "Kathmandu",
    image: boudhanathImage,
    audio: null // No audio yet
  },
  { 
    id: 6, 
    name: "Pashupatinath Temple", 
    description: "Sacred Hindu temple complex on the banks of the Bagmati River",
    location: "Kathmandu",
    image: pashupatinathImage,
    audio: null // No audio yet
  },
  { 
    id: 7, 
    name: "Changu Narayan Temple", 
    description: "The oldest Hindu temple in the valley, dedicated to Lord Vishnu",
    location: "Bhaktapur",
    image: changunarayanImage,
    audio: null // No audio yet
  }
];

const HeritageAudio = () => {
  const [playing, setPlaying] = useState(null);
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const audioRefs = useRef({});

  const handlePlayToggle = (id) => {
    const site = heritageSites.find(s => s.id === id);
    
    // If no audio file, show alert
    if (!site.audio) {
      alert(`Audio guide for ${site.name} is coming soon! 🎧`);
      return;
    }

    // If already playing, pause
    if (playing === id) {
      if (audioRefs.current[id]) {
        audioRefs.current[id].pause();
        audioRefs.current[id].currentTime = 0;
      }
      setPlaying(null);
      setProgress(prev => ({ ...prev, [id]: 0 }));
      return;
    }

    // Play audio
    setIsLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      const audio = new Audio(site.audio);
      audioRefs.current[id] = audio;
      
      audio.addEventListener('loadedmetadata', () => {
        setIsLoading(prev => ({ ...prev, [id]: false }));
      });
      
      audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        setProgress(prev => ({ ...prev, [id]: progress }));
      });
      
      audio.addEventListener('ended', () => {
        setPlaying(null);
        setProgress(prev => ({ ...prev, [id]: 0 }));
      });
      
      audio.play();
      setPlaying(id);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(prev => ({ ...prev, [id]: false }));
      alert('Unable to play audio. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="heritage-page">
      <div className="heritage-header">
        <h1>Kathmandu Valley Heritage Audio</h1>
        <p className="subtitle">
          Listen to the stories of Nepal's 7 UNESCO World Heritage Sites
        </p>
      </div>
      
      <div className="heritage-grid">
        {heritageSites.map((site) => {
          const isPlaying = playing === site.id;
          const hasAudio = !!site.audio;
          const isLoadingAudio = isLoading[site.id];
          
          return (
            <div key={site.id} className="heritage-card">
              <div className="heritage-image-wrapper">
                <img 
                  src={site.image} 
                  alt={site.name}
                  className="heritage-image"
                />
                {!hasAudio && (
                  <div className="audio-coming-soon">
                    <span>🎧 Coming Soon</span>
                  </div>
                )}
              </div>
              <div className="heritage-content">
                <h3>{site.name}</h3>
                <p className="location">📍 {site.location}</p>
                <p className="description">{site.description}</p>
                
                <button 
                  className={`audio-btn ${isPlaying ? 'playing' : ''} ${!hasAudio ? 'disabled' : ''}`}
                  onClick={() => handlePlayToggle(site.id)}
                  disabled={isLoadingAudio}
                >
                  {isLoadingAudio ? (
                    '⏳ Loading...'
                  ) : isPlaying ? (
                    '⏸️ Pause Audio'
                  ) : hasAudio ? (
                    '▶️ Play Audio'
                  ) : (
                    '🔜 Coming Soon'
                  )}
                </button>
                
                {isPlaying && (
                  <div className="audio-player">
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{width: `${Math.min(progress[site.id] || 0, 100)}%`}}
                      />
                    </div>
                    <div className="playing-text">
                      <span>🎵 Now playing: {site.name}</span>
                      <span className="time">
                        {formatTime(audioRefs.current[site.id]?.currentTime || 0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeritageAudio;