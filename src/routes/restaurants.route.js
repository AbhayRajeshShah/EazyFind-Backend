import express from "express";
import {
  getRestaurants,
  getRestaurantsByCity,
} from "../controllers/restaurants.controller.js";

const router = express.Router();

router.get("/:city", getRestaurantsByCity);
router.get("/", getRestaurants);

export default router;
