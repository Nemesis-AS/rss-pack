import express from "express";
import pinoHttp from "pino-http";

import feedRoutes from "./api/routes/feed.route";
import articleRoutes from "./api/routes/article.route";
import errorHandler from "./api/middlewares/error-handler";
import logger from "./utils/logger";

const app = express();
app.use(pinoHttp({ logger }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/feeds", feedRoutes);
app.use("/articles", articleRoutes);

app.use(errorHandler);

export default app;
