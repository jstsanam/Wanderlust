import express from "express";
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";

const userRoute = express.Router();

userRoute.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

userRoute.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log({ registeredUser });
        req.flash("success", "User registered successfully ✅");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

userRoute.get("/signin", (req, res) => {
    res.render("users/signin.ejs");
});

userRoute.post("/signin",
    passport.authenticate("local", {   // route middleware to authenticate user
        failureRedirect: "/signin",
        failureFlash: true
    }),
    async (req, res) => {
        req.flash("success", "Welcome back to Wanderlust 🌻");
        res.redirect("/listings");
    });

export default userRoute;