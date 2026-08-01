// src/pages/LocalGuides.jsx
import '../styles/pages/LocalGuides.css';

const LocalGuides = () => {
  return (
    <div className="guides-page">
      <h1>👨‍👩‍👦 Local Guides</h1>
      <p className="subtitle">Connect with certified local guides in Nepal</p>
      
      <div className="guides-grid">
        <div className="guide-card">
          <h3>Ram Sharma</h3>
          <p>⭐ 4.8 (124 reviews)</p>
          <p>🗣️ Nepali, English, Hindi</p>
          <p>💰 $25/hour</p>
          <button className="book-btn">Book Now</button>
        </div>
        
        <div className="guide-card">
          <h3>Sita Thapa</h3>
          <p>⭐ 4.9 (98 reviews)</p>
          <p>🗣️ Nepali, English, French</p>
          <p>💰 $30/hour</p>
          <button className="book-btn">Book Now</button>
        </div>
        
        <div className="guide-card">
          <h3>Kumar Rai</h3>
          <p>⭐ 4.7 (87 reviews)</p>
          <p>🗣️ Nepali, English, Japanese</p>
          <p>💰 $28/hour</p>
          <button className="book-btn">Book Now</button>
        </div>
        
        <div className="guide-card">
          <h3>Maya Gurung</h3>
          <p>⭐ 4.9 (156 reviews)</p>
          <p>🗣️ Nepali, English, German</p>
          <p>💰 $32/hour</p>
          <button className="book-btn">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default LocalGuides;  // ← THIS MUST BE HERE!