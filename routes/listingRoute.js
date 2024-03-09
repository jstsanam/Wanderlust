import express from "express";
import Listing from "../models/listing.js"
import logger from "../logger/logger.js";

const listingRoute = express.Router();

listingRoute.get("/",  async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});

listingRoute.get("/new", (req, res) => {
  res.render("./listings/new.ejs");
});

listingRoute.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/show.ejs", { listing });
});

listingRoute.post("/", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

listingRoute.get("/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
});

listingRoute.put("/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

listingRoute.delete("/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  logger.info(`Deleted listing by id: ${deletedListing.id}`);
  res.redirect("/listings");
});

export default listingRoute;