import express from "express";
import {
  addFeedMonitoring,
  getAllFeeds,
  getArticlesByFeedid,
  getFeedById,
} from "../controllers/feed.controller";

const router = express.Router();

router.get("/", getAllFeeds);
router.post("/", addFeedMonitoring);
router.get("/:id", getFeedById);
router.get("/:id/articles", getArticlesByFeedid);

export default router;
