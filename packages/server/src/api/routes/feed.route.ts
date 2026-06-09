import express from "express";
import {
  addFeedMonitoring,
  disableFeed,
  getAllFeeds,
  getArticlesByFeedid,
  getFeedById,
  removeFeedMonitoring,
  syncFeed,
} from "../controllers/feed.controller";
import validateDto from "../middlewares/validate-dto";
import { getAllFeedsDto } from "../dto";

const router = express.Router();

router.get("/", validateDto(getAllFeedsDto), getAllFeeds);
router.post("/", addFeedMonitoring);
router.get("/:id", getFeedById);
router.delete("/:id", removeFeedMonitoring);
router.get("/:id/articles", getArticlesByFeedid);
router.post("/:id/disable", disableFeed);
router.post("/:id/sync", syncFeed);

export default router;
