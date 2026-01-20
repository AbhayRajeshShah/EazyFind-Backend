import express from "express";
import { getMealTypes } from "../controllers/meals.controller.js";

const router = express.Router();

router.get("/", getMealTypes);

export default router;
