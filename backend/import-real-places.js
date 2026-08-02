import 'dotenv/config';
import connectDB from './config/db.js';
import Place from './servers/models/Place.js';
import axios from 'axios';

// ✅ Add delay helper function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// UNESCO Sites with their coordinates
const UNESCO_SITES = [
  { 
    id: 'swayambhunath',
    name: "Swayambhunath Stupa", 
    lat: 27.7148, 
    lng: 85.2905,
    radius: 500
  },
  { 
    id: 'boudhanath',
    name: "Boudhanath Stupa", 
    lat: 27.7215, 
    lng: 85.3617,
    radius: 500
  },
  { 
    id: 'pashupatinath',
    name: "Pashupatinath Temple", 
    lat: 27.7106, 
    lng: 85.3483,
    radius: 500
  },
  { 
    id: 'kathmandu_durbar',
    name: "Kathmandu Durbar Square", 
    lat: 27.7042, 
    lng: 85.3074,
    radius: 500
  },
  { 
    id: 'patan_durbar',
    name: "Patan Durbar Square", 
    lat: 27.6744, 
    lng: 85.3250,
    radius: 500
  },
  { 
    id: 'bhaktapur_durbar',
    name: "Bhaktapur Durbar Square", 
    lat: 27.6722, 
    lng: 85.4287,
    radius: 500
  },
  { 
    id: 'changu_narayan',
    name: "Changu Narayan Temple", 
    lat: 27.7164, 
    lng: 85.4278,
    radius: 400
  }
];

// Map OSM tags to our place types
const mapOSMType = (tags) => {
  if (tags.amenity === 'cafe') return 'cafe';
  if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food' || tags.amenity === 'pub' || tags.amenity === 'bar') return 'restaurant';
  if (tags.shop === 'gift' || tags.shop === 'souvenir' || tags.shop === 'art' || tags.shop === 'handicraft' || tags.shop === 'clothes' || tags.shop === 'fashion') return 'shop';
  if (tags.tourism === 'hotel' || tags.tourism === 'guest_house' || tags.tourism === 'hostel') return 'hotel';
  if (tags.tourism === 'attraction' || tags.tourism === 'museum' || tags.tourism === 'gallery' || tags.tourism === 'viewpoint') return 'attraction';
  if (tags.historic === 'monument' || tags.historic === 'memorial') return 'attraction';
  return 'attraction';
};

// Generate a realistic description
const generateDescription = (tags, siteName) => {
  if (tags.description) return tags.description;
  if (tags['description:en']) return tags['description:en'];
  
  const templates = {
    cafe: [
      `A cozy cafe near ${siteName}, perfect for coffee and pastries`,
      `Popular cafe near ${siteName} with great atmosphere`,
      `Great spot for coffee and light snacks near ${siteName}`
    ],
    restaurant: [
      `Authentic dining experience near ${siteName}`,
      `Great restaurant serving local cuisine near ${siteName}`,
      `Popular restaurant near ${siteName} with delicious food`
    ],
    hotel: [
      `Comfortable accommodation near ${siteName}`,
      `Great place to stay when visiting ${siteName}`,
      `Cozy hotel with easy access to ${siteName}`
    ],
    shop: [
      `Wonderful shopping spot near ${siteName}`,
      `Great place for souvenirs near ${siteName}`,
      `Unique local crafts and goods near ${siteName}`
    ],
    attraction: [
      `Must-visit attraction near ${siteName}`,
      `Beautiful spot close to ${siteName}`,
      `Interesting place to explore near ${siteName}`
    ]
  };
  
  const options = templates[tags.amenity || tags.tourism || 'attraction'] || templates.attraction;
  return options[Math.floor(Math.random() * options.length)];
};

// Fetch places from Overpass API
const fetchPlacesFromOSM = async (lat, lng, radius, siteName) => {
  try {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="cafe"](around:${radius},${lat},${lng});
        node["amenity"="restaurant"](around:${radius},${lat},${lng});
        node["amenity"="fast_food"](around:${radius},${lat},${lng});
        node["tourism"="hotel"](around:${radius},${lat},${lng});
        node["tourism"="guest_house"](around:${radius},${lat},${lng});
        node["shop"="gift"](around:${radius},${lat},${lng});
        node["shop"="souvenir"](around:${radius},${lat},${lng});
        node["tourism"="attraction"](around:${radius},${lat},${lng});
        node["tourism"="museum"](around:${radius},${lat},${lng});
      );
      out body;
    `;

    const encodedQuery = encodeURIComponent(query);
    const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BuildNepal-Hackathon/1.0'
      },
      timeout: 30000
    });

    if (!response.data || !response.data.elements) {
      return [];
    }

    const elements = response.data.elements || [];
    const places = [];

    elements.forEach(el => {
      const tags = el.tags || {};
      const name = tags.name || tags['name:en'] || null;
      if (!name) return;

      const lat2 = el.lat;
      const lng2 = el.lon;
      if (!lat2 || !lng2) return;

      const type = mapOSMType(tags);
      const description = generateDescription(tags, siteName);
      const openingHours = tags.opening_hours || '9:00 AM - 5:00 PM';
      const phone = tags.phone || tags['contact:phone'] || '';
      const website = tags.website || tags['contact:website'] || '';
      
      let priceRange = '$$';
      if (tags.amenity === 'cafe') priceRange = '$';
      else if (tags.amenity === 'restaurant') priceRange = '$$';
      else if (tags.tourism === 'hotel') priceRange = '$$$';

      places.push({
        name: name,
        type: type,
        description: description,
        lat: lat2,
        lng: lng2,
        rating: 4.0 + Math.random() * 1.0,
        area: siteName,
        priceRange: priceRange,
        tags: [type, 'osm', 'real'],
        openingHours: openingHours,
        phone: phone,
        website: website,
        osmId: el.id,
        source: 'OpenStreetMap'
      });
    });

    return places;
  } catch (error) {
    console.error(`  ⚠️  Error fetching for ${siteName}:`, error.message);
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
    }
    return [];
  }
};

// Main import function
const importRealPlaces = async () => {
  let allPlaces = [];
  
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    
    console.log('🗑️  Clearing existing places...');
    await Place.deleteMany({});
    
    console.log('🌍 Fetching real places from OpenStreetMap...');
    console.log(`📍 Searching around ${UNESCO_SITES.length} UNESCO sites\n`);
    
    for (let i = 0; i < UNESCO_SITES.length; i++) {
      const site = UNESCO_SITES[i];
      console.log(`  [${i + 1}/${UNESCO_SITES.length}] Fetching places near ${site.name}...`);
      const places = await fetchPlacesFromOSM(site.lat, site.lng, site.radius, site.name);
      
      if (places.length > 0) {
        console.log(`    ✅ Found ${places.length} places`);
        allPlaces = allPlaces.concat(places);
      } else {
        console.log(`    ⚠️  No places found for ${site.name}`);
      }
      
      // ✅ Add delay between requests (except after the last one)
      if (i < UNESCO_SITES.length - 1) {
        console.log(`    ⏳ Waiting 3 seconds to avoid rate limiting...`);
        await delay(3000); // 3 second delay
      }
    }
    
    console.log(`\n📊 Total real places fetched: ${allPlaces.length}`);
    
    if (allPlaces.length === 0) {
      console.log('⚠️  No places found from OpenStreetMap.');
      console.log('💡 This could be because:');
      console.log('   1. The API is temporarily unavailable');
      console.log('   2. The area doesn\'t have mapped places in OSM');
      console.log('   3. The query format needs adjustment');
      console.log('\n💡 Alternative: Use seedPlace.js for dummy data');
      process.exit(0);
    }
    
    console.log('💾 Saving to database...');
    const result = await Place.insertMany(allPlaces);
    
    console.log(`✅ Successfully imported ${result.length} real places!`);
    
    console.log('\n📊 Statistics:');
    const grouped = result.reduce((acc, place) => {
      acc[place.type] = (acc[place.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(grouped).forEach(([type, count]) => {
      console.log(`  🏷️  ${type}: ${count} places`);
    });
    
    console.log('\n📌 Sample places:');
    result.slice(0, 5).forEach((place) => {
      console.log(`  📍 ${place.name} (${place.type}) near ${place.area}`);
    });
    
    console.log('\n🎉 Import complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
};

importRealPlaces();