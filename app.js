import express from "express";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import logger from "./logger/logger.js";
import initDB from "./init/index.js";
import listingRoute from "./routes/listingRoute.js";
import indexRoute from "./routes/indexRoute.js";
import ExpressError from "./utils/expressError.js";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Middlewares
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Initialising database
initDB();

// Routes
app.use("/", indexRoute)
app.use("/listings", listingRoute)

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found !"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  logger.info("Listening on port 8080");
});
