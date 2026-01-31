import { createClient } from "redis";

let redisClient = null;

if (process.env.REDIST_URL) {
  redisClient = createClient({
    url: process.env.REDIST_URL,
  });
  redisClient.connect();

  redisClient.on("error", (err) => {});

  redisClient.on("connect", () => {
    console.log("Connected to Redis");
  });
}

export default redisClient;
