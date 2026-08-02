import mongoose from "mongoose";

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["cafe", "restaurant", "hotel", "attraction", "shop"], // Added 'shop'
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    lat: {
      type: Number,
      required: true,
    },

    lng: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // New fields for better data
    area: {
      type: String,
      default: "",
    },

    priceRange: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$'
    },

    tags: {
      type: [String],
      default: []
    },

    openingHours: {
      type: String,
      default: "9:00 AM - 5:00 PM"
    },

    phone: {
      type: String,
      default: ""
    },

    popular: {
      type: Boolean,
      default: false
    },

    recommended: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
placeSchema.index({ type: 1, rating: -1 });
placeSchema.index({ area: 1, type: 1 });

const Place = mongoose.model("Place", placeSchema);

export default Place;