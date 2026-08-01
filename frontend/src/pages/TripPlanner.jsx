// src/pages/TripPlanner.jsx
import { useState } from 'react';
import RouteMap from '../Components/RouteMap/index.jsx';
import '../styles/pages/TripPlanner.css';

const TripPlanner = () => {
  // Load preferences from localStorage
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('touristPreferences');
    return saved ? JSON.parse(saved) : {
      cuisine: [],
      budget: '$$',
      interests: []
    };
  });

  const [showPreferences, setShowPreferences] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    budget: '',
    days: '',
    preference: ''
  });

  // Save preferences
  const handleSavePreferences = (newPrefs) => {
    setPreferences(newPrefs);
    localStorage.setItem('touristPreferences', JSON.stringify(newPrefs));
    setShowPreferences(false);
    alert('✅ Preferences saved! Your recommendations will be personalized.');
  };

  // Toggle cuisine selection
  const toggleCuisine = (cuisine) => {
    const updated = preferences.cuisine.includes(cuisine)
      ? preferences.cuisine.filter(c => c !== cuisine)
      : [...preferences.cuisine, cuisine];
    setPreferences({...preferences, cuisine: updated});
  };

  // Toggle interests
  const toggleInterest = (interest) => {
    const updated = preferences.interests.includes(interest)
      ? preferences.interests.filter(i => i !== interest)
      : [...preferences.interests, interest];
    setPreferences({...preferences, interests: updated});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Trip plan submitted! (Backend will process this)');
  };

  return (
    <div className="planner-page">
      <h1>🗺️ Trip Planner</h1>
      <p className="subtitle">Plan your perfect Nepal adventure</p>

      {/* Preferences Toggle */}
      <div className="preferences-toggle">
        <button 
          className="pref-toggle-btn"
          onClick={() => setShowPreferences(!showPreferences)}
        >
          {showPreferences ? '✕ Hide Preferences' : '⚙️ Customize Your Preferences'}
        </button>
        {preferences.cuisine.length > 0 && (
          <span className="pref-badge">
            {preferences.cuisine.join(', ')} • {preferences.budget}
          </span>
        )}
      </div>

      {/* Preferences Panel */}
      {showPreferences && (
        <div className="preferences-panel">
          <h3>👤 Your Preferences</h3>
          <p className="pref-subtitle">
            Preferences are saved in your browser and used for all recommendations
          </p>

          <div className="pref-group">
            <label>🍽️ Cuisine</label>
            <div className="pref-buttons">
              {['Tibetan', 'Newari', 'International', 'Coffee', 'Street Food'].map(c => (
                <button
                  key={c}
                  className={preferences.cuisine.includes(c) ? 'active' : ''}
                  onClick={() => toggleCuisine(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="pref-group">
            <label>💰 Budget</label>
            <div className="budget-buttons">
              {['$', '$$', '$$$', '$$$$'].map(b => (
                <button
                  key={b}
                  className={preferences.budget === b ? 'active' : ''}
                  onClick={() => setPreferences({...preferences, budget: b})}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="pref-group">
            <label>🎯 Interests</label>
            <div className="pref-buttons">
              {['Culture', 'Nature', 'Adventure', 'Food', 'Photography', 'Relaxation'].map(i => (
                <button
                  key={i}
                  className={preferences.interests.includes(i) ? 'active' : ''}
                  onClick={() => toggleInterest(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="save-pref-btn"
            onClick={() => handleSavePreferences(preferences)}
          >
            💾 Save Preferences
          </button>
        </div>
      )}

      <section className="route-planner-section">
  <div className="section-header">
    <h2>📍 Route Planner</h2>
    <p>
      Explore Nepal, discover tourist destinations, and find the best routes.
    </p>
  </div>

  <RouteMap />
</section>

      {/* Trip Planner Form */}
      <div className="trip-form-section">
        <h2>📋 Plan Your Trip Details</h2>
        <form className="planner-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Starting Point</label>
            <select name="from" onChange={handleChange} required>
              <option value="">Select...</option>
              <option value="kathmandu">Kathmandu</option>
              <option value="pokhara">Pokhara</option>
              <option value="chitwan">Chitwan</option>
              <option value="lumbini">Lumbini</option>
            </select>
          </div>

          <div className="form-group">
            <label>Destination</label>
            <select name="to" onChange={handleChange} required>
              <option value="">Select...</option>
              <option value="kathmandu">Kathmandu</option>
              <option value="pokhara">Pokhara</option>
              <option value="chitwan">Chitwan</option>
              <option value="lumbini">Lumbini</option>
              <option value="everest">Everest Base Camp</option>
              <option value="annapurna">Annapurna Circuit</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Budget (USD)</label>
              <input 
                type="number" 
                name="budget" 
                placeholder="e.g., 500" 
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (Days)</label>
              <input 
                type="number" 
                name="days" 
                placeholder="e.g., 5" 
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Trip Type</label>
            <select name="preference" onChange={handleChange}>
              <option value="">Select...</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="religious">Religious</option>
              <option value="nature">Nature</option>
            </select>
          </div>

          {preferences.cuisine.length > 0 && (
            <div className="pref-summary">
              <p>📍 Using your preferences: <strong>{preferences.cuisine.join(', ')}</strong> | Budget: <strong>{preferences.budget}</strong></p>
            </div>
          )}

          <button type="submit" className="submit-btn">🚀 Plan My Trip</button>
        </form>
      </div>
    </div>
  );
};

export default TripPlanner;