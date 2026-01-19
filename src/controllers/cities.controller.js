import prisma from "../db.js";
import { safeJson } from "../utils/helper.js";

export const getCities = async (req, res) => {
  try {
    const cities = await prisma.cities.findMany({ orderBy: { id: "asc" } });
    return res.status(200).json(safeJson(cities));
  } catch (e) {
    return res.status(404).json({ error: "Something went wrong" });
  }
};
