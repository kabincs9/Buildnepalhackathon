// src/Components/RouteMap/RouteInfo.jsx

import "./../../styles/components/RouteMap/RouteInfo.css";

const RouteInfo = ({
  userLocation,
  destination,
  routeStats,
  preferences,
}) => {
  if (!userLocation || !destination) {
    return (
      <div className="route-info">
        <h3>🗺 Route Planner</h3>
        <p>Select a destination marker to begin planning your trip.</p>
      </div>
    );
  }

  const distance = routeStats
    ? (routeStats.distance / 1000).toFixed(1)
    : "--";

  const totalMinutes = routeStats
    ? Math.round(routeStats.duration / 60)
    : 0;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const travelTime =
    totalMinutes === 0
      ? "--"
      : hours > 0
      ? `${hours} hr ${minutes} min`
      : `${minutes} min`;

  // Rough driving cost in Nepal
  const estimatedCost =
    distance !== "--"
      ? `Rs. ${Math.round(distance * 12)}`
      : "--";

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination.lat},${destination.lng}`,
      "_blank"
    );
  };

  const saveRoute = () => {
    const savedRoutes = JSON.parse(
      localStorage.getItem("savedRoutes") || "[]"
    );

    savedRoutes.push({
      from: "Your Location",
      to: destination.name,
      distance,
      travelTime,
      estimatedCost,
    });

    localStorage.setItem(
      "savedRoutes",
      JSON.stringify(savedRoutes)
    );

    alert("✅ Route Saved!");
  };

  return (
    <div className="route-info">

      <h3>🗺 Route Information</h3>

      <div className="route-grid">

        <div className="route-card">
          <span>📍 From</span>
          <h4>Your Location</h4>
        </div>

        <div className="route-card">
          <span>📍 To</span>
          <h4>{destination.name}</h4>
        </div>

        <div className="route-card">
          <span>🛣 Distance</span>
          <h4>{distance} km</h4>
        </div>

        <div className="route-card">
          <span>⏱ Travel Time</span>
          <h4>{travelTime}</h4>
        </div>

        <div className="route-card">
          <span>💰 Estimated Cost</span>
          <h4>{estimatedCost}</h4>
        </div>

      </div>

      {preferences && (
        <div className="preferences-box">

          <h4>⚙ Your Preferences</h4>

          <p>
            <strong>Budget:</strong> {preferences.budget}
          </p>

          <p>
            <strong>Cuisine:</strong>{" "}
            {preferences.cuisine?.join(", ") || "Any"}
          </p>

          <p>
            <strong>Interests:</strong>{" "}
            {preferences.interests?.join(", ") || "Any"}
          </p>

        </div>
      )}

      <div className="route-buttons">

        <button onClick={saveRoute}>
          💾 Save Route
        </button>

        <button onClick={openGoogleMaps}>
          📍 Open in Google Maps
        </button>

        <button
          onClick={() =>
            alert(
              "🤖 AI Planner coming soon!\n\nIt will recommend hotels, restaurants, attractions, and create a personalized itinerary."
            )
          }
        >
          🤖 AI Planner
        </button>

      </div>

    </div>
  );
};

export default RouteInfo;