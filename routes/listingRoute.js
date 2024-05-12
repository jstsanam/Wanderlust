import express from "express";
import Listing from "../schemas/listingSchema.js"
import wrapAsync from "../utils/wrapAsync.js";
import Review from "../schemas/reviewSchema.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isListingAuthor, isReviewAuthor } from "../middlewares/isAuthorized.js";
import { validateListing } from "../middlewares/validateListing.js";
import { validateReview } from "../middlewares/validateReview.js";

const listingRoute = express.Router();

listingRoute.get("/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));

listingRoute.get("/new",
  isAuthenticated, (req, res) => {
    res.render("./listings/new.ejs");
  });

listingRoute.get("/:id",
  wrapAsync(async (req, res) => {
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
  }));

listingRoute.post("/",
  isAuthenticated,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing added successfully ✅");
    res.redirect("/listings");
  }));

listingRoute.get("/:id/edit",
  isAuthenticated,
  isListingAuthor,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing doesn't exist anymore 🤷🏻‍♀️");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }));

listingRoute.put("/:id",
  isAuthenticated,
  isListingAuthor,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated sucessfully ✅");
    res.redirect(`/listings/${id}`);
  }));

listingRoute.delete("/:id",
  isAuthenticated,
  isListingAuthor,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted sucessfully ✅");
    res.redirect("/listings");
  }));

listingRoute.post("/:id/reviews",
  isAuthenticated,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review added successfully 💜");
    res.redirect(`/listings/${listing.id}`);
  }));

listingRoute.delete("/:id/reviews/:reviewId",
  isAuthenticated,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully ✅");
    res.redirect(`/listings/${id}`)
  }));

export default listingRoute;

//Mongo $pull matches with value and deletes.