import express from "express";
import { getRestaurantsByCity } from "../controllers/restaurants.controller.js";

const router = express.Router();

router.get("/:city", getRestaurantsByCity);

export default router;
