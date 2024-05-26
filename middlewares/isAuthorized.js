import Listing from "../models/listingSchema.js";
import Review from "../models/reviewSchema.js";

const isUserListingOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // Checking if user is actual owner of listing or not
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "Only owners can update the listing 🙅🏻‍♀️");
        return res.redirect(`/${id}`);
    }
    next();
}

const isUserReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    // Checking if user is actual author of review or not
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Only authors can update the review 🙅🏻‍♀️");
        return res.redirect(`/${id}`);
    }
    next();
}

export { isUserListingOwner, isUserReviewAuthor };