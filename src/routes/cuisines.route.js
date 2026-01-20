import express from "express";
import { getCuisines } from "../controllers/cuisines.controller.js";

const router = express.Router();

router.get("/", getCuisines);

export default router;
