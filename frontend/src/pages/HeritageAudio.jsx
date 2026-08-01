import { useState } from 'react';
import '../styles/pages/HeritageAudio.css';

const heritageSites = [
  { id: 1, name: "Patan Durbar Square", description: "Ancient palace complex" },
  { id: 2, name: "Bhaktapur Durbar Square", description: "Medieval architecture" },
  { id: 3, name: "Swayambhunath Stupa", description: "Monkey Temple" },
  { id: 4, name: "Boudhanath Stupa", description: "Largest stupa in Nepal" },
];

const HeritageAudio = () => {
  const [playing, setPlaying] = useState(null);

  return (
    <div className="heritage-page">
      <h1>🎧 Kathmandu Heritage Audio</h1>
      <p className="subtitle">Listen to the stories of ancient Kathmandu</p>
      
      <div className="heritage-grid">
        {heritageSites.map((site) => (
          <div key={site.id} className="heritage-card">
            <h3>{site.name}</h3>
            <p>{site.description}</p>
            <button 
              className="audio-btn"
              onClick={() => setPlaying(playing === site.id ? null : site.id)}
            >
              {playing === site.id ? '⏸️ Pause' : '▶️ Play Audio'}
            </button>
            {playing === site.id && (
              <div className="audio-player">
                <div className="progress-bar">
                  <div className="progress" style={{width: '45%'}}></div>
                </div>
                <p className="playing-text">🎵 Now playing: {site.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeritageAudio;