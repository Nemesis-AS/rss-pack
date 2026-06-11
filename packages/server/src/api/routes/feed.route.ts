import express from "express";
import {
  addFeedMonitoring,
  disableFeed,
  getAllFeeds,
  getArticlesByFeedid,
  getFeedById,
  removeFeedMonitoring,
  setRefreshInterval,
  syncFeed,
} from "../controllers/feed.controller";
import validateDto from "../middlewares/validate-dto";
import {
  addFeedMonitoringDto,
  feedIdParamDto,
  getAllFeedsDto,
  getArticlesByFeedDto,
  setRefreshIntervalDto,
} from "../dto";

const router = express.Router();

router.get("/", validateDto(getAllFeedsDto), getAllFeeds);
router.post("/", validateDto(addFeedMonitoringDto), addFeedMonitoring);
router.get("/:id", validateDto(feedIdParamDto), getFeedById);
router.delete("/:id", validateDto(feedIdParamDto), removeFeedMonitoring);
router.get(
  "/:id/articles",
  validateDto(getArticlesByFeedDto),
  getArticlesByFeedid,
);
router.post("/:id/disable", validateDto(feedIdParamDto), disableFeed);
router.patch(
  "/:id/refresh-interval",
  validateDto(setRefreshIntervalDto),
  setRefreshInterval,
);
router.post("/:id/sync", validateDto(feedIdParamDto), syncFeed);

export default router;
