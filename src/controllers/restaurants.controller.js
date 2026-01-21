import prisma from "../db.js";
import { buildBasicQueries } from "../filters/restaurants/basic.js";
import { buildMealBasedQueries } from "../filters/restaurants/mealBased.js";
import { buildMonetaryQueries } from "../filters/restaurants/monetary.js";
import { safeJson } from "../utils/helper.js";
import { OFFSET } from "../utils/constants.js";

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
  try {
    const { page } = req.query;
    const skip = page && parseInt(page) > 1 ? (parseInt(page) - 1) * OFFSET : 0;

    const whereClause = {
      AND: [
        ...buildBasicQueries(req.query),
        ...buildMonetaryQueries(req.query),
        ...buildMealBasedQueries(req.query),
      ],
    };

    let totalPageNumbers = await countTotalPages(whereClause);
    if (page > totalPageNumbers) {
      return res.status(200).json({ message: "No more restaurants found",restaurants:[] });
    }

    const restaurants = await prisma.restaurants.findMany({
      take: OFFSET,
      skip: skip,
      where: whereClause,
      orderBy: { effective_discount: "desc" },
      include: {
        restaurant_cuisines: {
          include: {
            cuisines: true,
          },
        },
        restaurant_meal_types: {
          include: {
            meal_types: true,
          },
        },
      },
    });
    return res.status(200).json({
      restaurants: safeJson(formatRestaurants(restaurants)),
      pages: totalPageNumbers,
    });
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Something went wrong", controller: "Restaurant" });
  }
};

const countTotalPages = async (where) => {
  const totalRestaurants = await prisma.restaurants.count({
    where: where,
  });
  return Math.ceil(totalRestaurants / OFFSET);
};

const formatRestaurants = (restaurants) => {
  return restaurants.map((r) => {
    const { restaurant_cuisines, restaurant_meal_types, ...restaurant } = r;

    return {
      ...restaurant,
      cuisines: restaurant_cuisines.map((rc) => rc.cuisines),
      meal_types: restaurant_meal_types.map((rm) => rm.meal_types),
    };
  });
};
