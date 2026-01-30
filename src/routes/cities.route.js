import express from "express";
import {
  getCities,
  getCityByUserLocation,
} from "../controllers/cities.controller.js";

const router = express.Router();

router.get("/", getCities);
router.get("/getCity", getCityByUserLocation);

export default router;
