import Listing from "../models/listingSchema.js";
import Review from "../models/reviewSchema.js";

const listingIndexPage = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
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

const createNewListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
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
    res.render("listings/edit.ejs", { listing });
}

const editListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
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