import mongoose from "mongoose";
import sampleListings from "./data.js";
import Listing from "../models/listing.js";
import logger from "../logger/logger.js";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

async function connectDB() {
  await mongoose.connect(DATABASE_URL);
}

const initDB = async () => {
  try {
    await connectDB();
    logger.info("Connected to DB");
    // Set REINITIATE_DB to true in the .env file to clear the database 
    // and reinitialize it with predefined values
    if (process.env.REINITIATE_DB === 'true') {
      await Listing.deleteMany({});
      logger.info("Deleted the listings data")
      await Listing.insertMany(sampleListings);
      logger.info("Inserted sample listings")
    }
  } catch (ex) {
    logger.error(err);
  }
}

export default initDB;