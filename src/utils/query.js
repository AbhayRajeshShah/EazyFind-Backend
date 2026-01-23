import { OFFSET } from "./constants.js";
import { Prisma } from "@prisma/client";

export const getRawQuery = (parsed, offset) => {
  return Prisma.sql`
SELECT
  r.id,
  r.restaurant_name,
  r.city,
  r.area,
  r.cost_for_two,
  r.rating,
  r.offer,
  r.percentage,
  r.effective_discount,
  r.free,
  r.latitude,
  r.longitude,
  r.image_url,

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


ORDER BY r.effective_discount DESC, distance_meters ASC
LIMIT ${OFFSET}
OFFSET ${offset};
`;
};
