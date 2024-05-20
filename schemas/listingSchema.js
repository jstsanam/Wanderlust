import mongoose from "mongoose";
import Review from "./reviewSchema.js";

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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

// Deletes the reviews associated with listings
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ reviews: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;