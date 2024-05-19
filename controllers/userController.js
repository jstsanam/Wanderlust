import User from "../models/userSchema.js";

const renderSignupPage = (req, res) => {
    res.render("users/signup.ejs");
}

const signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(`${registeredUser.username} registered`);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", `Welcome to Wanderlust ${registeredUser.username} 🧚🏻‍♀️`)
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/auth/signup");
    }
}

const renderSigninPage = (req, res) => {
    res.render("users/signin.ejs");
}

const signin = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust 💁🏻‍♀️");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

const signout = (req, res, next) => {
    req.logout((err) => {         // passport's method to automatically logout user
        if (err) {
            return next(err);
        }
        req.flash("success", "User logged out successfully ✅")
        res.redirect("/auth/signin");
    })
}

export {
    renderSignupPage,
    signup,
    renderSigninPage,
    signin,
    signout
};