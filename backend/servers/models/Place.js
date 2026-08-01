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
      enum: ["Cafe", "Restaurant", "Hotel"],
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
  },
  {
    timestamps: true,
  }
);

const Place = mongoose.model("Place", placeSchema);

export default Place;