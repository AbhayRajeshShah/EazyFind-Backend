export const safeJson = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
};

export const convertFloat = (num) => {
  let d = parseFloat(num);
  return isNaN(d) ? false : d;
};

export const parseArray = (s) => {
  return s.split(",").map((e) => parseInt(e.split("-").pop()));
};

export const buildCacheKey = (base, query) => {
  const sortedQuery = Object.keys(query)
    .sort()
    .map((k) => `${k}=${query[k]}`)
    .join("&");

  return `${base}?${sortedQuery}`;
};

// parse req param body into fields
export const getParsedQueryObject = (req) => {
  const {
    city,
    name,
    area,
    rating,
    minCost,
    maxCost,
    discount,
    free,
    lat,
    lon,
    cuisineIds,
    mealtypeIds,
  } = req.query;
  const parsed = {
    city: city ?? null,
    name: name ?? null,
    area: area ?? null,
    rating: rating ? Number(rating) : null,
    minCost: minCost ? Number(minCost) : null,
    maxCost: maxCost ? Number(maxCost) : null,
    discount: discount ? Number(discount) / 100 : null,
    free: free === "true" ? true : free === "false" ? false : null,
    lat: lat ? Number(lat) : null,
    lon: lon ? Number(lon) : null,
    cuisineIds: cuisineIds
      ? cuisineIds.split(",").map((e) => Number(e.split("-").pop()))
      : null,
    mealtypeIds: mealtypeIds
      ? mealtypeIds.split(",").map((e) => Number(e.split("-").pop()))
      : null,
  };
  return parsed;
};
