import app from "./app";
import { startScheduler } from "./scheduler";
import logger from "./utils/logger";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

startScheduler();
