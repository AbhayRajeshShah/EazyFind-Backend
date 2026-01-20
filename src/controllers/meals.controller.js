import prisma from "../db.js";
import { safeJson } from "../utils/helper.js";

export const getMealTypes = async (req, res) => {
  try {
    const mealTypes = await prisma.meal_types.findMany();
    return res.status(200).json(safeJson(mealTypes));
  } catch (e) {
    return res.json({ error: "Something Went wrong" });
  }
};
