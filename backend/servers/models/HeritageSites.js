import mongoose from "mongoose";

const heritageSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  lat: Number,
  lng: Number,
  unesco: Boolean,
  rating: Number,
  openingHours: String,
  entryFee: {
    nepali: String,
    saarc: String,
    foreigner: String,
  },
});

const HeritageSite = mongoose.model("HeritageSite", heritageSchema);

export default HeritageSite;