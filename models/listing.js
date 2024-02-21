const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/brown-ice-cream-cone-52jRtc2S_VE",
        set: (v) => v === "" ? "https://unsplash.com/photos/brown-ice-cream-cone-52jRtc2S_VE" : v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;