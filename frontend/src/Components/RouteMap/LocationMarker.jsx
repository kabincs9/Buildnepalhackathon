import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { getDistance } from "geolib";

const destinationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LocationMarkers = ({
  locations,
  userLocation,
  setSelectedDestination,
}) => {
  return (
    <>
      {locations.map((location) => {
        const distance = userLocation
          ? getDistance(
              {
                latitude: userLocation.lat,
                longitude: userLocation.lng,
              },
              {
                latitude: location.lat,
                longitude: location.lng,
              }
            )
          : null;

        const walkingTime = distance
          ? Math.ceil(distance / 80)
          : null;

        const drivingTime = distance
          ? Math.ceil(distance / 500)
          : null;

        return (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={destinationIcon}
          >
            <Popup minWidth={260}>
              <div style={{ lineHeight: "1.6" }}>
                <h3 style={{ marginBottom: "8px", color: "#8B4513" }}>
                  🏛 {location.name}
                </h3>

                <p>{location.description}</p>

                <hr />

                <p>
                  <strong>Category:</strong> {location.category}
                </p>

                {location.unesco && (
                  <p>🌍 <strong>UNESCO World Heritage Site</strong></p>
                )}

                <p>
                  ⭐ <strong>{location.rating}</strong> / 5
                </p>

                <p>
                  🕒 <strong>Opening Hours:</strong><br />
                  {location.openingHours}
                </p>

                <hr />

                <strong>🎟 Entry Fee</strong>

                <ul style={{ paddingLeft: "18px", marginTop: "5px" }}>
  <li>Nepali: {location.entryFee?.nepali}</li>
  <li>SAARC: {location.entryFee?.saarc}</li>
  <li>Foreigner: {location.entryFee?.foreigner}</li>
</ul>

{distance && (
  <>
    <hr />

    <p>
      📍 <strong>Distance:</strong>{" "}
      {(distance / 1000).toFixed(2)} km
    </p>

    <p>
      🚶 <strong>Walking:</strong> {walkingTime} min
    </p>

    <p>
      🚗 <strong>Driving:</strong> {drivingTime} min
    </p>
  </>
)}

<button
  onClick={() => setSelectedDestination(location)}
  style={{
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#C62828",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  }}
>
  🚗 Get Route
</button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default LocationMarkers;