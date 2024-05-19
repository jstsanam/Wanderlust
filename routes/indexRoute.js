import express from "express";
import { index } from "../controllers/indexController.js";

const indexRoute = express.Router();

indexRoute.get("/", index);

export default indexRoute;