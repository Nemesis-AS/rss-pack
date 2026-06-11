import app from "./app.js";
import { startScheduler } from "./scheduler/index.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

startScheduler();
