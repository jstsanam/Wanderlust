import express from "express";
import Listing from "../models/listing.js"
import  listingSchema  from "../schema.js";
import wrapAsync from "../utils/wrapAsync.js";

const listingRoute = express.Router();

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

listingRoute.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

listingRoute.get("/new", (req, res) => {
  res.render("./listings/new.ejs");
});

listingRoute.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing doesn't exist anymore :(");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

listingRoute.post("/", validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  }));

listingRoute.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing doesn't exist anymore :(");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

listingRoute.put("/:id", validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  }));

listingRoute.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
}));

export default listingRoute;