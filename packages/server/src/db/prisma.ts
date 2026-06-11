import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../db/generated/prisma/client.js";
import { config } from "../config/index.js";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: config.databasePath,
  }),
});

export default prisma;
