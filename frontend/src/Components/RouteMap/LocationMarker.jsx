import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const destinationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LocationMarkers = ({ locations, setSelectedDestination }) => {
  return (
    <>
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={destinationIcon}
        >
          <Popup>
            <h3>{location.name}</h3>

            <p>{location.description}</p>

            <p>
              <strong>Region:</strong> {location.region}
            </p>

            {location.tags?.length > 0 && (
              <p>
                <strong>Tags:</strong> {location.tags.join(", ")}
              </p>
            )}

            <button
              onClick={() => setSelectedDestination(location)}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                background: "#d32f2f",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🚗 Get Route
            </button>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default LocationMarkers;