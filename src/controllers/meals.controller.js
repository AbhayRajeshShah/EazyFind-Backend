import prisma from "../db.js";
import { safeJson } from "../utils/helpers.js";
import { cacheGet, cacheSet } from "../utils/cache.js";

export const getMealTypes = async (req, res) => {
  try {
    const cacheKey = "mealTypes";
    const cachedData = await cacheGet(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const mealTypes = await prisma.meal_types.findMany();

    await cacheSet(cacheKey, safeJson(mealTypes));

    return res.status(200).json(safeJson(mealTypes));
  } catch (e) {
    return res.json({ error: "Something Went wrong" });
  }
};
