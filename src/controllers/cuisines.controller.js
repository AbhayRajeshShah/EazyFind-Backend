import prisma from "../db.js";
import { safeJson } from "../utils/helpers.js";
import { cacheGet, cacheSet } from "../utils/cache.js";

export const getCuisines = async (req, res) => {
  try {
    const cacheKey = "cuisines";
    const cachedData = await cacheGet(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const cuisines = await prisma.cuisines.findMany();

    await cacheSet(cacheKey, safeJson(cuisines));

    return res.json(safeJson(cuisines));
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};
