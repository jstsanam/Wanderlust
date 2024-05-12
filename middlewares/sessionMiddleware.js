import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

const sessionDuration = 7 * 24 * 60 * 60 * 1000;

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET_CODE,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + sessionDuration,
      maxAge: sessionDuration,
      httpOnly: true,
    }
})

const saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

export { sessionMiddleware, saveRedirectUrl };