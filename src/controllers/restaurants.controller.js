import prisma from "../db.js";
import { buildBasicQueries } from "../filters/restaurants/basic.js";
import { buildMonetaryQueries } from "../filters/restaurants/monetary.js";
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

export const getRestaurants = async (req, res) => {
  const restaurants = await prisma.restaurants.findMany({
    take: 10,
    where: {
      AND: [
        ...buildBasicQueries(req.query),
        ...buildMonetaryQueries(req.query),
      ],
    },
  });
  return res.status(200).json(safeJson(restaurants));

  // const restaurants = await prisma.restaurants.findMany({
  //   where,
  //   include: {
  //     restaurant_cuisines: {
  //       include: {
  //         cuisines: true,
  //       },
  //     },
  //     restaurant_meal_types: {
  //       include: {
  //         meal_types: true,
  //       },
  //     },
  //   },
  // });
};
