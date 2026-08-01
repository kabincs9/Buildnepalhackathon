// src/components/MinimalMap.jsx
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  overflow: 'hidden'
};

const center = {
  lat: 27.7172,
  lng: 85.3240
};

const MinimalMap = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // If no API key, show a placeholder
  if (!apiKey) {
    return (
      <div style={{
        background: '#f0f0f0',
        padding: '2rem',
        borderRadius: '12px',
        textAlign: 'center',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
        <h3>Google Maps API Key Required</h3>
        <p style={{ color: '#666' }}>
          Please add <code>VITE_GOOGLE_MAPS_API_KEY</code> to your .env file
        </p>
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '1rem' }}>
          Get a free API key from 
          <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0033A0' }}>
            Google Cloud Console
          </a>
        </p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      />
    </LoadScript>
  );
};

export default MinimalMap;