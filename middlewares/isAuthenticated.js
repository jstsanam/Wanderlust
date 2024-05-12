const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {          //isAuthenticated is an inbuilt method by passport.js which checks a logged in user
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must sign in first to modify the listing 💁🏻‍♀️")
        return res.redirect("/auth/signin");
    }
    next();
}

export { isAuthenticated };