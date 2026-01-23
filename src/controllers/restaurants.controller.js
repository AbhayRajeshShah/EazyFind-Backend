import prisma from "../db.js";
import { buildBasicQueries } from "../filters/restaurants/basic.js";
import { buildMealBasedQueries } from "../filters/restaurants/mealBased.js";
import { buildMonetaryQueries } from "../filters/restaurants/monetary.js";
import { getRawQuery } from "../utils/query.js";
import {
  safeJson,
  buildCacheKey,
  getParsedQueryObject,
} from "../utils/helpers.js";
import { OFFSET } from "../utils/constants.js";
import { cacheGet, cacheSet } from "../utils/cache.js";

export const getRestaurants = async (req, res) => {
  try {
    const cacheKey = buildCacheKey("restaurants", req.query);
    const cachedData = await cacheGet(cacheKey);

    if (cachedData) {
      return res.status(200).json(cachedData);
    }
    console.log(req.query);
    const { page } = req.query;
    const skip = page && parseInt(page) > 1 ? (parseInt(page) - 1) * OFFSET : 0;

    const whereClause = {
      AND: [
        ...buildBasicQueries(req.query),
        ...buildMonetaryQueries(req.query),
        ...buildMealBasedQueries(req.query),
        { is_duplicate: false },
      ],
    };
    const parsed = getParsedQueryObject(req);

    let totalPageNumbers = await countTotalPages(whereClause);
    if (page > totalPageNumbers) {
      return res.status(200).json({ pages: totalPageNumbers, restaurants: [] });
    }

    const restaurants = await prisma.$queryRaw(getRawQuery(parsed, skip));

    let payload = {
      restaurants: safeJson(restaurants),
      pages: totalPageNumbers,
    };

    await cacheSet(cacheKey, payload);

    return res.status(200).json(payload);
  } catch (e) {
    console.log(e);
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
