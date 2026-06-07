import express from "express";
import {
  getAllArticles,
  getArticleById,
  setArticleRead,
  setArticleStarred,
} from "../controllers/article.controller";

const router = express.Router();

router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.post("/:id/star", setArticleStarred);
router.post("/:id/mark-read", setArticleRead);

export default router;
