// src/components/RouteMap/MapControls.jsx

import "../../styles/components/RouteMap/MapControls.css";

const MapControls = () => {
  return (
    <div className="map-controls">
      <div className="controls-left">
        <h2>🗺️ Route Planner</h2>
        <p>Explore Nepal and find the best routes to your destination.</p>
      </div>

      <div className="controls-right">
        <button className="location-btn">
          📍 My Location
        </button>

        <button className="reset-btn">
          🔄 Reset Map
        </button>
      </div>
    </div>
  );
};

export default MapControls;