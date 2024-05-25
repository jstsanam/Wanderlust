import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isUserListingOwner, isUserReviewAuthor } from "../middlewares/isAuthorized.js";
import { validateListing } from "../middlewares/validateListing.js";
import { validateReview } from "../middlewares/validateReview.js";
import {
  listingIndexPage,
  showNewListing,
  showListing,
  createNewListing,
  showEditListing,
  editListing,
  deleteListing,
  createReview,
  deleteReview
} from "../controllers/listingController.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";

const listingRoute = express.Router();
// multer is node.js middleware for handling multipart/form-data (specially upload media)
const upload = multer({ storage });

listingRoute
  .route("/")
  .get(wrapAsync(listingIndexPage))
  .post(
    isAuthenticated,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(createNewListing)
  );

listingRoute.get("/new",
  isAuthenticated,
  showNewListing
);

listingRoute
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isAuthenticated,
    isUserListingOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(editListing)
  )
  .delete(
    isAuthenticated,
    isUserListingOwner,
    wrapAsync(deleteListing)
  );

listingRoute.get("/:id/edit",
  isAuthenticated,
  isUserListingOwner,
  wrapAsync(showEditListing)
);

listingRoute.post("/:id/reviews",
  isAuthenticated,
  validateReview,
  wrapAsync(createReview)
);

listingRoute.delete("/:id/reviews/:reviewId",
  isAuthenticated,
  isUserReviewAuthor,
  wrapAsync(deleteReview)
);

export default listingRoute;

// Mongo $pull matches with value and deletes.