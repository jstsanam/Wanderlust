import express from "express";

const indexRoute = express.Router();

indexRoute.get("/", (req, res) => {
    res.render("./listings/welcome.ejs");
});

export default indexRoute;