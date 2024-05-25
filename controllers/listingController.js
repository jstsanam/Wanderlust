import Listing from "../models/listingSchema.js";
import Review from "../models/reviewSchema.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
import filterOptions from "../constants/filters.js";
const mapToken = process.env.MAPBOX_PUBLIC_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken })

const listingIndexPage = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings, filterOptions });
};

const showNewListing = (req, res) => {
    res.render("./listings/new.ejs");
}

const showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing doesn't exist anymore 🤷🏻‍♀️");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

// Geocoding is the process of converting addresses (like a street address) into geographic
// coordinates (long, lat), which we can use to place markers on map / position the map. We
// will use geocoding API by MapBox.

const createNewListing = async (req, res, next) => {
    let response = await geocodingClient
        // Forward Geocoding: Bengaluru -> 77.5946, 12.9716
        // Backward Geocoding: 77.5946, 12.9716 -> Bengaluru
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New listing added successfully ✅");
    res.redirect("/listings");
}

const showEditListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing doesn't exist anymore 🤷🏻‍♀️");
        res.redirect("/listings");
    }
    // setting all images quality to some desired pixels
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")

    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

const editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated sucessfully ✅");
    res.redirect(`/listings/${id}`);
}

const deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted sucessfully ✅");
    res.redirect("/listings");
}

const createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review added successfully 💜");
    res.redirect(`/listings/${listing.id}`);
}

const deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully ✅");
    res.redirect(`/listings/${id}`)
}

export {
    listingIndexPage,
    showNewListing,
    showListing,
    createNewListing,
    showEditListing,
    editListing,
    deleteListing,
    createReview,
    deleteReview
};