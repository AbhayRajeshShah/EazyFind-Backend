import { OFFSET } from "./constants.js";
import { Prisma } from "@prisma/client";

export const getRawQuery = (parsed, offset) => {
  if (!parsed.free) {
    parsed.free = null;
  }
  return Prisma.sql`
SELECT
  r.id,
  r.restaurant_name,
  r.city,
  r.area,
  r.cost_for_two,
  r.rating,
  r.offer,
  r.effective_discount,
  r.image_url,
  r.url,
  ST_Distance(
    r.geo,
    ST_MakePoint(${parsed.lon}, ${parsed.lat})::geography
  ) AS distance_meters

FROM restaurants r

WHERE
  r.is_duplicate = false
  AND (${parsed.city}::text IS NULL OR r.city = ${parsed.city})
  AND (${parsed.name}::text IS NULL OR r.restaurant_name ILIKE '%' || ${parsed.name} || '%')
  AND (${parsed.area}::text IS NULL OR r.area ILIKE '%' || ${parsed.area} || '%')
  AND (${parsed.rating}::numeric IS NULL OR r.rating >= ${parsed.rating})
  AND (${parsed.minCost}::int IS NULL OR r.cost_for_two >= ${parsed.minCost})
  AND (${parsed.maxCost}::int IS NULL OR r.cost_for_two <= ${parsed.maxCost})
  AND (${parsed.discount}::float IS NULL OR r.effective_discount >= ${parsed.discount})
  AND (${parsed.free}::boolean IS NULL OR r.free = ${parsed.free})

  AND (
    ${parsed.cuisineIds}::bigint[] IS NULL
    OR EXISTS (
      SELECT 1
      FROM restaurant_cuisines rc
      WHERE rc.restaurant_id = r.id
        AND rc.cuisine_id = ANY(${parsed.cuisineIds})
    )
  )

  AND (
    ${parsed.mealtypeIds}::bigint[] IS NULL
    OR EXISTS (
      SELECT 1
      FROM restaurant_meal_types rm
      WHERE rm.restaurant_id = r.id
        AND rm.meal_type_id = ANY(${parsed.mealtypeIds})
    )
  )

ORDER BY r.effective_discount DESC, distance_meters ASC,r.id ASC
LIMIT ${OFFSET}
OFFSET ${offset};
`;
};

export const getCityByLocationQuery = (city, location) => {
  const { lat, lon } = location;
  const delhiNCR = new Set(["delhi", "gurgaon", "noida", "gurugram"]);
  const chandigarhCities = new Set(["chandigarh", "panchkula", "mohali"]);
  if (city) {
    if (delhiNCR.has(city.toLowerCase())) {
      city = "delhi-ncr";
    }
    if (chandigarhCities.has(city.toLowerCase())) {
      city = "chandigarh-tricity";
    }
  }

  return Prisma.sql`
    SELECT city_name
    FROM cities
    ORDER BY
      CASE
        WHEN city_name = ${city} THEN 0
        ELSE 1
      END,
      geo <-> ST_SetSRID(
      ST_MakePoint(${lon}::double precision, ${lat}::double precision),
      4326
      )
    LIMIT 1;
  `;
};
