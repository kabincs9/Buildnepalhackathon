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

const UserLocationMarker = ({ setUserLocation }) => {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const userPosition = [
          location.coords.latitude,
          location.coords.longitude,
        ];

        setPosition(userPosition);

        // Send location to parent component
        setUserLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });

        // Fly to user's location
        map.flyTo(userPosition, 13, {
          duration: 1.5,
        });
      },
      (error) => {
        console.error("Location error:", error);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, [map, setUserLocation]);

  if (!position) return null;

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <strong>📍 You are here</strong>
      </Popup>
    </Marker>
  );
};

export default UserLocationMarker;