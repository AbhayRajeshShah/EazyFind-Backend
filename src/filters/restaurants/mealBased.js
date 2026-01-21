import { parseArray } from "../../utils/helper.js";

export const buildMealBasedQueries = (req) => {
  let { mealtypeIds, cuisineIds } = req;
  let filters = [];

  if (mealtypeIds) {
    const mIds = parseArray(mealtypeIds);

    filters.push({
      restaurant_meal_types: {
        some: {
          meal_type_id: {
            in: mIds,
          },
        },
      },
    });
  }

  if (cuisineIds) {
    const cIds = parseArray(cuisineIds);

    filters.push({
      restaurant_cuisines: {
        some: {
          cuisine_id: {
            in: cIds,
          },
        },
      },
    });
  }
  return filters;
};
