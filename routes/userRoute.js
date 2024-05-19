import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middlewares/sessionMiddleware.js";
import {
    renderSignupPage,
    signup,
    renderSigninPage,
    signin,
    signout
} from "../controllers/userController.js";

const userRoute = express.Router();

userRoute
    .route("/signup")
    .get(renderSignupPage)
    .post(wrapAsync(signup))

userRoute
    .route("/signin")
    .get(renderSigninPage)
    .post(saveRedirectUrl,
        passport.authenticate("local", {   // route middleware to authenticate user
            failureRedirect: "/auth/signin",
            failureFlash: true
        }),
        signin
    );

userRoute.get("/signout",
    signout
)

userRoute.get("/signout", (req, res, next) => {
    req.logout((err) => {         // passport's method to automatically logout user
        if (err) {
            return next(err);
        }
        req.flash("success", "User logged out successfully ✅")
        res.redirect("/auth/signin");
    })
})

export default userRoute;