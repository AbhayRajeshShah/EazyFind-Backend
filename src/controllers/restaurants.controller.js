import prisma from "../db.js";
import { safeJson } from "../utils/helper.js";

export const getRestaurantsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const restaurants = await prisma.restaurants.findMany({
      take: 10,
      where: { city: city },
      orderBy: { effective_discount: "desc" },
    });
    return res.status(200).json(safeJson(restaurants));
  } catch (e) {
    return res.status(400).json({ error: "Something went wrong" });
  }
};
