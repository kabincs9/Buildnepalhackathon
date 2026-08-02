// src/components/RouteMap/UserLocationMarker.jsx

import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `
    <div style="
      width:18px;
      height:18px;
      background:#1E88E5;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 10px rgba(30,136,229,.6);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// ✅ Default location (Kathmandu)
const DEFAULT_LOCATION = {
  lat: 27.7172,
  lng: 85.3240
};

const UserLocationMarker = ({ setUserLocation }) => {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const [usingDefault, setUsingDefault] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("⚠️ Geolocation is not supported. Using default location (Kathmandu).");
      setUsingDefault(true);
      setPosition([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]);
      setUserLocation(DEFAULT_LOCATION);
      map.flyTo([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng], 12, { duration: 1.5 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // ✅ Success - user location found
      (location) => {
        const userPosition = [
          location.coords.latitude,
          location.coords.longitude,
        ];

        setPosition(userPosition);
        setUsingDefault(false);

        setUserLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });

        map.flyTo(userPosition, 13, { duration: 1.5 });
        console.log("📍 User location found:", location.coords.latitude, location.coords.longitude);
      },
      // ❌ Error - use default location
      (error) => {
        console.warn("⚠️ Location error:", error.message);
        console.log("📍 Using default location (Kathmandu)");
        setUsingDefault(true);
        setPosition([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]);
        setUserLocation(DEFAULT_LOCATION);
        map.flyTo([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng], 12, { duration: 1.5 });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, [map, setUserLocation]);

  if (!position) return null;

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <strong>
          {usingDefault ? '📍 Default Location (Kathmandu)' : '📍 You are here'}
        </strong>
        {usingDefault && (
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Allow location access for accurate results
          </div>
        )}
      </Popup>
    </Marker>
  );
};

export default UserLocationMarker;