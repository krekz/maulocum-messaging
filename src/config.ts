import IORedis from "ioredis";

const REDIS_URL = process.env.CONTAINER_REDIS_URL;

if (!REDIS_URL) {
    throw new Error("Missing Redis credentials in .env file");
}

export const redisConnection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
});

