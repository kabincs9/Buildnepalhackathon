// src/pages/TripPlanner.jsx

import { useState } from 'react';
import RouteMap from '../Components/RouteMap/index.jsx';
import '../styles/pages/TripPlanner.css';

const TripPlanner = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    budget: '',
    days: '',
    preference: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('✅ Trip plan submitted! (Backend will process this)');
  };

  return (
    <div className="planner-page">
      <h1>🗺️ Trip Planner</h1>
      <p className="subtitle">Plan your perfect Nepal adventure</p>

      {/* Route Map Section */}
      <section className="route-planner-section">
        <div className="section-header">
          <h2>📍 Route Planner</h2>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Click on any heritage site marker, then select <strong>"Get Route"</strong> to see nearby places
          </p>
        </div>
        <RouteMap />
      </section>

      {/* Trip Planner Form */}
      <section className="trip-form-section">
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
              <option value="bhaktapur">Bhaktapur</option>
              <option value="patan">Patan</option>
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
              <option value="boudhanath">Boudhanath Stupa</option>
              <option value="pashupatinath">Pashupatinath Temple</option>
              <option value="swayambhunath">Swayambhunath Stupa</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Budget (NPR)</label>
              <input 
                type="number" 
                name="budget" 
                placeholder="e.g., 5000" 
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
              <option value="adventure">🏔️ Adventure</option>
              <option value="cultural">🏛️ Cultural</option>
              <option value="religious">🕉️ Religious</option>
              <option value="nature">🌿 Nature</option>
              <option value="food">🍽️ Food</option>
              <option value="photography">📸 Photography</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">🚀 Plan My Trip</button>
        </form>
      </section>
    </div>
  );
};

export default TripPlanner;