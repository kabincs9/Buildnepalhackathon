// src/Components/RouteMap/RouteInfo.jsx

import React from 'react';

const RouteInfo = ({ userLocation, destination, routeInfo, onClearRoute, isRouteActive }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      zIndex: 1000,
      background: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      minWidth: '200px',
      maxWidth: '280px',
      fontSize: '13px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1976d2' }}>
        🗺️ Route Information
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        <span style={{ color: '#666' }}>From:</span>
        <span style={{ marginLeft: '8px', fontWeight: '500' }}>
          {userLocation ? '📍 Your Location' : 'Not set'}
        </span>
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        <span style={{ color: '#666' }}>To:</span>
        <span style={{ marginLeft: '8px', fontWeight: '500', color: '#1976d2' }}>
          {destination ? `🏛️ ${destination.name}` : 'Not selected'}
        </span>
      </div>
      
      {isRouteActive && routeInfo && routeInfo.distance !== null ? (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Distance:</span>
            <span style={{ fontWeight: 'bold' }}>{routeInfo.distance} km</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Travel Time:</span>
            <span style={{ fontWeight: 'bold' }}>{routeInfo.duration}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Est. Cost:</span>
            <span style={{ fontWeight: 'bold', color: '#2e7d32' }}>{routeInfo.cost}</span>
          </div>
          
          <button 
            onClick={onClearRoute}
            style={{
              marginTop: '8px',
              padding: '4px 12px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              width: '100%'
            }}
          >
            ✕ Clear Route
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee', color: '#999', fontSize: '12px' }}>
          Click a heritage site and select "Get Route"
        </div>
      )}
    </div>
  );
};

export default RouteInfo;