import "dotenv/config";

export const config = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
  databasePath: process.env.DATABASE_PATH || "file:db.sqlite3",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
};
