import express from "express";
import { getRestaurants } from "../controllers/restaurants.controller.js";

const router = express.Router();

router.get("/", getRestaurants);

export default router;
