import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";


// Fix marker icon issue

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"

});



const SOSMap = ({ location }) => {


  if (!location) return null;


  return (

    <div className="sos-map">


      <MapContainer

        center={[
          location.lat,
          location.lng
        ]}

        zoom={16}

        scrollWheelZoom={false}

      >


        <TileLayer

          attribution="&copy; OpenStreetMap"

          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

        />



        <Marker

          position={[
            location.lat,
            location.lng
          ]}

        >

          <Popup>
            🚨 Your Current Location
          </Popup>


        </Marker>



      </MapContainer>


    </div>

  );

};


export default SOSMap;