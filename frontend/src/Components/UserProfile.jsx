// components/UserPreferences.jsx
import { useState } from 'react';

const UserPreferences = ({ onSave }) => {
  const [preferences, setPreferences] = useState({
    cuisine: [],
    budget: '$$',
    interests: []
  });

  return (
    <div className="user-preferences">
      <div className="preference-card">
        <h3>👤 Your Preferences</h3>
        <p className="subtitle">Set your preferences once (saved in your browser)</p>
        
        <div className="pref-group">
          <label>🍽️ Cuisine</label>
          <div className="pref-buttons">
            {['Tibetan', 'Newari', 'International', 'Coffee'].map(c => (
              <button 
                key={c}
                className={preferences.cuisine.includes(c) ? 'active' : ''}
                onClick={() => {
                  const updated = preferences.cuisine.includes(c)
                    ? preferences.cuisine.filter(x => x !== c)
                    : [...preferences.cuisine, c];
                  setPreferences({...preferences, cuisine: updated});
                }}
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
            {['Culture', 'Nature', 'Adventure', 'Food', 'Photography'].map(i => (
              <button 
                key={i}
                className={preferences.interests.includes(i) ? 'active' : ''}
                onClick={() => {
                  const updated = preferences.interests.includes(i)
                    ? preferences.interests.filter(x => x !== i)
                    : [...preferences.interests, i];
                  setPreferences({...preferences, interests: updated});
                }}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <button className="save-btn" onClick={() => onSave(preferences)}>
          Save & Plan Trip 🚀
        </button>
      </div>
    </div>
  );
};

export default UserPreferences;