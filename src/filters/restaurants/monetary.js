import { convertFloat } from "../../utils/helper.js";
export const buildMonetaryQueries = (req) => {
  const { minCost, maxCost, discount, free } = req;
  const filters = [];
  if (minCost && maxCost) {
    filters.push({
      cost_for_two: {
        gte: parseInt(minCost),
        lte: parseInt(maxCost),
      },
    });
  }
  if (discount) {
    filters.push({
      effective_discount: {
        gte: discount / 100,
      },
    });
  }
  if (free === "true") {
    filters.push({
      free: true,
    });
  }
  console.log(filters);
  return filters;
};
