// src/pages/SOS.jsx
import { useState, useEffect } from "react";
import { getDistance } from "geolib";
import SOSCard from "../Components/SOS";
import "../../src/styles/pages/SOS.css";
import SOSMap from "../Components/SOSMap";

const SOS = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emergencySent, setEmergencySent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [nearbyServices, setNearbyServices] = useState([]);

  // Get location
  const getLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
        // Find nearby services after getting location
        findNearbyServices(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        alert("Please allow location access for emergency services");
        setLoading(false);
      }
    );
  };

 // Find nearby emergency services using OpenStreetMap
const findNearbyServices = async (lat, lng) => {

  try {

    const query = `
    [out:json];

    (
      node["amenity"="hospital"](around:5000,${lat},${lng});
      node["amenity"="police"](around:5000,${lat},${lng});
      node["amenity"="fire_station"](around:5000,${lat},${lng});

      way["amenity"="hospital"](around:5000,${lat},${lng});
      way["amenity"="police"](around:5000,${lat},${lng});
      way["amenity"="fire_station"](around:5000,${lat},${lng});
    );

    out center;
    `;



    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method:"POST",
        body:query
      }
    );



    const data = await response.json();



    const services = data.elements

    .map(place => {


      const serviceLat =
        place.lat || place.center?.lat;


      const serviceLng =
        place.lon || place.center?.lon;



      if(!serviceLat || !serviceLng)
        return null;



      let type="other";



      if(place.tags?.amenity==="hospital")
        type="hospital";


      if(place.tags?.amenity==="police")
        type="police";


      if(place.tags?.amenity==="fire_station")
        type="fire";



      const distance =
        getDistance(

          {
            latitude:lat,
            longitude:lng
          },


          {
            latitude:serviceLat,
            longitude:serviceLng
          }

        ) / 1000;



      return {

        name:
          place.tags?.name ||
          "Emergency Service",


        type,


        distance:
          distance.toFixed(2)+" km",


        rawDistance:distance,


        phone:
          place.tags?.phone ||
          "N/A",


        lat:serviceLat,

        lng:serviceLng

      };


    })

    .filter(Boolean);



    services.sort(
      (a,b)=>
      a.rawDistance-b.rawDistance
    );



    setNearbyServices(
      services.slice(0,6)
    );


  }


  catch(error){

    console.error(
      "Nearby services error:",
      error
    );

  }

};

  // Share location via WhatsApp
  const shareLocation = () => {
    if (!location) {
      alert("Please get your location first");
      return;
    }

    const message = `🚨 Emergency Alert - Yatra Nepal

I need help.

My current location:
https://maps.google.com/?q=${location.lat},${location.lng}

📍 Latitude: ${location.lat}
📍 Longitude: ${location.lng}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`
    );
  };

  // Share via SMS
  const shareViaSMS = () => {
    if (!location) {
      alert("Please get your location first");
      return;
    }

    const message = `🚨 Emergency Alert! I need help. My location: https://maps.google.com/?q=${location.lat},${location.lng}`;
    window.location.href = `sms:?body=${encodeURIComponent(message)}`;
  };

  // Emergency alert
  const triggerEmergency = () => {
    if (!location) {
      alert("Please get your location first");
      return;
    }

    setEmergencySent(true);
    setCountdown(5);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // In production, this would send actual emergency alert
          alert('🚨 EMERGENCY ALERT SENT!\n\nHelp is on the way.\nLocation shared with emergency services.');
          setEmergencySent(false);
          
          // Also share location automatically
          shareLocation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Open in Google Maps
  const openInGoogleMaps = () => {
    if (!location) {
      alert("Please get your location first");
      return;
    }
    window.open(`https://www.google.com/maps?q=${location.lat},${location.lng}`, '_blank');
  };

  // Auto-get location on page load
  useEffect(() => {
    getLocation();
  }, []);

  // Call emergency number
  const callEmergency = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="sos-container">
      {/* Header */}
      <div className="sos-header">
        <h1>🚨 Emergency Assistance</h1>
        <p>Quick emergency support during your journey in Nepal</p>
      </div>

      {/* Emergency Alert Button */}
      <div className="emergency-alert-section">
        <button 
          className={`emergency-btn ${emergencySent ? 'active' : ''}`}
          onClick={triggerEmergency}
          disabled={emergencySent || !location}
        >
          {emergencySent ? (
            <span>🚨 SENDING... {countdown}s</span>
          ) : (
            <span>🚨 PRESS FOR EMERGENCY</span>
          )}
        </button>
        {!location && (
          <p className="emergency-hint">⚠️ Please get your location first</p>
        )}
        {emergencySent && (
          <p className="emergency-status">⏳ Alert being sent... Please stay calm</p>
        )}
      </div>

      {/* Emergency Contacts Grid */}
      <div className="sos-grid">
        <SOSCard
          icon="🚔"
          title="Nepal Police"
          number="100"
          onCall={() => callEmergency('100')}
        />
        <SOSCard
          icon="🚑"
          title="Ambulance"
          number="102"
          onCall={() => callEmergency('102')}
        />
        <SOSCard
          icon="🚒"
          title="Fire Brigade"
          number="101"
          onCall={() => callEmergency('101')}
        />
        <SOSCard
          icon="🏔️"
          title="Tourist Police"
          number="1144"
          onCall={() => callEmergency('1144')}
        />
      </div>

      {/* Location Section */}
      <div className="location-box">
        <h2>📍 Current Location</h2>
        
        {location ? (
          <div className="location-info">
            <div className="location-coords">
              <p><strong>Latitude:</strong> {location.lat.toFixed(6)}</p>
              <p><strong>Longitude:</strong> {location.lng.toFixed(6)}</p>
              {location.accuracy && (
                <p className="accuracy">📍 Accuracy: ±{Math.round(location.accuracy)}m</p>
              )}
            </div>
            
            <div className="location-actions">

  <button 
    className="open-maps-btn"
    onClick={openInGoogleMaps}
  >
    🗺️ Open in Maps
  </button>


  {location && (
    <SOSMap location={location} />
  )}

</div>
          </div>
        ) : (
          <p className="no-location">📍 Location not detected</p>
        )}

        <div className="location-buttons">
          <button 
            className="location-btn"
            onClick={getLocation}
            disabled={loading}
          >
            {loading ? '⏳ Getting Location...' : '📍 Get My Location'}
          </button>
          
          {location && (
            <>
              <button 
                className="share-btn"
                onClick={shareLocation}
              >
                💬 Share via WhatsApp
              </button>
              <button 
                className="sms-btn"
                onClick={shareViaSMS}
              >
                📱 Share via SMS
              </button>
            </>
          )}
        </div>
      </div>

      {/* Nearby Services */}
      {nearbyServices.length > 0 && (
        <div className="nearby-services">
          <h2>📍 Nearby Emergency Services</h2>
          <div className="services-grid">
            {nearbyServices.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">
                  {service.type === 'police' && '🚓'}
                  {service.type === 'hospital' && '🏥'}
                  {service.type === 'tourist_police' && '👮'}
                  {service.type === 'fire' && '🚒'}
                </div>
                <div className="service-info">
                  <strong>{service.name}</strong>
                  <span>📍 {service.distance}</span>
                  <span>📞 {service.phone}</span>
                </div>
                <div className="service-actions">
                  <button 
                    className="service-call"
                    onClick={() => callEmergency(service.phone)}
                  >
                    📞
                  </button>
                  <button 
                        className="service-directions"
                          onClick={() => {

                          if(location){

                            window.open(
        `https://www.google.com/maps/dir/${location.lat},${location.lng}/${service.lat},${service.lng}`,
'_blank'
                                    );

                                }

                              }}
                        >
                          🗺️
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Tips */}
      <div className="safety-tips">
        <h2>🛡️ Safety Tips for Tourists</h2>
        <div className="tips-grid">
          <div className="tip-item">
            <span className="tip-icon">📱</span>
            <span>Save emergency numbers in your phone</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🗺️</span>
            <span>Share your itinerary with someone you trust</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🏨</span>
            <span>Keep your hotel address and contact handy</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📸</span>
            <span>Take photos of important documents</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🌙</span>
            <span>Avoid walking alone at night in unfamiliar areas</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">💧</span>
            <span>Carry water and stay hydrated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOS;