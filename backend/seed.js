import 'dotenv/config';
import connectDB from './config/db.js'; // ← Root level, not inside servers
import HeritageSites from './servers/models/HeritageSites.js';

// ... rest of your code
// UNESCO World Heritage Sites in Kathmandu Valley
const heritageSitesData = [
  {
    name: "Swayambhunath Stupa (Monkey Temple)",
    category: "attraction",
    description: "Ancient Buddhist stupa with panoramic valley views and resident monkeys",
    lat: 27.7148,
    lng: 85.2905,
    unesco: true,
    rating: 4.8,
    openingHours: "5:00 AM - 7:00 PM",
    entryFee: {
      nepali: "Free",
      saarc: "Rs. 50",
      foreigner: "Rs. 200"
    }
  },
  {
    name: "Boudhanath Stupa",
    category: "attraction",
    description: "One of the largest stupas in the world and a UNESCO World Heritage Site",
    lat: 27.7215,
    lng: 85.3617,
    unesco: true,
    rating: 4.9,
    openingHours: "24 hours",
    entryFee: {
      nepali: "Free",
      saarc: "Rs. 100",
      foreigner: "Rs. 400"
    }
  },
  {
    name: "Pashupatinath Temple",
    category: "temple",
    description: "The most sacred Hindu temple in Nepal dedicated to Lord Shiva",
    lat: 27.7106,
    lng: 85.3483,
    unesco: true,
    rating: 4.8,
    openingHours: "5:00 AM - 9:00 PM",
    entryFee: {
      nepali: "Free",
      saarc: "Rs. 100",
      foreigner: "Rs. 1000"
    }
  },
  {
    name: "Kathmandu Durbar Square",
    category: "attraction",
    description: "Historic palace square with ancient temples and architecture",
    lat: 27.7042,
    lng: 85.3074,
    unesco: true,
    rating: 4.7,
    openingHours: "7:00 AM - 7:00 PM",
    entryFee: {
      nepali: "Free",
      saarc: "Rs. 150",
      foreigner: "Rs. 1000"
    }
  },
  {
    name: "Patan Durbar Square",
    category: "attraction",
    description: "Beautiful royal palace complex with intricate wood and stone carvings",
    lat: 27.6744,
    lng: 85.3250,
    unesco: true,
    rating: 4.7,
    openingHours: "7:00 AM - 7:00 PM",
    entryFee: {
      nepali: "Free",
      saarc: "Rs. 150",
      foreigner: "Rs. 1000"
    }
  },
  {
    name: "Bhaktapur Durbar Square",
    category: "attraction",
    description: "Medieval city square with the famous 55-window palace and golden gate",
    lat: 27.6722,
    lng: 85.4287,
    unesco: true,
    rating: 4.8,
    openingHours: "7:00 AM - 7:00 PM",
    entryFee: {
      nepali: "Free",
      saarc: "Rs. 150",
      foreigner: "Rs. 1500"
    }
  }
];

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    
    console.log('🗑️  Clearing existing heritage sites...');
    await HeritageSites.deleteMany({});
    
    console.log('🌱 Seeding heritage sites...');
    const result = await HeritageSites.insertMany(heritageSitesData);
    
    console.log(`✅ Successfully seeded ${result.length} heritage sites!`);
    console.log('📋 Seeded sites:');
    result.forEach((site, index) => {
      console.log(`  ${index + 1}. ${site.name} (${site.category}) - UNESCO: ${site.unesco}`);
    });
    
    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();