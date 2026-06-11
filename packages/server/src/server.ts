import app from "./app.js";
import { startScheduler } from "./scheduler/index.js";
import logger from "./utils/logger.js";
import { config } from "./config/index.js";

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

startScheduler();
