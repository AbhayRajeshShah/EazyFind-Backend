import prisma from "../db.js";
import { safeJson } from "../utils/helper.js";

export const getCuisines = async (req, res) => {
  try {
    const cuisines = await prisma.cuisines.findMany();
    return res.json(safeJson(cuisines));
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};
