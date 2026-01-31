import prisma from "../db.js";
import { safeJson } from "../utils/helpers.js";
import { cacheGet, cacheSet } from "../utils/cache.js";
import { getCityByLocationQuery } from "../utils/query.js";

export const getCities = async (req, res) => {
  try {
    const cacheKey = "cities";
    const data = await cacheGet(cacheKey);
    if (data) {
      return res.status(200).json(data);
    }
    const cities = await prisma.cities.findMany({ orderBy: { id: "asc" } });
    await cacheSet(cacheKey, safeJson(cities));
    return res.status(200).json(safeJson(cities));
  } catch (e) {
    console.log(e);
    return res.status(404).json({ error: "Something went wrong" });
  }
};

export const getCityByUserLocation = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required" });
  }

  try {
    // 3rd party API to reverse geoencode lat and lon to get city
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`,
    );

    if (!response.ok) {
      return res.json({ error: "Geoapify API error", city: "delhi-ncr" });
    }

    const geoData = await response.json();

    const cityName = geoData.results?.[0]?.city;

    const closestCity = await prisma.$queryRaw(
      getCityByLocationQuery(cityName, { lat, lon }),
    );

    return res.json({ city: closestCity?.[0]?.city_name ?? "delhi-ncr" });
  } catch (error) {
    console.error("Error fetching city by location:", error);
    return res.json({
      error: "Something went wrong with fetching DB",
      city: "delhi-ncr",
    });
  }
};
