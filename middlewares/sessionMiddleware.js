import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();

const sessionDuration = 7 * 24 * 60 * 60 * 1000;

const mongoStore = MongoStore.create({
  mongoUrl: process.env.DATABASE_URL,
  crypto: {
    secret: process.env.SESSION_SECRET_CODE
  },
  // touchAfter is interval (in seconds) between session updates
  touchAfter: 24 * 3600
})

const sessionMiddleware = session({
    store: mongoStore,
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