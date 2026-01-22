import redisClient from "../redis.js";

export const cacheSet = async (key, payload, ttl = 7200) => {
  if (!key) return null;

  try {
    await redisClient.SETEX(key, ttl, JSON.stringify(payload));
  } catch (e) {
    console.log(e);
    console.warn("Redis set failed for", key);
  }
};

export const cacheGet = async (key) => {
  try {
    if (!key) return null;
    let data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn("Redis get failed for", key);
  }
};
