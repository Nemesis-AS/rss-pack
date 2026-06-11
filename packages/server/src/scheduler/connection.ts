import IORedis from 'ioredis';
import { config } from "../config/index.js";

const connection = new IORedis(config.redisUrl, {
  maxRetriesPerRequest: null,
});

export default connection;
