// src/Components/RouteMap/RouteLine.jsx

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RouteLine = ({ userLocation, destination, setRoutePoints }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!userLocation || !destination) {
      // Clear route points when no route
      if (setRoutePoints) setRoutePoints([]);
      return;
    }

    // Remove previous route
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    // Create new route
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [
          {
            color: "#1976d2",
            weight: 5,
            opacity: 0.8,
          },
        ],
      },
      // Don't create default start/end markers
      createMarker: () => null,
      // Hide default instruction panel
      show: false,
      collapsible: true,
    }).addTo(map);

    routingControlRef.current = routingControl;

    // ✅ Capture route points when route is found
    routingControl.on('routesfound', (e) => {
      const route = e.routes[0];
      if (route && route.coordinates) {
        const points = route.coordinates.map(coord => ({
          lat: coord.lat,
          lng: coord.lng
        }));
        
        console.log(`🛣️ Route found with ${points.length} points`);
        
        // Send points to parent component
        if (setRoutePoints) {
          setRoutePoints(points);
        }
      }
    });

    // ✅ Handle routing errors
    routingControl.on('routingerror', (e) => {
      console.warn('⚠️ Routing error, using direct line:', e);
      
      // Fallback: Draw straight line between points
      const points = [
        { lat: userLocation.lat, lng: userLocation.lng },
        { lat: destination.lat, lng: destination.lng }
      ];
      
      if (setRoutePoints) {
        setRoutePoints(points);
      }
    });

    // Cleanup
    return () => {
      if (routingControlRef.current) {
        routingControlRef.current.off('routesfound');
        routingControlRef.current.off('routingerror');
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [map, userLocation, destination, setRoutePoints]);

  return null;
};

export default RouteLine;