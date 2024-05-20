import express from "express";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import logger from "./logger/logger.js";
import initDB from "./init/index.js";
import listingRoute from "./routes/listingRoute.js";
import userRoute from "./routes/userRoute.js";
import indexRoute from "./routes/indexRoute.js";
import ExpressError from "./utils/expressError.js";
import flash from "connect-flash";
import { sessionMiddleware } from "./middlewares/sessionMiddleware.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/userSchema.js";

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

// Creating session
app.use(sessionMiddleware);

// Implementing Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());     // user related info session m store krana
passport.deserializeUser(User.deserializeUser());     // user related info session se remove krana

// Implementing flash messages
app.use(flash());
app.use((req, res, next) => {
  // locals are the variables which are accessible in the whole code
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// Routes
app.use("/", indexRoute)
app.use("/listings", listingRoute)
app.use("/auth", userRoute)

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
