import path from "path";
import express from "express";
import pinoHttp from "pino-http";

import feedRoutes from "./api/routes/feed.route.js";
import articleRoutes from "./api/routes/article.route.js";
import errorHandler from "./api/middlewares/error-handler.js";
import logger from "./utils/logger.js";

const app = express();
app.use(pinoHttp({ logger }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/feeds", feedRoutes);
app.use("/articles", articleRoutes);

app.use(errorHandler);

export default app;
