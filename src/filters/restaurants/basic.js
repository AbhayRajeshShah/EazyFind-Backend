export const buildBasicQueries = (req) => {
  const { city, name, rating, area } = req;
  const filters = [];
  if (city) {
    filters.push({ city });
  }
  if (name) {
    filters.push({
      restaurant_name: {
        contains: name,
        mode: "insensitive",
      },
    });
  }
  if (area) {
    filters.push({
      area: {
        contains: area,
        mode: "insensitive",
      },
    });
  }
  if (rating) {
    filters.push({
      rating: {
        gte: parseInt(rating),
      },
    });
  }
  return filters;
};
