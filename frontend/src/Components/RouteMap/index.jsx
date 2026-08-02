// src/Components/RouteMap/index.jsx

import { useEffect, useState } from "react";
import heritageSites from "../../data/heritageSites";
import { getDistance } from "geolib";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Remove RouteInfo import
// import RouteInfo from "./RouteInfo";
import RouteLine from "./RouteLine";
import UserLocationMarker from "./UserLocationMarker";
import LocationMarker from "./LocationMarker";
import Legend from "./Legend";
import UserProfile from "./UserProfile";

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map settings
const NEPAL_CENTER = [28.3949, 84.1240];
const NEPAL_BOUNDS = [
  [26.2, 80.0],
  [30.5, 88.2],
];

// Marker icons
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const MARKER_ICONS = {
  cafe: createIcon("orange"),
  restaurant: createIcon("green"),
  hotel: createIcon("red"),
  attraction: createIcon("blue"),
  food: createIcon("green"),
  shop: createIcon("purple")
};

const RouteMap = () => {
  const [locations, setLocations] = useState([]);
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [routePoints, setRoutePoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [isRouteActive, setIsRouteActive] = useState(false);
  
  const [routeInfo, setRouteInfo] = useState({
    distance: null,
    duration: null,
    cost: null
  });

  const [preferences, setPreferences] = useState({
    types: ['cafe', 'restaurant', 'hotel', 'shop', 'attraction'],
    budget: 'moderate'
  });

  const [filteredPlaces, setFilteredPlaces] = useState([]);

  // Load destinations
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🔄 Fetching destinations...");
        const res = await fetch("http://localhost:5000/api/destinations");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("✅ Destinations:", data.length);
        setLocations(data);
        
      } catch (err) {
        console.log("❌ Using fallback data");
        setLocations(heritageSites);
        setError("Using local data - backend not available");
      } finally {
        setLoading(false);
      }
    };
    
    loadLocations();
  }, []);

  // Load places
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        console.log("🔄 Fetching places...");
        const res = await fetch("http://localhost:5000/api/places");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("✅ Places:", data.length);
        setPlaces(data);
        
      } catch (err) {
        console.log("❌ Failed to load places:", err.message);
        setPlaces([]);
      }
    };
    
    loadPlaces();
  }, []);

  // Filter function
  const filterPlaces = (places, preferences, routePoints, isRouteActive) => {
    if (!places || places.length === 0) return [];

    let filtered = [...places];

    // 1. Filter by TYPE
    if (preferences.types && preferences.types.length > 0) {
      filtered = filtered.filter(place => 
        preferences.types.includes(place.type)
      );
    }

    // 2. Filter by BUDGET
    const budgetMapping = {
      'budget': { max: 1000 },
      'moderate': { max: 2500 },
      'premium': { max: 5000 },
      'luxury': { max: Infinity }
    };
    const maxBudget = budgetMapping[preferences.budget]?.max || 2500;
    
    filtered = filtered.filter(place => {
      const priceMap = {
        '$': 500,
        '$$': 1500,
        '$$$': 3500,
        '$$$$': 6000
      };
      const price = priceMap[place.priceRange] || 1000;
      return price <= maxBudget;
    });

    // 3. Filter by ROUTE - ONLY if route is active
    if (isRouteActive && routePoints && routePoints.length > 0) {
      const sampledPoints = routePoints.filter((_, index) => index % 10 === 0);
      
      filtered = filtered.filter(place => {
        return sampledPoints.some(point => {
          const distance = getDistance(
            { latitude: point.lat, longitude: point.lng },
            { latitude: place.lat, longitude: place.lng }
          );
          return distance < 2000;
        });
      });
    }

    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return filtered;
  };

  // Apply filters
  useEffect(() => {
    const filtered = filterPlaces(places, preferences, routePoints, isRouteActive);
    setFilteredPlaces(filtered);
  }, [places, preferences, routePoints, isRouteActive]);

  // Handle preference changes
  const handlePreferenceChange = (newPreferences) => {
    setPreferences(newPreferences);
  };

  // Find places near route
  const findPlacesNearRoute = (routePoints, places, maxDistance = 2000) => {
    if (!routePoints || routePoints.length === 0 || !places || places.length === 0) {
      return [];
    }
    
    const sampledPoints = routePoints.filter((_, index) => index % 10 === 0);
    
    const nearby = places.filter(place => {
      return sampledPoints.some(point => {
        const distance = getDistance(
          { latitude: point.lat, longitude: point.lng },
          { latitude: place.lat, longitude: place.lng }
        );
        return distance < maxDistance;
      });
    });
    
    return nearby
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 20);
  };

  // Update recommendations and route status
  useEffect(() => {
    if (routePoints.length > 0 && places.length > 0) {
      const nearbyPlaces = findPlacesNearRoute(routePoints, places);
      setRecommendations(nearbyPlaces);
      setIsRouteActive(true);
      console.log(`✨ ${nearbyPlaces.length} places near route`);
    } else {
      setRecommendations([]);
      setIsRouteActive(false);
    }
  }, [routePoints, places]);

  // Calculate route info
  useEffect(() => {
    if (isRouteActive && routePoints.length > 0 && userLocation && selectedDestination) {
      let totalDistance = 0;
      for (let i = 1; i < routePoints.length; i++) {
        const dist = getDistance(
          { latitude: routePoints[i-1].lat, longitude: routePoints[i-1].lng },
          { latitude: routePoints[i].lat, longitude: routePoints[i].lng }
        );
        totalDistance += dist;
      }
      
      const distanceKm = (totalDistance / 1000).toFixed(1);
      const durationHours = (totalDistance / 1000 / 40);
      const hours = Math.floor(durationHours);
      const minutes = Math.round((durationHours - hours) * 60);
      const durationStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      const costNpr = Math.round((totalDistance / 1000) * 150);
      
      setRouteInfo({
        distance: distanceKm,
        duration: durationStr,
        cost: `₹${costNpr}`
      });
    }
  }, [isRouteActive, routePoints, userLocation, selectedDestination]);

  // Clear route
  const handleClearRoute = () => {
    setSelectedDestination(null);
    setRoutePoints([]);
    setRecommendations([]);
    setIsRouteActive(false);
    setRouteInfo({
      distance: null,
      duration: null,
      cost: null
    });
  };

  // Loading state
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading map data...</div>;
  }

  const placesToShow = isRouteActive && !showAllPlaces
    ? filteredPlaces
    : isRouteActive && showAllPlaces
    ? places
    : [];

  const nearbyCount = isRouteActive ? recommendations.length : 0;

  return (
    <section className="route-map-section" style={{ position: 'relative' }}>
      {error && <div style={{ color: 'orange', padding: '10px', background: '#fff3cd' }}>{error}</div>}
      
      {/* UserProfile Component */}
      <UserProfile 
        onPreferenceChange={handlePreferenceChange}
        totalPlaces={places.length}
        filteredCount={filteredPlaces.length}
      />
      
      {/* Route Controls - ONLY SHOW WHEN ROUTE IS ACTIVE */}
      {isRouteActive && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'rgba(44, 24, 16, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          fontSize: '14px',
          maxWidth: '220px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          <div style={{ marginBottom: '8px', color: 'var(--gold, #D4A017)', fontWeight: 'bold' }}>
            🛣️ Route Active
          </div>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: 'rgba(255,255,255,0.9)',
            fontSize: '13px'
          }}>
            <input
              type="checkbox"
              checked={showAllPlaces}
              onChange={(e) => setShowAllPlaces(e.target.checked)}
              style={{ accentColor: 'var(--gold, #D4A017)' }}
            />
            Show all places
          </label>
          {!showAllPlaces && (
            <div style={{ 
              marginTop: '4px', 
              color: 'var(--gold, #D4A017)', 
              fontSize: '12px',
              opacity: 0.8
            }}>
              {nearbyCount} places near route
            </div>
          )}
          <button 
            onClick={handleClearRoute}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              background: 'linear-gradient(135deg, var(--crimson-red, #DC143C), var(--maroon, #800000))',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              width: '100%',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--saffron-orange, #FF9933), var(--gold, #D4A017))';
              e.target.style.color = 'var(--dark-charcoal, #2C1810)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, var(--crimson-red, #DC143C), var(--maroon, #800000))';
              e.target.style.color = 'white';
            }}
          >
            Clear Route
          </button>
        </div>
      )}
      
      {/* RouteInfo component removed */}
      
      <MapContainer
        center={NEPAL_CENTER}
        zoom={7}
        minZoom={7}
        maxZoom={18}
        maxBounds={NEPAL_BOUNDS}
        maxBoundsViscosity={1}
        scrollWheelZoom
        style={{
          height: "550px",
          width: "100%",
          borderRadius: "12px",
          border: "4px solid var(--gold, #D4A017)"
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <UserLocationMarker setUserLocation={setUserLocation} />
        
        <LocationMarker
          locations={locations}
          userLocation={userLocation}
          setSelectedDestination={setSelectedDestination}
        />
        
        <RouteLine
          userLocation={userLocation}
          destination={selectedDestination}
          setRoutePoints={setRoutePoints}
        />
        
        {/* Display places - ONLY if route is active */}
        {isRouteActive && placesToShow.map((place, index) => (
          <Marker
            key={`place-${place._id || index}`}
            position={[place.lat, place.lng]}
            icon={MARKER_ICONS[place.type] || MARKER_ICONS.attraction}
          >
            <Popup>
              <div style={{ minWidth: '150px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--dark-charcoal, #2C1810)' }}>{place.name}</h4>
                <p style={{ margin: '4px 0' }}>
                  {place.type === "hotel" && "🏨 Hotel"}
                  {place.type === "cafe" && "☕ Cafe"}
                  {place.type === "restaurant" && "🍽️ Restaurant"}
                  {place.type === "shop" && "🛍️ Shop"}
                  {place.type === "attraction" && "🏛️ Attraction"}
                </p>
                {place.description && (
                  <p style={{ margin: '4px 0', fontSize: '13px', color: 'var(--chocolate-brown, #5C3317)' }}>
                    {place.description}
                  </p>
                )}
                <p style={{ margin: '4px 0', fontWeight: 'bold', color: 'var(--gold, #D4A017)' }}>
                  ⭐ {place.rating || 'N/A'}/5
                </p>
                {place.priceRange && (
                  <p style={{ margin: '4px 0', fontSize: '12px', color: 'var(--deep-rust, #8B4513)' }}>
                    Price: {place.priceRange}
                  </p>
                )}
                {place.area && (
                  <p style={{ margin: '4px 0', fontSize: '11px', color: 'var(--sandstone, #D4B896)' }}>
                    📍 Near {place.area}
                  </p>
                )}
                {!showAllPlaces && (
                  <p style={{ margin: '4px 0', color: 'var(--gold, #D4A017)', fontSize: '12px' }}>
                    📍 Near your route
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <Legend />
    </section>
  );
};

export default RouteMap;