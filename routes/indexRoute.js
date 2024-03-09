import express from "express";

const indexRoute = express.Router();

indexRoute.get("/", (req, res) => {
    res.send("Hi I am Sanam");
});

export default indexRoute;