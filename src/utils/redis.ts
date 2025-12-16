import { createClient, type RedisClientType } from "redis";

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

let redisClient: RedisClientType | null = null;

export const connectRedis = async () => {
  if (redisClient) return redisClient;

  const client: RedisClientType = createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
  });

  client.on("error", (err) => {
    console.error("Redis Client Error:", err);
  });

  await client.connect();

  redisClient = client;
  console.log("Redis connected");

  return redisClient;
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis not initialized. Call connectRedis first.");
  }
  return redisClient;
};
