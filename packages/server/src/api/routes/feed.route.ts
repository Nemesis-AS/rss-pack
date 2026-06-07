import express from "express";
import {
  addFeedMonitoring,
  disableFeed,
  getAllFeeds,
  getArticlesByFeedid,
  getFeedById,
  removeFeedMonitoring,
} from "../controllers/feed.controller";

const router = express.Router();

router.get("/", getAllFeeds);
router.post("/", addFeedMonitoring);
router.get("/:id", getFeedById);
router.delete("/:id", removeFeedMonitoring);
router.get("/:id/articles", getArticlesByFeedid);
router.post("/:id/disable", disableFeed);

export default router;
