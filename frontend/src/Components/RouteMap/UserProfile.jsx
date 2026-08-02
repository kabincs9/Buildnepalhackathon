// src/Components/RouteMap/UserProfile.jsx

import { useState, useEffect } from 'react';

const UserProfile = ({ onPreferenceChange, totalPlaces, filteredCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // ✅ Initialize with proper default values
  const [preferences, setPreferences] = useState({
    types: ['cafe', 'restaurant', 'hotel', 'shop', 'attraction'],
    budget: 'moderate'
  });

  // Load saved preferences on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('userPreferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        // ✅ Ensure types exists even if saved data is incomplete
        const newPrefs = {
          types: parsed.types || ['cafe', 'restaurant', 'hotel', 'shop', 'attraction'],
          budget: parsed.budget || 'moderate'
        };
        setPreferences(newPrefs);
        if (onPreferenceChange) {
          onPreferenceChange(newPrefs);
        }
      }
    } catch (e) {
      console.log('⚠️ Could not parse saved preferences');
    }
  }, []);

  const handleTypeToggle = (type) => {
    // ✅ Ensure types exists before using includes
    const currentTypes = preferences.types || [];
    const updated = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    const newPrefs = { ...preferences, types: updated };
    setPreferences(newPrefs);
    if (onPreferenceChange) {
      onPreferenceChange(newPrefs);
    }
    localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
  };

  const handleBudgetChange = (budget) => {
    const newPrefs = { ...preferences, budget: budget };
    setPreferences(newPrefs);
    if (onPreferenceChange) {
      onPreferenceChange(newPrefs);
    }
    localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
  };

  const budgetOptions = [
    { id: 'budget', label: 'Budget', range: '₹500 - ₹1,000', icon: '💰' },
    { id: 'moderate', label: 'Moderate', range: '₹1,000 - ₹2,500', icon: '💳' },
    { id: 'premium', label: 'Premium', range: '₹2,500 - ₹5,000', icon: '💎' },
    { id: 'luxury', label: 'Luxury', range: '₹5,000+', icon: '👑' }
  ];

  const typeOptions = [
    { id: 'cafe', label: 'Cafe', icon: '☕' },
    { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
    { id: 'hotel', label: 'Hotel', icon: '🏨' },
    { id: 'shop', label: 'Shop', icon: '🛍️' },
    { id: 'attraction', label: 'Attraction', icon: '🏛️' }
  ];

  // ✅ Safely get current types
  const currentTypes = preferences.types || [];

  return (
    <div style={{
      position: 'absolute',
      bottom: '80px',
      right: '10px',
      zIndex: 1000,
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      maxWidth: '280px',
      width: '280px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 16px',
          background: '#1976d2',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold'
        }}
      >
        <span>⚙️ Filters</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {filteredCount !== undefined && (
            <span style={{ 
              fontSize: '12px', 
              background: 'rgba(255,255,255,0.2)', 
              padding: '2px 8px', 
              borderRadius: '12px' 
            }}>
              {filteredCount} places
            </span>
          )}
          <span>{isOpen ? '▼' : '▲'}</span>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div style={{ padding: '16px' }}>
          {/* Type Filters */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#333' }}>
              🏷️ Place Types
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {typeOptions.map(type => (
                <button
                  key={type.id}
                  onClick={() => handleTypeToggle(type.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '16px',
                    border: currentTypes.includes(type.id) ? '2px solid #1976d2' : '1px solid #ddd',
                    background: currentTypes.includes(type.id) ? '#e3f2fd' : 'white',
                    color: currentTypes.includes(type.id) ? '#1976d2' : '#666',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s'
                  }}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Filter */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#333' }}>
              💰 Budget (per person)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {budgetOptions.map(budget => (
                <button
                  key={budget.id}
                  onClick={() => handleBudgetChange(budget.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: preferences.budget === budget.id ? '2px solid #1976d2' : '1px solid #ddd',
                    background: preferences.budget === budget.id ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontWeight: preferences.budget === budget.id ? 'bold' : 'normal' }}>
                    {budget.icon} {budget.label}
                  </span>
                  <span style={{ 
                    color: preferences.budget === budget.id ? '#1976d2' : '#999',
                    fontSize: '11px'
                  }}>
                    {budget.range}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Route info */}
          <div style={{
            padding: '8px',
            background: '#e3f2fd',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#1976d2',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            🛣️ Places near your route shown automatically
          </div>

          {/* Results count */}
          {filteredCount !== undefined && (
            <div style={{
              marginTop: '8px',
              padding: '8px',
              background: filteredCount === 0 ? '#ffebee' : '#f5f5f5',
              borderRadius: '4px',
              fontSize: '12px',
              color: filteredCount === 0 ? '#c62828' : '#666',
              textAlign: 'center'
            }}>
              {filteredCount === 0 ? (
                <span>🔍 No places match your filters</span>
              ) : (
                <span>📍 Showing {filteredCount} places</span>
              )}
            </div>
          )}

          <div style={{
            marginTop: '6px',
            padding: '6px',
            background: '#e8f5e9',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#2e7d32',
            textAlign: 'center'
          }}>
            💾 Preferences saved automatically
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;