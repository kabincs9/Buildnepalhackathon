// src/pages/TripPlanner.jsx
import { useState } from 'react';
import RouteMap from '../Components/RouteMap/index.jsx';
import '../styles/pages/TripPlanner.css';

const TripPlanner = () => {
  const [filters, setFilters] = useState({
    placeType: 'all',
    budget: 'all',
    rating: 'all'
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      placeType: 'all',
      budget: 'all',
      rating: 'all'
    });
  };

  return (
    <div className="planner-page">
      <div className="planner-header">
        <h1>Trip Planner</h1>
        <p className="subtitle">Plan your perfect Nepal adventure</p>
      </div>

      {/* Route Map Section */}
      <section className="route-planner-section">
        <div className="section-header">
          <h2>Route Planner</h2>
          <p>Click on any heritage site marker, then select <strong>"Get Route"</strong> to see nearby places</p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-group">
            <label htmlFor="placeType">Place Type</label>
            <select 
              id="placeType"
              name="placeType" 
              value={filters.placeType} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Places</option>
              <option value="hotel">Hotels</option>
              <option value="restaurant">Restaurants</option>
              <option value="cafe">Cafes</option>
              <option value="shop">Shops</option>
              <option value="attraction">Attractions</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="budget">Budget</label>
            <select 
              id="budget"
              name="budget" 
              value={filters.budget} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Budgets</option>
              <option value="budget">Budget ($)</option>
              <option value="moderate">Moderate ($$)</option>
              <option value="premium">Premium ($$$)</option>
              <option value="luxury">Luxury ($$$$)</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="rating">Rating</label>
            <select 
              id="rating"
              name="rating" 
              value={filters.rating} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3.0">3.0+ Stars</option>
            </select>
          </div>

          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>

        {/* Map Legend */}
        <div className="map-legend">
          <div className="legend-title">📍 Map Legend</div>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-marker heritage-marker"></span>
              <span className="legend-label">Heritage Sites</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker hotel-marker"></span>
              <span className="legend-label">Hotels</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker restaurant-marker"></span>
              <span className="legend-label">Restaurants</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker cafe-marker"></span>
              <span className="legend-label">Cafes</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker shop-marker"></span>
              <span className="legend-label">Shops</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker attraction-marker"></span>
              <span className="legend-label">Attractions</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker route-line"></span>
              <span className="legend-label">Route Path</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker user-location"></span>
              <span className="legend-label">Your Location</span>
            </div>
          </div>
        </div>

        <RouteMap filters={filters} />
      </section>
    </div>
  );
};

export default TripPlanner;