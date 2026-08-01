// src/components/RouteMap/Legend.jsx

import "../../styles/components/RouteMap/Legend.css";

const Legend = () => {
  return (
    <div className="map-legend">
      <h3>Map Legend</h3>

      <div className="legend-item">
        <span className="legend-dot destination"></span>
        <span>Tourist Destination</span>
      </div>

      <div className="legend-item">
        <span className="legend-dot user"></span>
        <span>Your Location</span>
      </div>

      <div className="legend-item">
        <span className="legend-line"></span>
        <span>Suggested Route</span>
      </div>
    </div>
  );
};

export default Legend;