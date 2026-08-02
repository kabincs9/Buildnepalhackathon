/**
 * Official Government of Nepal & UNESCO World Heritage Site Master Dataset
 * Real Official Ticket Prices in Nepalese Rupees (NPR - ₹)
 */

export const officialPermitsData = [
  {
    id: "PERMIT-PATAN",
    title: "Patan Durbar Square Entry Pass",
    category: "UNESCO World Heritage Site",
    region: "Lalitpur, Kathmandu Valley",
    coordinates: { lat: 27.6744, lng: 85.3249 },
    currentCapacityPct: 84, // Peak Load -> Enables Green Hour 15% Discount
    pricingNPR: {
      foreign: 1000,
      saarc: 250,
      chinese: 500,
      nepali: 0,
    },
    validityDays: 1,
    description: "Ancient royal complex known for Krishna Mandir, Golden Temple, and Newari stone architecture."
  },
  {
    id: "PERMIT-BHAKTAPUR",
    title: "Bhaktapur Durbar Square Entry Pass",
    category: "UNESCO World Heritage Site",
    region: "Bhaktapur District",
    coordinates: { lat: 27.6722, lng: 85.4283 },
    currentCapacityPct: 48,
    pricingNPR: {
      foreign: 1800,
      saarc: 500,
      chinese: 500,
      nepali: 0,
    },
    validityDays: 1,
    description: "City of Devotees featuring 55-Window Palace, Nyatapola Temple, and pottery heritage square."
  },
  {
    id: "PERMIT-KATHMANDU",
    title: "Kathmandu Durbar Square (Hanuman Dhoka)",
    category: "UNESCO World Heritage Site",
    region: "Central Kathmandu",
    coordinates: { lat: 27.7042, lng: 85.3071 },
    currentCapacityPct: 76,
    pricingNPR: {
      foreign: 1000,
      saarc: 500,
      chinese: 1000,
      nepali: 0,
    },
    validityDays: 1,
    description: "Historic seat of Malla and Shah kings, Kumari Ghar (Living Goddess Temple), and Taleju Temple."
  },
  {
    id: "PERMIT-BOUDHA",
    title: "Boudhanath Stupa Area Pass",
    category: "UNESCO World Heritage Site",
    region: "Kathmandu",
    coordinates: { lat: 27.7215, lng: 85.3620 },
    currentCapacityPct: 92, // Peak Capacity -> Green Hour Enabled
    pricingNPR: {
      foreign: 400,
      saarc: 100,
      chinese: 400,
      nepali: 0,
    },
    validityDays: 1,
    description: "Largest spherical stupa in Nepal and central hub of Tibetan Buddhist culture and monasteries."
  },
  {
    id: "PERMIT-SWAYAMBHU",
    title: "Swayambhunath Stupa (Monkey Temple)",
    category: "UNESCO World Heritage Site",
    region: "Western Kathmandu Hilltop",
    coordinates: { lat: 27.7149, lng: 85.2903 },
    currentCapacityPct: 88,
    pricingNPR: {
      foreign: 200,
      saarc: 50,
      chinese: 200,
      nepali: 0,
    },
    validityDays: 1,
    description: "Ancient hilltop holy shrine overlooking Kathmandu Valley, revered by both Buddhists and Hindus."
  },
  {
    id: "PERMIT-PASHUPATI",
    title: "Pashupatinath Temple Complex Pass",
    category: "UNESCO World Heritage Site",
    region: "Bagmati Riverbank, Kathmandu",
    coordinates: { lat: 27.7104, lng: 85.3487 },
    currentCapacityPct: 95, // Peak Capacity
    pricingNPR: {
      foreign: 1000,
      saarc: 1000,
      chinese: 1000,
      nepali: 0,
    },
    validityDays: 1,
    description: "Sacred Hindu temple complex dedicated to Lord Shiva, known for open cremation ghats."
  },
  {
    id: "PERMIT-CHANGU",
    title: "Changu Narayan Temple Pass",
    category: "UNESCO World Heritage Site",
    region: "Changunarayan, Bhaktapur",
    coordinates: { lat: 27.7161, lng: 85.4278 },
    currentCapacityPct: 30,
    pricingNPR: {
      foreign: 350,
      saarc: 100,
      chinese: 300,
      nepali: 0,
    },
    validityDays: 1,
    description: "Oldest Hindu temple in Kathmandu Valley featuring 5th-century Licchavi stone inscriptions."
  },
  {
    id: "PERMIT-LUMBINI",
    title: "Lumbini Sacred Garden Entry Pass",
    category: "UNESCO World Heritage Site",
    region: "Rupandehi, Terai Region",
    coordinates: { lat: 27.4697, lng: 83.2757 },
    currentCapacityPct: 52,
    pricingNPR: {
      foreign: 500,
      saarc: 200,
      chinese: 200,
      nepali: 0,
    },
    validityDays: 1,
    description: "Holy birthplace of Lord Buddha, Mayadevi Temple, Ashoka Pillar, and International Monasteries."
  },
  {
    id: "PERMIT-CHITWAN",
    title: "Chitwan National Park Safari Permit",
    category: "UNESCO Natural World Heritage Site",
    region: "Chitwan District, Terai",
    coordinates: { lat: 27.5292, lng: 84.4533 },
    currentCapacityPct: 60,
    pricingNPR: {
      foreign: 2000,
      saarc: 1000,
      chinese: 1500,
      nepali: 150,
    },
    validityDays: 1,
    description: "Subtropical jungle sanctuary home to One-Horned Rhinoceros, Royal Bengal Tigers, and gharials."
  },
  {
    id: "PERMIT-SAGARMATHA",
    title: "Sagarmatha National Park Permit",
    category: "UNESCO Natural World Heritage Site",
    region: "Solukhumbu, Everest Region",
    coordinates: { lat: 27.8016, lng: 86.7218 },
    currentCapacityPct: 42,
    pricingNPR: {
      foreign: 3000,
      saarc: 1500,
      chinese: 3000,
      nepali: 100,
    },
    validityDays: 30,
    description: "High-altitude Himalayan sanctuary containing Mount Everest (8,848m), Namche Bazaar, and Sherpa culture."
  }
];