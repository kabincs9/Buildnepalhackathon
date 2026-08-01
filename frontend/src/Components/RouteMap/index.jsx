// src/Components/RouteMap/index.jsx

import { useEffect, useState } from "react";
import { getDistance } from "geolib";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import MapControls from "./MapControls";
import RouteInfo from "./RouteInfo";
import RouteLine from "./RouteLine";
import UserLocationMarker from "./UserLocationMarker";
import LocationMarker from "./LocationMarker";
import Legend from "./Legend";


// Leaflet marker fix

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});



// Map settings

const NEPAL_CENTER = [28.3949, 84.1240];

const NEPAL_BOUNDS = [
  [26.2, 80.0],
  [30.5, 88.2],
];




// Destination fallback data

const MOCK_DESTINATIONS = [

{
id:1,
name:"Swayambhunath Stupa",
lat:27.7150,
lng:85.2905,
category:"Cultural",
rating:4.9
},

{
id:2,
name:"Boudhanath Stupa",
lat:27.7215,
lng:85.3617,
category:"Cultural",
rating:4.8
},

{
id:3,
name:"Patan Durbar Square",
lat:27.6737,
lng:85.3248,
category:"Cultural",
rating:4.7
},

{
id:4,
name:"Pokhara Lakeside",
lat:28.2096,
lng:83.9856,
category:"Nature",
rating:4.9
}

];





// Places available in Yatra Nepal

const ROUTE_PLACES = [

{
name:"Himalayan Cafe",
type:"cafe",
rating:4.5,
lat:27.82,
lng:85.45
},


{
name:"Mountain View Hotel",
type:"hotel",
rating:4.7,
price:50,
lat:27.95,
lng:85.55
},


{
name:"Thakali Kitchen",
type:"food",
rating:4.8,
cuisine:"Thakali",
lat:28.08,
lng:84.20
},


{
name:"Pokhara Lakeside Resort",
type:"hotel",
rating:4.9,
price:100,
lat:28.20,
lng:83.98
}

];






// Marker icons

const createIcon = (color)=>

new L.Icon({

iconUrl:
`https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,

shadowUrl:
"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

iconSize:[25,41],

iconAnchor:[12,41],

popupAnchor:[1,-34]

});



const MARKER_ICONS={

food:createIcon("green"),

cafe:createIcon("orange"),

hotel:createIcon("red"),

attraction:createIcon("blue")

};







// Find places near route

const findPlacesAlongRoute=(routePoints)=>{


return ROUTE_PLACES.filter(place=>{


return routePoints.some(point=>{


const distance=getDistance(

{
latitude:point.lat,
longitude:point.lng
},

{
latitude:place.lat,
longitude:place.lng
}

);



return distance < 3000;


});


});


};








const RouteMap=()=>{


const [locations,setLocations]=useState([]);

const [userLocation,setUserLocation]=useState(null);

const [selectedDestination,setSelectedDestination]=useState(null);

const [recommendations,setRecommendations]=useState([]);

const [routePoints,setRoutePoints]=useState([]);

const [loading,setLoading]=useState(true);






// Load destinations

useEffect(()=>{


const loadLocations=async()=>{


try{


const res=
await fetch(
"http://localhost:5000/api/destinations"
);



if(!res.ok)
throw new Error();



const data=
await res.json();


setLocations(data);



}

catch(err){


console.log(
"Backend unavailable"
);


setLocations(MOCK_DESTINATIONS);


}

finally{

setLoading(false);

}


};


loadLocations();


},[]);








// Generate route recommendations

useEffect(()=>{


if(routePoints.length>0){


const places=
findPlacesAlongRoute(routePoints);


setRecommendations(places);


}


},[routePoints]);









if(loading)

return (

<div className="loading-container">

Loading map...

</div>

);








return (

<section className="route-map-section">


<MapControls/>




<RouteInfo

userLocation={userLocation}

destination={selectedDestination}

/>






<MapContainer

center={NEPAL_CENTER}

zoom={7}

minZoom={7}

maxZoom={18}

maxBounds={NEPAL_BOUNDS}

maxBoundsViscosity={1}

scrollWheelZoom

style={{

height:"550px",

width:"100%"

}}

>



<TileLayer

attribution="&copy; OpenStreetMap"

url=
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

/>




<UserLocationMarker

setUserLocation={setUserLocation}

/>





<LocationMarker

locations={locations}

setSelectedDestination={setSelectedDestination}

/>






<RouteLine

userLocation={userLocation}

destination={selectedDestination}

setRoutePoints={setRoutePoints}

/>







{
recommendations.map((place,index)=>(


<Marker

key={index}

position={[
place.lat,
place.lng
]}

icon={
MARKER_ICONS[place.type]
}

>


<Popup>


<h4>

{place.name}

</h4>


<p>

{
place.type==="hotel"
&&
`🏨 $${place.price}/night`
}


{
place.type==="food"
&&
`🍛 ${place.cuisine}`
}


{
place.type==="cafe"
&&
"☕ Cafe"
}


</p>


<p>

⭐ {place.rating}

</p>



</Popup>


</Marker>


))

}






</MapContainer>



<Legend/>


</section>


);

};



export default RouteMap;