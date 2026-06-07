import express from "express";

import feedRoutes from "./api/routes/feed.route";
import errorHandler from "./api/middlewares/error-handler";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/feeds", feedRoutes);

app.use(errorHandler);

export default app;
