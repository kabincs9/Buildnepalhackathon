import 'dotenv/config';
import connectDB from './config/db.js';
import Place from './servers/models/Place.js';

// Define the 7 UNESCO heritage sites with their coordinates
const UNESCO_SITES = {
  swayambhunath: {
    name: "Swayambhunath Stupa",
    lat: 27.7148,
    lng: 85.2905,
    radius: 0.8
  },
  boudhanath: {
    name: "Boudhanath Stupa",
    lat: 27.7215,
    lng: 85.3617,
    radius: 0.8
  },
  pashupatinath: {
    name: "Pashupatinath Temple",
    lat: 27.7106,
    lng: 85.3483,
    radius: 0.8
  },
  kathmandu_durbar: {
    name: "Kathmandu Durbar Square",
    lat: 27.7042,
    lng: 85.3074,
    radius: 0.8
  },
  patan_durbar: {
    name: "Patan Durbar Square",
    lat: 27.6744,
    lng: 85.3250,
    radius: 0.8
  },
  bhaktapur_durbar: {
    name: "Bhaktapur Durbar Square",
    lat: 27.6722,
    lng: 85.4287,
    radius: 0.8
  },
  changu_narayan: {
    name: "Changu Narayan Temple",
    lat: 27.7164,
    lng: 85.4278,
    radius: 0.6
  }
};

// Valid types (matching the model enum)
const VALID_TYPES = ['cafe', 'restaurant', 'hotel', 'attraction', 'shop'];

// Realistic place names near each site
const placeNames = {
  cafe: [
    'Cafe', 'Coffee House', 'Brew', 'Espresso Bar', 'Roastery',
    'Bakery & Cafe', 'Coffee Shop', 'Tea House', 'Art Cafe',
    'Book Cafe', 'Garden Cafe', 'Rooftop Cafe', 'Organic Cafe',
    'Heritage Cafe', 'Mountain View Cafe'
  ],
  restaurant: [
    'Restaurant', 'Kitchen', 'Bistro', 'Dining', 'Eatery',
    'Food House', 'Cuisine', 'Grill', 'Steakhouse', 'Pizzeria',
    'Nepali Kitchen', 'Indian Cuisine', 'Chinese Wok', 'Italian Bistro',
    'Thai House', 'Japanese Sushi', 'Korean BBQ', 'Newari Khaja'
  ],
  hotel: [
    'Hotel', 'Lodge', 'Guest House', 'Resort', 'Inn',
    'Heritage Hotel', 'Boutique Hotel', 'Budget Inn',
    'Mountain View Hotel', 'Garden Lodge', 'Spa Resort',
    'B&B', 'Hostel', 'Backpackers Inn'
  ],
  shop: [
    'Handicraft Shop', 'Art Gallery', 'Boutique', 'Souvenir Store',
    'Thangka Gallery', 'Pashmina House', 'Jewelry Store',
    'Antique Shop', 'Textile Store', 'Pottery Studio',
    'Wood Carving Workshop', 'Metal Craft Store'
  ],
  attraction: [
    'Viewpoint', 'Garden', 'Museum', 'Gallery', 'Temple',
    'Monastery', 'Park', 'Square', 'Fountain', 'Statue',
    'Cultural Center', 'Meditation Center'
  ]
};

// Generate realistic descriptions
const getDescription = (type, siteName) => {
  const descs = {
    cafe: [
      `Perfect stop near ${siteName} for coffee and pastries`,
      `Cozy cafe with views of ${siteName}`,
      `Popular spot for tourists visiting ${siteName}`,
      `Organic coffee and fresh bakery near ${siteName}`,
      `Relaxing atmosphere just steps from ${siteName}`
    ],
    restaurant: [
      `Authentic Nepali cuisine near ${siteName}`,
      `Great dining option for ${siteName} visitors`,
      `Traditional Newari food near ${siteName}`,
      `Rooftop dining with views of ${siteName}`,
      `Best local food around ${siteName}`
    ],
    hotel: [
      `Comfortable stay near ${siteName}`,
      `Heritage hotel close to ${siteName}`,
      `Budget accommodation for ${siteName} visitors`,
      `Luxury stay with views of ${siteName}`,
      `Peaceful guesthouse near ${siteName}`
    ],
    shop: [
      `Best shopping near ${siteName}`,
      `Unique handicrafts from the ${siteName} area`,
      `Traditional art and crafts near ${siteName}`,
      `Great souvenirs from ${siteName}`
    ],
    attraction: [
      `Must-visit spot near ${siteName}`,
      `Beautiful view of ${siteName}`,
      `Cultural experience near ${siteName}`,
      `Hidden gem close to ${siteName}`
    ]
  };
  
  const options = descs[type] || descs.attraction;
  return options[Math.floor(Math.random() * options.length)];
};

// Generate places around a specific site
const generatePlacesForSite = (siteId, site, count = 15) => {
  const places = [];
  
  for (let i = 0; i < count; i++) {
    // Random offset within radius
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * site.radius;
    const latOffset = (radius / 111) * Math.cos(angle);
    const lngOffset = (radius / (111 * Math.cos(site.lat * Math.PI / 180))) * Math.sin(angle);
    
    // Pick a valid type
    const type = VALID_TYPES[Math.floor(Math.random() * VALID_TYPES.length)];
    
    // Get name for this type
    const nameList = placeNames[type] || placeNames.attraction;
    const name = `${nameList[Math.floor(Math.random() * nameList.length)]} ${Math.floor(Math.random() * 50) + 1}`;
    
    // Rating: mostly 3.5-5.0, some 4.5+ for popular spots
    let rating = 3.0 + Math.random() * 2.0;
    if (Math.random() > 0.7) rating = 4.0 + Math.random() * 1.0;
    if (Math.random() > 0.9) rating = 4.5 + Math.random() * 0.5;
    rating = Math.round(rating * 10) / 10;
    
    // Price range
    const priceRange = ['$', '$$', '$$$'][Math.floor(Math.random() * 3)];
    
    // Tags
    const tags = [
      'tourist-friendly', 'local', 'authentic', 'budget',
      'family-friendly', 'romantic', 'instagram-worthy',
      'traditional', 'modern', 'heritage', 'scenic'
    ];
    const numTags = Math.floor(Math.random() * 3) + 1;
    const selectedTags = [];
    for (let t = 0; t < numTags; t++) {
      const tag = tags[Math.floor(Math.random() * tags.length)];
      if (!selectedTags.includes(tag)) selectedTags.push(tag);
    }
    
    places.push({
      name: name,
      type: type,
      description: getDescription(type, site.name),
      lat: site.lat + latOffset,
      lng: site.lng + lngOffset,
      rating: rating,
      area: site.name,
      priceRange: priceRange,
      tags: selectedTags,
      openingHours: `${8 + Math.floor(Math.random() * 4)}:00 AM - ${8 + Math.floor(Math.random() * 4) + 4}:00 PM`,
      phone: `+977-${Math.floor(Math.random() * 900000000) + 100000000}`,
      popular: rating > 4.5 || Math.random() > 0.8,
      recommended: rating > 4.3
    });
  }
  
  return places;
};

// Generate all places
const generateAllPlaces = () => {
  let allPlaces = [];
  
  const siteEntries = Object.entries(UNESCO_SITES);
  
  siteEntries.forEach(([siteId, site]) => {
    const count = Math.floor(Math.random() * 6) + 12;
    const places = generatePlacesForSite(siteId, site, count);
    allPlaces = allPlaces.concat(places);
    console.log(`  📍 ${site.name}: ${places.length} places generated`);
  });
  
  return allPlaces;
};

const seedPlaces = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    
    console.log('🗑️  Clearing existing places...');
    await Place.deleteMany({});
    
    console.log('🌱 Generating places near 7 UNESCO sites...');
    const placesData = generateAllPlaces();
    
    console.log(`📊 Total places generated: ${placesData.length}`);
    
    console.log('🌱 Seeding places...');
    const result = await Place.insertMany(placesData);
    
    console.log(`✅ Successfully seeded ${result.length} places!`);
    console.log('\n📊 Statistics by type:');
    
    // Group by type
    const grouped = result.reduce((acc, place) => {
      acc[place.type] = (acc[place.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(grouped).forEach(([type, count]) => {
      console.log(`  🏷️  ${type}: ${count} places`);
    });
    
    console.log('\n📊 Statistics by heritage site:');
    const byArea = result.reduce((acc, place) => {
      if (!acc[place.area]) acc[place.area] = [];
      acc[place.area].push(place);
      return acc;
    }, {});
    
    Object.entries(byArea).forEach(([area, places]) => {
      const avgRating = places.reduce((sum, p) => sum + p.rating, 0) / places.length;
      console.log(`  📍 ${area}: ${places.length} places (⭐ ${avgRating.toFixed(1)} avg)`);
    });
    
    console.log('\n⭐ Top rated places:');
    const sorted = [...result].sort((a, b) => b.rating - a.rating);
    sorted.slice(0, 5).forEach((place) => {
      console.log(`  ${place.rating}⭐ - ${place.name} (${place.type}) near ${place.area}`);
    });
    
    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedPlaces();