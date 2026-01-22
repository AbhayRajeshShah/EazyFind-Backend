import prisma from "../db.js";
import { safeJson } from "../utils/helpers.js";
import { cacheGet, cacheSet } from "../utils/cache.js";

export const getCities = async (req, res) => {
  try {
    const cacheKey = "cities";
    const data = await cacheGet(cacheKey);
    if (data) {
      return res.status(200).json(data);
    }
    const cities = await prisma.cities.findMany({ orderBy: { id: "asc" } });
    await cacheSet(cacheKey, safeJson(cities));
    return res.status(200).json(safeJson(cities));
  } catch (e) {
    console.log(e);
    return res.status(404).json({ error: "Something went wrong" });
  }
};
